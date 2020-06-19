from django.db import models
from django.db.models import Count, F, Q
from django.db.models.query import QuerySet


class LinkQuerySet(QuerySet):
    def pages(self):
        return (
            self.filter(type=Link.TYPE_PAGE)
            .annotate(num_links=Count("links"))
            .annotate(num_ok_links=Count("links", filter=Q(links__status=Link.STATUS_OK)))
            .annotate(num_non_ok_links=F("num_links") - F("num_ok_links"))
            .order_by("-num_non_ok_links")
        )


class Link(models.Model):
    objects = LinkQuerySet.as_manager()

    TYPE_PAGE = 1
    TYPE_EXTERNAL = 2
    TYPE_OTHER = 3
    TYPE_CHOICES = [
        (TYPE_PAGE, "PAGE"),
        (TYPE_EXTERNAL, "EXTERNAL"),
        (TYPE_OTHER, "OTHER"),
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
