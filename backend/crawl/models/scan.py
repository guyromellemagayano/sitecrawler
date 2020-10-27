from django.db import models
from django.db.models import F, OuterRef, Q
from django.db.models.query import QuerySet

from crawl.common import CalculatedField, SubQueryCount
from crawl.models import Link


class ScanQuerySet(QuerySet):
    def details(self):
        pages = Link.objects.filter(type=Link.TYPE_PAGE, scan_id=OuterRef("pk"))
        external_links = Link.objects.filter(type=Link.TYPE_EXTERNAL, scan_id=OuterRef("pk"))
        links = Link.objects.filter(scan_id=OuterRef("pk"), pages__isnull=False)
        images = Link.objects.filter(scan_id=OuterRef("pk"), image_pages__isnull=False)
        scripts = Link.objects.filter(scan_id=OuterRef("pk"), script_pages__isnull=False)
        stylesheets = Link.objects.filter(scan_id=OuterRef("pk"), stylesheet_pages__isnull=False)
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
            .annotate(num_pages_big=SubQueryCount(pages.annotate_size().filter(size_total__gt=1024 * 1024)))
            .annotate(num_pages_tls_non_ok=SubQueryCount(pages.annotate_tls().exclude(tls_total=1)))
        )


class Scan(models.Model):
    objects = ScanQuerySet.as_manager()

    site = models.ForeignKey("Site", on_delete=models.CASCADE, null=False)
    started_at = models.DateTimeField(auto_now_add=True, null=False)
    finished_at = models.DateTimeField(null=True, blank=True)

    email_sent = models.BooleanField(default=False)

    num_pages_tls_ok = CalculatedField("num_pages", "-num_pages_tls_non_ok")
    num_ok_links = CalculatedField("num_links", "-num_non_ok_links")
    num_ok_images = CalculatedField("num_images", "-num_non_ok_images")
    num_ok_scripts = CalculatedField("num_scripts", "-num_non_ok_scripts")
    num_ok_stylesheets = CalculatedField("num_stylesheets", "-num_non_ok_stylesheets")

    class Meta:
        permissions = (("can_start_scan", "Can start manual scan"),)
