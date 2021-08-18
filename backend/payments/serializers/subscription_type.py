from rest_framework import serializers
import stripe

from userext.serializers import GroupSerializer
from ..models import SubscriptionType


class SubscriptionTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    price = serializers.SerializerMethodField(read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = SubscriptionType
        fields = ["id", "price", "group", "features"]
        read_only_fields = fields

    def get_price(self, subscription_type):
        if hasattr(subscription_type, "price_id"):
            return stripe.Price.retrieve(subscription_type.price_id)
