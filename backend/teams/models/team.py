from django.contrib.auth.models import User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver

from .plan import Plan
from .membership import Membership
from .membership_type import MembershipType


class TeamManager(models.Manager):
    def create_default(self, user):
        name = user.get_full_name() or user.get_username()
        team = self.create(name=name)
        Membership.objects.create(user=user, team=team, type=MembershipType.objects.get(id=MembershipType.OWNER))
        return team


class Team(models.Model):
    objects = TeamManager()

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    name = models.CharField(max_length=255)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, default=Plan.BASIC)

    def __str__(self):
        return f"{self.name} ({self.id})"


@receiver(post_save, sender=User)
def create_default_user_team(sender, instance, created, **kwargs):
    if created:
        Team.objects.create_default(instance)
