from django.db import models, connections
from django.db.models import OuterRef, Q, Subquery
from django.db.models.query import QuerySet

from crawl.common import CalculatedField, SubQueryCount
from crawl.models import Link, ScanCache


class ScanQuerySet(QuerySet):
    def with_details(self):
        obj = self._chain()
        obj.query.with_details = True
        return obj

    def get(self, *args, recursive=False, **kwargs):
        if not getattr(self.query, "with_details", False):
            return super().get(*args, **kwargs)

        scan = super(ScanQuerySet, self.select_related("scancache")).get(*args, **kwargs)
        if hasattr(scan, "scancache"):
            if scan.scancache.is_valid(scan):
                scan.scancache.apply(scan)
                return scan
            else:
                scan.scancache.delete()

        # if there's currently no cache, we do this:
        # - get scan with select_for_update to lock the row
        # - use a recursive call to this get method to recheck cache after we have lock
        # - we set recursive=True to skip this lock in locked call to get and continue to creating scan cache
        # this method is optimized to do single query when cache is available
        if not recursive:
            super(ScanQuerySet, self.select_for_update(of=("self",))).get(*args, **kwargs)
            return self.select_related("site__team__crawl_config").get(*args, recursive=True, **kwargs)

        # use threshold from site if not null, otherwise from team's crawl config
        large_page_size_threshold = scan.site.large_page_size_threshold
        if not large_page_size_threshold:
            large_page_size_threshold = scan.site.team.crawl_config.large_page_size_threshold

        scan_with_details = Scan.objects.all()._details(large_page_size_threshold).get(*args, **kwargs)
        cache = ScanCache.objects.create_from_scan(scan_with_details)
        cache.apply(scan)

        return scan

    def _details(self, large_page_size_threshold):
        # annotate with details, all should start with `num_`, because that prefix is cached in ScanCache
        pages = Link.objects.filter(type=Link.TYPE_PAGE, scan_id=OuterRef("pk")).annotate_page_adjusted()
        external_links = Link.objects.filter(type=Link.TYPE_EXTERNAL, scan_id=OuterRef("pk"))
        links = Link.objects.filter(cached_link_occurences__gt=0, scan_id=OuterRef("pk")).annotate_link_adjusted()
        images = (
            Link.objects.filter(cached_image_occurences__gt=0, scan_id=OuterRef("pk"))
            .annotate_link_adjusted()
            .annotate_image_adjusted()
        )
        scripts = Link.objects.filter(cached_script_occurences__gt=0, scan_id=OuterRef("pk")).annotate_link_adjusted()
        stylesheets = Link.objects.filter(
            cached_stylesheet_occurences__gt=0, scan_id=OuterRef("pk")
        ).annotate_link_adjusted()
        seo_ok_pages = pages.exclude(
            Q(pagedata__title="") | Q(pagedata__description="") | Q(pagedata__h1_first="") | Q(pagedata__h2_first="")
        )

        def duplicated_count(field):
            return Subquery(
                pages.values(field)  # group by
                .annotate(cnt=models.Count("id", distinct=True))  # count pages pery field
                .filter(cnt__gt=1)  # only count duplicates
                .annotate(
                    total=models.Func(models.F("cnt"), function="SUM", template="%(function)s(%(expressions)s) OVER ()")
                )[
                    :1
                ]  # window sum over counts that are > 1, limit to 1 result
                .values("total")
            )

        return (
            self.annotate(num_pages=SubQueryCount(pages))
            .annotate(num_external_links=SubQueryCount(external_links))
            .annotate(num_links=SubQueryCount(links))
            .annotate(num_non_ok_links=SubQueryCount(links.exclude(status_adjusted=Link.STATUS_OK)))
            .annotate(num_images=SubQueryCount(images))
            .annotate(num_non_ok_images=SubQueryCount(images.exclude(status_adjusted=Link.STATUS_OK)))
            .annotate(num_scripts=SubQueryCount(scripts))
            .annotate(num_non_ok_scripts=SubQueryCount(scripts.exclude(status_adjusted=Link.STATUS_OK)))
            .annotate(num_stylesheets=SubQueryCount(stylesheets))
            .annotate(num_non_ok_stylesheets=SubQueryCount(stylesheets.exclude(status_adjusted=Link.STATUS_OK)))
            .annotate(num_pages_seo_ok=SubQueryCount(seo_ok_pages))
            .annotate(num_pages_without_title=SubQueryCount(pages.filter(pagedata__title="")))
            .annotate(num_pages_without_description=SubQueryCount(pages.filter(pagedata__description="")))
            .annotate(num_pages_without_h1_first=SubQueryCount(pages.filter(pagedata__h1_first="")))
            .annotate(num_pages_without_h1_second=SubQueryCount(pages.filter(pagedata__h1_second="")))
            .annotate(num_pages_without_h2_first=SubQueryCount(pages.filter(pagedata__h2_first="")))
            .annotate(num_pages_without_h2_second=SubQueryCount(pages.filter(pagedata__h2_second="")))
            .annotate(
                num_pages_big=SubQueryCount(pages.annotate_size().filter(size_total__gt=large_page_size_threshold))
            )
            .annotate(num_pages_tls_non_ok=SubQueryCount(pages.exclude(tls_total_adjusted=1)))
            .annotate(num_images_tls_non_ok=SubQueryCount(images.exclude(tls_status_adjusted=Link.TLS_OK)))
            .annotate(num_images_with_missing_alts=SubQueryCount(images.filter(missing_alts_adjusted__gt=0)))
            .annotate(
                num_images_fully_ok=SubQueryCount(
                    images.images().filter(
                        missing_alts_adjusted=0, tls_status_adjusted=Link.TLS_OK, status_adjusted=Link.STATUS_OK
                    )
                )
            )
            .annotate(
                num_pages_small_tls_ok=SubQueryCount(
                    pages.annotate_size().filter(size_total__lte=large_page_size_threshold, tls_total_adjusted=1)
                )
            )
            .annotate(num_pages_duplicated_title=duplicated_count("pagedata__title"))
            .annotate(num_pages_duplicated_description=duplicated_count("pagedata__description"))
        )

    def raw_bulk_delete(self, ids):
        if not ids:
            return
        ids = tuple(ids)
        print("Bulk scan delete", flush=True)
        with connections["superuser"].cursor() as cursor:
            print("Disabling triggers", flush=True)
            cursor.execute("SET session_replication_role = 'replica'")
            print("Deleting link links", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_links WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting link images", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_images WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting link scripts", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_scripts WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting link stylesheets", flush=True)
            cursor.execute(
                "DELETE FROM crawl_link_stylesheets WHERE from_link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting pagedata", flush=True)
            cursor.execute(
                "DELETE FROM crawl_pagedata WHERE link_id IN (SELECT id FROM crawl_link WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting links", flush=True)
            cursor.execute("DELETE FROM crawl_link WHERE scan_id IN (SELECT id FROM crawl_scan WHERE id IN %s)", [ids])
            print("Deleting fifo relations", flush=True)
            cursor.execute(
                "DELETE FROM crawl_fiforelation WHERE entry_id IN (SELECT id FROM crawl_fifoentry WHERE scan_id IN %s)",
                [ids],
            )
            print("Deleting fifo entries", flush=True)
            cursor.execute(
                "DELETE FROM crawl_fifoentry WHERE scan_id IN (SELECT id FROM crawl_scan WHERE id IN %s)", [ids]
            )
            print("Deleting scans", flush=True)
            cursor.execute("DELETE FROM crawl_scan WHERE id IN %s", [ids])
            print("Enabling triggers", flush=True)
            cursor.execute("SET session_replication_role = 'origin'")


class Scan(models.Model):
    objects = ScanQuerySet.as_manager()

    site = models.ForeignKey("Site", on_delete=models.CASCADE, null=False)
    started_at = models.DateTimeField(auto_now_add=True, null=False)
    finished_at = models.DateTimeField(null=True, blank=True)

    force_https = models.BooleanField(null=True, blank=True)

    num_pages_tls_ok = CalculatedField("num_pages", "-num_pages_tls_non_ok")
    num_ok_links = CalculatedField("num_links", "-num_non_ok_links")
    num_ok_images = CalculatedField("num_images", "-num_non_ok_images")
    num_ok_scripts = CalculatedField("num_scripts", "-num_non_ok_scripts")
    num_ok_stylesheets = CalculatedField("num_stylesheets", "-num_non_ok_stylesheets")
    num_images_tls_ok = CalculatedField("num_images", "-num_images_tls_non_ok")

    class Meta:
        permissions = (("can_start_scan", "Can start manual scan"),)

    def __str__(self):
        return f"{self.site}: {self.started_at.date()} ({self.id})"
