from django.db import models


class Scan(models.Model):
    site = models.ForeignKey("Site", on_delete=models.CASCADE, null=False)
    started_at = models.DateTimeField(auto_now_add=True, null=False)
    finished_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        permissions = (("can_start_scan", "Can start manual scan"),)
