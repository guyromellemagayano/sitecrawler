from django.conf import settings
from django.db import models


class UserSubscription(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=False, related_name="user_subscription"
    )
    stripe_id = models.CharField(max_length=63)
    subscription = models.ForeignKey("Subscription", on_delete=models.PROTECT, null=False)
