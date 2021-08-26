from django.contrib.auth.models import Group, User
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class TeamManager(models.Manager):
    def create_default(self, user):
        name = user.get_full_name() or user.get_username()
        team = self.create(name=name)
        Membership.objects.create(user=user, team=team, type=MembershipType.objects.get(id=MembershipType.OWNER))
        return team


class Plan(models.Model):
    BASIC = 1
    PRO = 2
    AGENCY = 3
    ID_CHOICES = [
        (BASIC, "Basic"),
        (PRO, "Pro"),
        (AGENCY, "Agency"),
    ]

    id = models.PositiveSmallIntegerField(choices=ID_CHOICES, primary_key=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE)

    # settings
    RECRAWL_DAILY = 1
    RECRAWL_WEEKLY = 2
    RECRAWL_CHOICES = [
        (RECRAWL_DAILY, "Daily"),
        (RECRAWL_WEEKLY, "Weekly"),
    ]

    max_sites = models.IntegerField(default=10)
    recrawl_schedule = models.CharField(
        max_length=63,
        default="0 18 * * 0",
        help_text="<a href='https://en.wikipedia.org/wiki/Cron'>cron format</a>",
    )
    recrawl_frequency = models.PositiveSmallIntegerField(choices=RECRAWL_CHOICES, null=False, default=RECRAWL_WEEKLY)
    uptime_schedule = models.CharField(
        max_length=63,
        default="0 * * * *",
        help_text="<a href='https://en.wikipedia.org/wiki/Cron'>cron format</a>",
    )

    def __str__(self):
        return self.get_id_display()


class Team(models.Model):
    objects = TeamManager()

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)
    deleted_at = models.DateTimeField(null=True, blank=True)

    name = models.CharField(max_length=255)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE, default=Plan.BASIC)

    def __str__(self):
        return f"{self.name} ({self.id})"


class MembershipType(models.Model):
    OWNER = 1
    ID_CHOICES = [
        (OWNER, "Owner"),
    ]

    id = models.PositiveSmallIntegerField(choices=ID_CHOICES, primary_key=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_id_display()


class Membership(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    type = models.ForeignKey(MembershipType, on_delete=models.CASCADE)


@receiver(post_save, sender=User)
def create_default_user_team(sender, instance, created, **kwargs):
    if created:
        Team.objects.create_default(instance)
