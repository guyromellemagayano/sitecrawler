from django.contrib.auth.models import Group
from django.db import models


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
