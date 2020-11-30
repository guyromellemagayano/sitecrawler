from django.conf import settings
from django.db import models


class Site(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=False)

    url = models.CharField(max_length=2048, null=False)
    name = models.CharField(max_length=255, null=False, default="")

    verification_id = models.CharField(max_length=36, null=False)
    verified = models.BooleanField(null=False, default=False)
    last_verify_error = models.CharField(max_length=255, null=True, blank=True)

    large_page_size_threshold = models.PositiveIntegerField(null=True, blank=True)
