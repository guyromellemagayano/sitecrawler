from datetime import datetime

from django.conf import settings
from django.db import models
from django.db.models.signals import post_delete
from django.dispatch import receiver
import stripe


class Subscription(models.Model):
    STATUS_WAITING_PAYMENT = 1
    STATUS_PAYMENT_FAILED = 2
    STATUS_PAID = 3
    STATUS_CHOICES = [
        (STATUS_WAITING_PAYMENT, "WAITING_PAYMENT"),
        (STATUS_PAYMENT_FAILED, "PAYMENT_FAILED"),
        (STATUS_PAID, "PAID"),
    ]

    created_at = models.DateTimeField(auto_now_add=True, null=False)
    updated_at = models.DateTimeField(auto_now=True, null=False)

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=False)
    team = models.ForeignKey("teams.Team", on_delete=models.CASCADE)

    stripe_id = models.CharField(max_length=63)
    subscription_type = models.ForeignKey("SubscriptionType", on_delete=models.PROTECT, null=False)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False, default=STATUS_WAITING_PAYMENT)
    cancel_at = models.DateTimeField(null=True, blank=True)

    def set_cancel_at_timestamp(self, ts):
        self.cancel_at = datetime.utcfromtimestamp(ts)


@receiver(post_delete, sender=Subscription)
def cancel_subscription_in_stripe(sender, instance, **kwargs):
    try:
        stripe.Subscription.delete(
            instance.stripe_id,
            invoice_now=True,
            prorate=False,
        )
    except stripe.error.InvalidRequestError:
        pass
