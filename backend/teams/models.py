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


class Team(models.Model):
    objects = TeamManager()

    name = models.CharField(max_length=255)

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
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, on_delete=models.CASCADE)
    type = models.ForeignKey(MembershipType, on_delete=models.CASCADE)


@receiver(post_save, sender=User)
def create_default_user_team(sender, instance, created, **kwargs):
    if created:
        Team.objects.create_default(instance)