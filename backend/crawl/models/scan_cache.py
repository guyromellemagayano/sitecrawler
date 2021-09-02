import datetime

from django.contrib.postgres.fields import JSONField
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class ScanCacheManager(models.Manager):
    def create_from_scan(self, scan):
        data = {k: v for k, v in scan.__dict__.items() if k.startswith("num_")}
        return self.create(scan=scan, data=data)


class ScanCache(models.Model):
    """Keeps scan detail endpoint for caching"""

    objects = ScanCacheManager()

    scan = models.OneToOneField("Scan", on_delete=models.CASCADE, null=False, primary_key=True)
    created_at = models.DateTimeField(auto_now_add=True, null=False)

    data = JSONField()

    def apply(self, scan):
        for k, v in self.data.items():
            setattr(scan, k, v)

    def is_valid(self, scan):
        # for non finished scans implement timeout
        if scan.finished_at is None:
            return self.created_at > datetime.datetime.now(datetime.timezone.utc) - datetime.timedelta(minutes=1)

        # otherwise make sure it was created after scan finished
        return self.created_at > scan.finished_at


# delete cache on crawl config (per team) or site update (possible changes to big page threshold)
@receiver(post_save, sender="crawl.Site")
def scan_cache_create_or_update_site(sender, instance, created, **kwargs):
    ScanCache.objects.filter(scan__site_id=instance.id).delete()


@receiver(post_save, sender="crawl.Config")
def scan_cache_create_or_update_config(sender, instance, created, **kwargs):
    ScanCache.objects.filter(scan__site__team_id=instance.team_id).delete()
