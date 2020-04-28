from django.db import models


class Link(models.Model):
    TYPE_PAGE = 1
    TYPE_EXTERNAL = 2
    TYPE_OTHER = 3
    TYPE_CHOICES = [
        (TYPE_PAGE, "Page"),
        (TYPE_EXTERNAL, "External"),
        (TYPE_OTHER, "Other"),
    ]

    STATUS_OK = 1
    STATUS_TIMEOUT = 2
    STATUS_HTTP_ERROR = 3
    STATUS_CHOICES = [
        (STATUS_OK, "OK"),
        (STATUS_TIMEOUT, "Timeout"),
        (STATUS_HTTP_ERROR, "HTTP Error"),
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
