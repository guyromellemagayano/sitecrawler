import datetime

from django.db import models
from django.db.models.query import QuerySet
import pytz


class UptimeStatQuerySet(QuerySet):
    def filter_timedelta(self, timedelta):
        now = datetime.datetime.utcnow()
        now = now.replace(tzinfo=pytz.utc)
        return self.filter(created_at__gte=now - timedelta)

    def uptime_percentage(self):
        total = self.count()
        if total == 0:
            return None
        return self.filter(status=UptimeStat.STATUS_OK).count() / total * 100

    def first_created_at(self):
        first = self.first()
        if not first:
            return None
        return first.created_at


class UptimeStat(models.Model):
    objects = UptimeStatQuerySet.as_manager()

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

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    site = models.ForeignKey("crawl.Site", on_delete=models.CASCADE, null=False)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False)
    http_status = models.PositiveSmallIntegerField(null=True, blank=True)
    response_time = models.PositiveIntegerField(null=False)
    error = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=["site", "created_at"]),
        ]
