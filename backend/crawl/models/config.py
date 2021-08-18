from django.db import models
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import post_save
from django.dispatch import receiver


class Config(models.Model):
    team = models.OneToOneField("teams.Team", on_delete=models.CASCADE, related_name="crawl_config")

    settings = JSONField(default=dict)
    large_page_size_threshold = models.PositiveIntegerField(default=1024 * 1024)


@receiver(post_save, sender="teams.Team")
def create_config(sender, instance, created, **kwargs):
    if created:
        Config.objects.create(team=instance)
