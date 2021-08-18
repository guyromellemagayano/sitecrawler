from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import JSONField
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True)
    # TODO: remove null
    team = models.OneToOneField("teams.Team", on_delete=models.CASCADE, related_name="crawl_config", null=True)

    settings = JSONField(default=dict)
    large_page_size_threshold = models.PositiveIntegerField(default=1024 * 1024)


@receiver(post_save, sender="teams.Team")
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(team=instance)


# TODO: remove once we remove user from relations
@receiver(post_save, sender="teams.Membership")
def fix_for_unknown_user(sender, instance, created, **kwargs):
    up = UserProfile.objects.get(team=instance.team)
    up.user = instance.user
    up.save()
