from django.db import models
from django.conf import settings
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save
from django.dispatch import receiver


class GroupSettings(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    max_sites = models.IntegerField(default=10)
    recrawl_schedule = models.CharField(
        max_length=63, default="0 18 * * 0", help_text="<a href='https://en.wikipedia.org/wiki/Cron'>cron format</a>",
    )


@receiver(post_save, sender=User)
def add_default_user_group(sender, instance, created, **kwargs):
    if created:
        instance.groups.add(Group.objects.get(pk=settings.DEFAULT_USER_GROUP))


@receiver(post_save, sender=Group)
def create_group_settings(sender, instance, created, **kwargs):
    if created:
        GroupSettings.objects.create(group=instance)
