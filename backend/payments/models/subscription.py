from django.contrib.auth.models import Group
from django.db import models


class Subscription(models.Model):
    price_id = models.CharField(max_length=63, unique=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.group.name
