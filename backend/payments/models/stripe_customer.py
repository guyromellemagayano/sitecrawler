from django.db import models


class StripeCustomer(models.Model):
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)

    customer_id = models.CharField(max_length=63)
