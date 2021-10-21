from django.db import models
from django.db.models import (
    Sum,
    F,
    Subquery,
    PositiveIntegerField,
)
from django.db.models.functions import Coalesce
from django.db.models.query import QuerySet


class SubQuerySizeSum(Subquery):
    output_field = PositiveIntegerField()

    def __init__(self, queryset, *args, **kwargs):
        queryset = queryset.annotate(total=Coalesce(Sum("size"), 0)).values("total")
        queryset.query.set_group_by()
        super().__init__(queryset, *args, **kwargs)


class LinkQuerySet(QuerySet):
    def annotate_link_adjusted(self):
        return self.annotate(
            status_adjusted=models.Case(
                models.When(
                    resolved_status=True,
                    then=models.Value(Link.STATUS_OK, output_field=models.PositiveSmallIntegerField()),
                ),
                default=models.F("status"),
            ),
            tls_status_adjusted=models.Case(
                models.When(
                    resolved_tls=True,
                    then=models.Value(Link.TLS_OK, output_field=models.PositiveSmallIntegerField()),
                ),
                default=models.F("tls_status"),
            ),
        )

    def annotate_page_adjusted(self):
        return self.annotate(
            tls_total_adjusted=models.Case(
                models.When(
                    resolved_tls=True,
                    then=True,
                ),
                default=models.F("cached_tls_total"),
            ),
        )

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
        return (
            self.filter(type=Link.TYPE_PAGE)
            .annotate_size()
            .annotate_tls()
            .annotate(num_links=F("cached_num_links"))
            .annotate(num_images=F("cached_num_images"))
            .annotate(num_scripts=F("cached_num_scripts"))
            .annotate(num_stylesheets=F("cached_num_stylesheets"))
            .annotate(num_ok_links=F("cached_num_ok_links"))
            .annotate(num_ok_images=F("cached_num_ok_images"))
            .annotate(num_ok_scripts=F("cached_num_ok_scripts"))
            .annotate(num_ok_stylesheets=F("cached_num_ok_stylesheets"))
            .annotate(num_non_ok_links=F("cached_num_non_ok_links"))
            .annotate(num_non_ok_images=F("cached_num_non_ok_images"))
            .annotate(num_non_ok_scripts=F("cached_num_non_ok_scripts"))
            .annotate(num_non_ok_stylesheets=F("cached_num_non_ok_stylesheets"))
            .order_by("-num_non_ok_links")
        )

    def links(self):
        return (
            self.filter(cached_link_occurences__gt=0)
            .annotate(occurences=F("cached_link_occurences"))
            .order_by("-status")
        )

    def images(self):
        return (
            self.filter(cached_image_occurences__gt=0)
            .annotate(
                occurences=F("cached_image_occurences"),
                missing_alts=Coalesce(F("cached_image_missing_alts"), 0),
            )
            .order_by("-status")
        )

    def scripts(self):
        return (
            self.filter(cached_script_occurences__gt=0)
            .annotate(occurences=F("cached_script_occurences"))
            .order_by("-status")
        )

    def stylesheets(self):
        return (
            self.filter(cached_stylesheet_occurences__gt=0)
            .annotate(occurences=F("cached_stylesheet_occurences"))
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

    links = models.ManyToManyField("self", symmetrical=False, related_name="pages", blank=True, through="LinkLink")

    images = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="image_pages",
        blank=True,
        through="LinkImage",
    )
    stylesheets = models.ManyToManyField("self", symmetrical=False, related_name="stylesheet_pages", blank=True)
    scripts = models.ManyToManyField("self", symmetrical=False, related_name="script_pages", blank=True)

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

    # fields counting incoming relations
    cached_link_occurences = models.PositiveIntegerField(null=True, blank=True)
    cached_image_occurences = models.PositiveIntegerField(null=True, blank=True)
    cached_script_occurences = models.PositiveIntegerField(null=True, blank=True)
    cached_stylesheet_occurences = models.PositiveIntegerField(null=True, blank=True)

    cached_image_missing_alts = models.PositiveIntegerField(null=True, blank=True)

    # fields counting outgoing relations: total and ok and non-ok status
    cached_num_links = models.PositiveIntegerField(null=True, blank=True)
    cached_num_images = models.PositiveIntegerField(null=True, blank=True)
    cached_num_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_num_stylesheets = models.PositiveIntegerField(null=True, blank=True)
    cached_num_ok_links = models.PositiveIntegerField(null=True, blank=True)
    cached_num_ok_images = models.PositiveIntegerField(null=True, blank=True)
    cached_num_ok_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_num_ok_stylesheets = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_ok_links = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_ok_images = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_ok_scripts = models.PositiveIntegerField(null=True, blank=True)
    cached_num_non_ok_stylesheets = models.PositiveIntegerField(null=True, blank=True)

    # link level resolves
    resolved_status = models.BooleanField(null=True, blank=True)
    # tls is both link and page level
    resolved_tls = models.BooleanField(null=True, blank=True)
    # missing_alts is image only
    resolved_missing_alts = models.BooleanField(null=True, blank=True)
    # page level resolves
    resolved_size = models.BooleanField(null=True, blank=True)
    resolved_missing_title = models.BooleanField(null=True, blank=True)
    resolved_missing_description = models.BooleanField(null=True, blank=True)
    resolved_missing_h1_first = models.BooleanField(null=True, blank=True)
    resolved_missing_h1_second = models.BooleanField(null=True, blank=True)
    resolved_missing_h2_first = models.BooleanField(null=True, blank=True)
    resolved_missing_h2_second = models.BooleanField(null=True, blank=True)
    resolved_duplicate_title = models.BooleanField(null=True, blank=True)
    resolved_duplicate_description = models.BooleanField(null=True, blank=True)

    class Meta:
        permissions = (
            ("can_see_images", "Can see images"),
            ("can_see_scripts", "Can see scripts"),
            ("can_see_stylesheets", "Can see stylesheets"),
            ("can_see_pages", "Can see pages"),
        )

    def pages_with_same_pagedata(self, field):
        kwargs = {
            "scan": self.scan,
            f"pagedata__{field}": getattr(self.pagedata, field),
        }
        return Link.objects.filter(**kwargs).exclude(id=self.id)

    def pages_with_same_title(self):
        return self.pages_with_same_pagedata("title")

    def pages_with_same_description(self):
        return self.pages_with_same_pagedata("description")
