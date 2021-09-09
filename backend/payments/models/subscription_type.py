from django.contrib.auth.models import Group
from django_better_admin_arrayfield.models.fields import ArrayField
from django.db import models


class SubscriptionType(models.Model):
    name = models.CharField(max_length=63)
    price_id = models.CharField(max_length=63, unique=True)
    features = ArrayField(models.CharField(max_length=255), blank=True, default=list)
    plan = models.ForeignKey("teams.Plan", on_delete=models.CASCADE, null=True)

    def __str__(self):
        return self.name
