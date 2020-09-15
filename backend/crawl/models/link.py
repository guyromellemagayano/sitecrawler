from django.db import models
from django.db.models import (
    Count,
    Sum,
    F,
    OuterRef,
    Subquery,
    PositiveIntegerField,
    Case,
    When,
    IntegerField,
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
        images = Link.objects.filter(image_pages__id=OuterRef("pk"))
        scripts = Link.objects.filter(script_pages__id=OuterRef("pk"))
        stylesheets = Link.objects.filter(stylesheet_pages__id=OuterRef("pk"))
        return (
            self.annotate(size_images=SubQuerySizeSum(images))
            .annotate(size_scripts=SubQuerySizeSum(scripts))
            .annotate(size_stylesheets=SubQuerySizeSum(stylesheets))
            .annotate(size_total=F("size_images") + F("size_scripts") + F("size_stylesheets") + F("size"))
        )

    def annotate_tls(self):
        images = Link.objects.filter(image_pages__id=OuterRef("pk"))
        scripts = Link.objects.filter(script_pages__id=OuterRef("pk"))
        stylesheets = Link.objects.filter(stylesheet_pages__id=OuterRef("pk"))
        return (
            self.annotate(num_non_tls_images=SubQueryCount(images.exclude(tls_status=Link.TLS_OK)))
            .annotate(num_non_tls_scripts=SubQueryCount(scripts.exclude(tls_status=Link.TLS_OK)))
            .annotate(num_non_tls_stylesheets=SubQueryCount(stylesheets.exclude(tls_status=Link.TLS_OK)))
            .annotate(tls_images=Case(When(num_non_tls_images=0, then=1), default=0, output_field=IntegerField()))
            .annotate(tls_scripts=Case(When(num_non_tls_scripts=0, then=1), default=0, output_field=IntegerField()))
            .annotate(
                tls_stylesheets=Case(When(num_non_tls_stylesheets=0, then=1), default=0, output_field=IntegerField())
            )
            .annotate(
                tls_total=Case(
                    When(tls_images=1, tls_scripts=1, tls_stylesheets=1, tls_status=Link.TLS_OK, then=1,),
                    default=0,
                    output_field=IntegerField(),
                )
            )
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
    STATUS_CHOICES = [
        (STATUS_OK, "OK"),
        (STATUS_TIMEOUT, "TIMEOUT"),
        (STATUS_HTTP_ERROR, "HTTP_ERROR"),
        (STATUS_OTHER_ERROR, "OTHER_ERROR"),
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
    num_tls_images = CalculatedField("num_images", "-num_non_tls_images")
    num_tls_scripts = CalculatedField("num_scripts", "-num_non_tls_scripts")
    num_tls_stylesheets = CalculatedField("num_stylesheets", "-num_non_tls_stylesheets")

    def get_pages(self):
        return self.pages.all().union(self.image_pages.all(), self.script_pages.all(), self.stylesheet_pages.all())
