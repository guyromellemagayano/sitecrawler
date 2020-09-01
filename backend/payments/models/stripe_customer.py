from django.conf import settings
from django.db import models


class StripeCustomer(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=False, related_name="stripe_customer"
    )
    customer_id = models.CharField(max_length=63)
