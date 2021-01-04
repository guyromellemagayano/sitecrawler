from datetime import datetime

from django.conf import settings
from django.db import models


class UserSubscription(models.Model):
    STATUS_WAITING_PAYMENT = 1
    STATUS_PAYMENT_FAILED = 2
    STATUS_PAID = 3
    STATUS_CHOICES = [
        (STATUS_WAITING_PAYMENT, "WAITING_PAYMENT"),
        (STATUS_PAYMENT_FAILED, "PAYMENT_FAILED"),
        (STATUS_PAID, "PAID"),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=False, related_name="user_subscription"
    )
    stripe_id = models.CharField(max_length=63)
    subscription = models.ForeignKey("Subscription", on_delete=models.PROTECT, null=False)
    status = models.PositiveSmallIntegerField(choices=STATUS_CHOICES, null=False, default=STATUS_WAITING_PAYMENT)
    cancel_at = models.DateTimeField(null=True)

    def set_cancel_at_timestamp(self, ts):
        self.cancel_at = datetime.utcfromtimestamp(ts)
