from rest_framework import serializers

from crawl.common import ChoiceField
from ..models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True, source="subscription_type_id")
    status = ChoiceField(Subscription.STATUS_CHOICES, read_only=True)

    class Meta:
        model = Subscription
        read_only_fields = ["status", "cancel_at"]
        fields = read_only_fields + ["id"]
