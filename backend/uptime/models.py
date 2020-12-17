from django.db import models


class UptimeStat(models.Model):
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
