from django.db import models
from django.db.models import (
    Count,
    Sum,
    F,
    OuterRef,
    Subquery,
    PositiveIntegerField,
)
from django.db.models.functions import Coalesce
from django.db.models.query import QuerySet


from crawl.common import CalculatedField, SubQueryCount


class SubQuerySizeSum(Subquery):
    output_field = PositiveIntegerField()

    def __init__(self, queryset, *args, **kwargs):
        queryset = queryset.annotate(total=Coalesce(Sum("size"), 0)).values("total")
        queryset.query.set_group_by()
        super().__init__(queryset, *args, **kwargs)


class LinkQuerySet(QuerySet):
    def annotate_size(self):
        return (
            self.annotate(size_images=F("cached_size_images"))
            .annotate(size_scripts=F("cached_size_scripts"))
            .annotate(size_stylesheets=F("cached_size_stylesheets"))
            .annotate(size_total=F("cached_size_total"))
        )

    def annotate_tls(self):
        return (
            self.annotate(num_non_tls_images=F("cached_num_non_tls_images"))
            .annotate(num_non_tls_scripts=F("cached_num_non_tls_scripts"))
            .annotate(num_non_tls_stylesheets=F("cached_num_non_tls_stylesheets"))
            .annotate(num_tls_images=F("cached_num_tls_images"))
            .annotate(num_tls_scripts=F("cached_num_tls_scripts"))
            .annotate(num_tls_stylesheets=F("cached_num_tls_stylesheets"))
            .annotate(tls_images=F("cached_tls_images"))
            .annotate(tls_scripts=F("cached_tls_scripts"))
            .annotate(tls_stylesheets=F("cached_tls_stylesheets"))
            .annotate(tls_total=F("cached_tls_total"))
        )

    def pages(self):
        links = Link.objects.filter(pages__id=OuterRef("pk"))
        images = Link.objects.filter(image_pages__id=OuterRef("pk"))
        scripts = Link.objects.filter(script_pages__id=OuterRef("pk"))
        stylesheets = Link.objects.filter(stylesheet_pages__id=OuterRef("pk"))
        return (
            self.filter(type=Link.TYPE_PAGE)
            .annotate_size()
            .annotate_tls()
            .annotate(num_links=SubQueryCount(links))
            .annotate(num_images=SubQueryCount(images))
            .annotate(num_scripts=SubQueryCount(scripts))
            .annotate(num_stylesheets=SubQueryCount(stylesheets))
            .annotate(num_non_ok_links=SubQueryCount(links.exclude(status=Link.STATUS_OK)))
            .annotate(num_non_ok_images=SubQueryCount(images.exclude(status=Link.STATUS_OK)))
            .annotate(num_non_ok_scripts=SubQueryCount(scripts.exclude(status=Link.STATUS_OK)))
            .annotate(num_non_ok_stylesheets=SubQueryCount(stylesheets.exclude(status=Link.STATUS_OK)))
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
    STATUS_TOO_MANY_REDIRECTS = 5
    STATUS_CHOICES = [
        (STATUS_OK, "OK"),
        (STATUS_TIMEOUT, "TIMEOUT"),
        (STATUS_HTTP_ERROR, "HTTP_ERROR"),
        (STATUS_OTHER_ERROR, "OTHER_ERROR"),
        (STATUS_TOO_MANY_REDIRECTS, "TOO_MANY_REDIRECTS"),
    ]

    TLS_NONE = 1
    TLS_OK = 2
    TLS_ERROR = 3
    TLS_STATUS_CHOICES = [
        (TLS_NONE, "NONE"),
        (TLS_OK, "OK"),
        (TLS_ERROR, "ERROR"),
    ]

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    scan = models.ForeignKey("Scan", on_delete=models.CASCADE, null=False)
    type = models.PositiveSmallIntegerField(choices=TYPE_CHOICES, null=False)
    url = models.CharField(max_length=2048, null=False)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False)
    http_status = models.PositiveSmallIntegerField(null=True, blank=True)
    response_time = models.PositiveIntegerField(null=False)
    error = models.CharField(max_length=255, null=True, blank=True)
    size = models.PositiveIntegerField(default=0)

    tls_status = models.PositiveSmallIntegerField(choices=TLS_STATUS_CHOICES, null=False, default=TLS_NONE)
    tls = models.ForeignKey("Tls", on_delete=models.CASCADE, null=True)

    links = models.ManyToManyField("self", symmetrical=False, related_name="pages", blank=True)

    images = models.ManyToManyField("self", symmetrical=False, related_name="image_pages", blank=True)
    stylesheets = models.ManyToManyField("self", symmetrical=False, related_name="stylesheet_pages", blank=True)
    scripts = models.ManyToManyField("self", symmetrical=False, related_name="script_pages", blank=True)

    num_ok_links = CalculatedField("num_links", "-num_non_ok_links")
    num_ok_images = CalculatedField("num_images", "-num_non_ok_images")
    num_ok_scripts = CalculatedField("num_scripts", "-num_non_ok_scripts")
    num_ok_stylesheets = CalculatedField("num_stylesheets", "-num_non_ok_stylesheets")

    cached_num_tls_images = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_tls_images = models.PositiveIntegerField(null=True, blank=True)
    cached_tls_images = models.BooleanField(null=True, blank=True)

    cached_num_tls_stylesheets = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_tls_stylesheets = models.PositiveIntegerField(null=True, blank=True)
    cached_tls_stylesheets = models.BooleanField(null=True, blank=True)

    cached_num_tls_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_tls_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_tls_scripts = models.BooleanField(null=True, blank=True)

    cached_tls_total = models.BooleanField(null=True, blank=True)

    cached_size_images = models.PositiveIntegerField(null=True, blank=True)
    cached_size_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_size_stylesheets = models.PositiveIntegerField(null=True, blank=True)
    cached_size_total = models.PositiveIntegerField(null=True, blank=True)

    # fields indicating whether it has incoming relations as link, image, script or stylesheet
    cached_is_link = models.BooleanField(null=False, default=False)
    cached_is_image = models.BooleanField(null=False, default=False)
    cached_is_script = models.BooleanField(null=False, default=False)
    cached_is_stylesheet = models.BooleanField(null=False, default=False)

    def get_pages(self):
        return self.pages.all().union(self.image_pages.all(), self.script_pages.all(), self.stylesheet_pages.all())
