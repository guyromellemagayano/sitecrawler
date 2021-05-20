from django.db import models, connections
from django.db.models import F, OuterRef, Q, Value
from django.db.models.functions import Coalesce
from django.db.models.query import QuerySet

from crawl.common import CalculatedField, SubQueryCount
from crawl.models import Link


class ScanQuerySet(QuerySet):
    def details(self, user_large_page_size_threshold=1024 * 1024, large_page_size_threshold=None):
        # threshold is passed directly in view,
        # but when queried in bulk only user threshold is supplied and we need to do a join
        if not large_page_size_threshold:
            large_page_size_threshold = Coalesce(
                F("scan__site__large_page_size_threshold"), Value(user_large_page_size_threshold)
            )
        pages = Link.objects.filter(type=Link.TYPE_PAGE, scan_id=OuterRef("pk"))
        external_links = Link.objects.filter(type=Link.TYPE_EXTERNAL, scan_id=OuterRef("pk"))
        links = Link.objects.filter(cached_link_occurences__gt=0, scan_id=OuterRef("pk"))
        images = Link.objects.filter(cached_image_occurences__gt=0, scan_id=OuterRef("pk"))
        scripts = Link.objects.filter(cached_script_occurences__gt=0, scan_id=OuterRef("pk"))
        stylesheets = Link.objects.filter(cached_stylesheet_occurences__gt=0, scan_id=OuterRef("pk"))
        seo_ok_pages = pages.exclude(
            Q(pagedata__title="") | Q(pagedata__description="") | Q(pagedata__h1_first="") | Q(pagedata__h2_first="")
        )
        return (
            self.annotate(num_pages=SubQueryCount(pages))
            .annotate(num_external_links=SubQueryCount(external_links))
            .annotate(num_links=SubQueryCount(links))
            .annotate(num_non_ok_links=SubQueryCount(links.exclude(status=Link.STATUS_OK)))
            .annotate(num_images=SubQueryCount(images))
            .annotate(num_non_ok_images=SubQueryCount(images.exclude(status=Link.STATUS_OK)))
            .annotate(num_scripts=SubQueryCount(scripts))
            .annotate(num_non_ok_scripts=SubQueryCount(scripts.exclude(status=Link.STATUS_OK)))
            .annotate(num_stylesheets=SubQueryCount(stylesheets))
            .annotate(num_non_ok_stylesheets=SubQueryCount(stylesheets.exclude(status=Link.STATUS_OK)))
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
            .annotate(num_pages_tls_non_ok=SubQueryCount(pages.annotate_tls().exclude(tls_total=1)))
            .annotate(num_images_tls_non_ok=SubQueryCount(images.exclude(tls_status=Link.TLS_OK)))
            .annotate(num_images_with_missing_alts=SubQueryCount(images.filter(cached_image_missing_alts__gt=0)))
            .annotate(
                num_images_fully_ok=SubQueryCount(
                    images.images().filter(missing_alts=0, tls_status=Link.TLS_OK, status=Link.STATUS_OK)
                )
            )
            .annotate(
                num_pages_small_tls_ok=SubQueryCount(
                    pages.annotate_size().annotate_tls().filter(size_total__lte=large_page_size_threshold, tls_total=1)
                )
            )
        )

    def raw_bulk_delete(self, ids):
        if not ids:
            return
        ids = tuple(ids)
        print("Bulk scan delete", flush=True)
        with connections["superuser"].cursor() as cursor:
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
