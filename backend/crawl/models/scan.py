from django.db import models
from django.db.models import Count, F, OuterRef
from django.db.models.query import QuerySet

from crawl.common import SubQueryCount
from crawl.models import Link


class ScanQuerySet(QuerySet):
    def details(self):
        pages = Link.objects.filter(type=Link.TYPE_PAGE, scan_id=OuterRef("pk"))
        external_links = Link.objects.filter(type=Link.TYPE_EXTERNAL, scan_id=OuterRef("pk"))
        links = Link.objects.filter(pages__scan_id=OuterRef("pk"))
        images = Link.objects.filter(image_pages__scan_id=OuterRef("pk"))
        scripts = Link.objects.filter(script_pages__scan_id=OuterRef("pk"))
        stylesheets = Link.objects.filter(stylesheet_pages__scan_id=OuterRef("pk"))
        return (
            self.annotate(num_pages=SubQueryCount(pages))
            .annotate(num_external_links=SubQueryCount(external_links))
            .annotate(num_links=SubQueryCount(links))
            .annotate(num_ok_links=SubQueryCount(links.filter(status=Link.STATUS_OK)))
            .annotate(num_non_ok_links=F("num_links") - F("num_ok_links"))
            .annotate(num_images=SubQueryCount(images))
            .annotate(num_ok_images=SubQueryCount(images.filter(status=Link.STATUS_OK)))
            .annotate(num_non_ok_images=F("num_images") - F("num_ok_images"))
            .annotate(num_scripts=SubQueryCount(scripts))
            .annotate(num_ok_scripts=SubQueryCount(scripts.filter(status=Link.STATUS_OK)))
            .annotate(num_non_ok_scripts=F("num_scripts") - F("num_ok_scripts"))
            .annotate(num_stylesheets=SubQueryCount(stylesheets))
            .annotate(num_ok_stylesheets=SubQueryCount(stylesheets.filter(status=Link.STATUS_OK)))
            .annotate(num_non_ok_stylesheets=F("num_stylesheets") - F("num_ok_stylesheets"))
            .annotate(num_pages_without_title=SubQueryCount(pages.filter(pagedata__title="")))
            .annotate(num_pages_without_description=SubQueryCount(pages.filter(pagedata__description="")))
            .annotate(num_pages_without_h1_first=SubQueryCount(pages.filter(pagedata__h1_first="")))
            .annotate(num_pages_without_h1_second=SubQueryCount(pages.filter(pagedata__h1_second="")))
            .annotate(num_pages_without_h2_first=SubQueryCount(pages.filter(pagedata__h2_first="")))
            .annotate(num_pages_without_h2_second=SubQueryCount(pages.filter(pagedata__h2_second="")))
        )


class Scan(models.Model):
    objects = ScanQuerySet.as_manager()

    site = models.ForeignKey("Site", on_delete=models.CASCADE, null=False)
    started_at = models.DateTimeField(auto_now_add=True, null=False)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        permissions = (("can_start_scan", "Can start manual scan"),)
