from django.contrib.auth.models import Group
from django_better_admin_arrayfield.models.fields import ArrayField
from django.db import models


class SubscriptionType(models.Model):
    name = models.CharField(max_length=63)
    price_id = models.CharField(max_length=63, unique=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    features = ArrayField(models.CharField(max_length=255), blank=True, default=list)

    def __str__(self):
        return self.group.name
