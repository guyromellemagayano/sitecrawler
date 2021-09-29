from django.contrib.auth.models import Group
from django.db import models


class MembershipType(models.Model):
    OWNER = 1
    MEMBER = 2
    CLIENT = 3
    ID_CHOICES = [
        (OWNER, "Owner"),
        (MEMBER, "Member"),
        (CLIENT, "Client"),
    ]

    id = models.PositiveSmallIntegerField(choices=ID_CHOICES, primary_key=True)
    group = models.OneToOneField(Group, on_delete=models.CASCADE)

    def __str__(self):
        return self.get_id_display()
