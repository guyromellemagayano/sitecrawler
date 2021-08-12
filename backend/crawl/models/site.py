from django.conf import settings
from django.db import models
from django.db.models.query import QuerySet

from crawl.models import Scan


class SiteQuerySet(QuerySet):
    def annotate_last_finished_scan_id(self):
        return self.annotate(
            last_finished_scan_id=models.Subquery(
                Scan.objects.filter(site_id=models.OuterRef("pk"), finished_at__isnull=False)
                .values("id")
                .order_by("-finished_at")[:1]
            )
        )


class Site(models.Model):
    objects = SiteQuerySet.as_manager()

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)

    url = models.CharField(max_length=2048, null=False)
    name = models.CharField(max_length=255, null=False, default="")

    verification_id = models.CharField(max_length=36, null=False)
    verified = models.BooleanField(null=False, default=False)
    last_verify_error = models.CharField(max_length=255, null=True, blank=True)

    large_page_size_threshold = models.PositiveIntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user}: {self.url} ({self.id})"
