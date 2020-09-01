from rest_framework import serializers

from crawl.common import ChoiceField
from ..models import UserSubscription


class UserSubscriptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True, source="subscription_id")
    status = ChoiceField(UserSubscription.STATUS_CHOICES, read_only=True)

    class Meta:
        model = UserSubscription
        fields = ["id", "status"]
