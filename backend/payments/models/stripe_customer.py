from django.conf import settings
from django.db import models


class StripeCustomer(models.Model):
    team = models.OneToOneField("teams.Team", on_delete=models.CASCADE, related_name="stripe_customer")

    customer_id = models.CharField(max_length=63)
