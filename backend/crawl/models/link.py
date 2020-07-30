from django.db import models
from django.db.models import Count, F, OuterRef
from django.db.models.query import QuerySet


from crawl.common import SubQueryCount


class LinkQuerySet(QuerySet):
    def pages(self):
        links = Link.objects.filter(pages__id=OuterRef("pk"))
        images = Link.objects.filter(image_pages__id=OuterRef("pk"))
        scripts = Link.objects.filter(script_pages__id=OuterRef("pk"))
        stylesheets = Link.objects.filter(stylesheet_pages__id=OuterRef("pk"))
        return (
            self.filter(type=Link.TYPE_PAGE)
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
            .order_by("-num_non_ok_links")
        )

    def links(self):
        return self.filter(pages__id__isnull=False).annotate(occurences=Count("pages")).order_by("-status")

    def images(self):
        return self.filter(image_pages__id__isnull=False).annotate(occurences=Count("image_pages")).order_by("-status")

    def scripts(self):
        return (
            self.filter(script_pages__id__isnull=False).annotate(occurences=Count("script_pages")).order_by("-status")
        )

    def stylesheets(self):
        return (
            self.filter(stylesheet_pages__id__isnull=False)
            .annotate(occurences=Count("stylesheet_pages"))
            .order_by("-status")
        )


class Link(models.Model):
    objects = LinkQuerySet.as_manager()

    TYPE_PAGE = 1
    TYPE_EXTERNAL = 2
    TYPE_OTHER = 3
    TYPE_NON_WEB = 4
    TYPE_CHOICES = [
        (TYPE_PAGE, "PAGE"),
        (TYPE_EXTERNAL, "EXTERNAL"),
        (TYPE_OTHER, "OTHER"),
        (TYPE_NON_WEB, "NON_WEB"),
    ]

    STATUS_OK = 1
    STATUS_TIMEOUT = 2
    STATUS_HTTP_ERROR = 3
    STATUS_OTHER_ERROR = 4
    STATUS_CHOICES = [
        (STATUS_OK, "OK"),
        (STATUS_TIMEOUT, "TIMEOUT"),
        (STATUS_HTTP_ERROR, "HTTP_ERROR"),
        (STATUS_OTHER_ERROR, "OTHER_ERROR"),
    ]

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    scan = models.ForeignKey("Scan", on_delete=models.CASCADE, null=False)
    type = models.PositiveSmallIntegerField(choices=TYPE_CHOICES, null=False)
    url = models.CharField(max_length=2048, null=False)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False)
    http_status = models.PositiveSmallIntegerField(null=True, blank=True)
    response_time = models.PositiveIntegerField(null=False)
    error = models.CharField(max_length=255, null=True, blank=True)

    links = models.ManyToManyField("self", symmetrical=False, related_name="pages", blank=True)

    images = models.ManyToManyField("self", symmetrical=False, related_name="image_pages", blank=True)
    stylesheets = models.ManyToManyField("self", symmetrical=False, related_name="stylesheet_pages", blank=True)
    scripts = models.ManyToManyField("self", symmetrical=False, related_name="script_pages", blank=True)

    def get_pages(self):
        return self.pages.all().union(self.image_pages.all(), self.script_pages.all(), self.stylesheet_pages.all())
