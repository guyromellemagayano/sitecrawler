from django.db import models
from django.contrib.auth.models import User, Group
from django.db.models.signals import post_save
from django.dispatch import receiver


class GroupSettings(models.Model):
    group = models.OneToOneField(Group, on_delete=models.CASCADE)
    max_sites = models.IntegerField(default=10)


@receiver(post_save, sender=User)
def add_default_user_group(sender, instance, created, **kwargs):
    if created:
        instance.groups.add(Group.objects.get(pk=1))


@receiver(post_save, sender=Group)
def create_group_settings(sender, instance, created, **kwargs):
    if created:
        GroupSettings.objects.create(group=instance)
