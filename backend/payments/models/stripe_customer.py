from django.conf import settings
from django.db import models


class StripeCustomer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False, related_name="stripe_customer"
    )
    # TODO: remove null after data migration
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE, null=True)

    customer_id = models.CharField(max_length=63)
