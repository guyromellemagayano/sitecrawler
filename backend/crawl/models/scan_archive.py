from django.db import models
from django.contrib.postgres.fields import JSONField


class ScanArchive(models.Model):
    """Keeps scan detail endpoint results for deleted scans"""

    site = models.ForeignKey("Site", on_delete=models.CASCADE, null=False)
    started_at = models.DateTimeField()
    finished_at = models.DateTimeField()

    # reference to deleted scan id
    scan_id = models.PositiveIntegerField(unique=True)

    data = JSONField()
