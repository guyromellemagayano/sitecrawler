from rest_framework import serializers
import stripe

from teams.serializers import PlanSerializer
from ..models import SubscriptionType


class SubscriptionTypeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    price = serializers.SerializerMethodField(read_only=True)
    # TODO: remove group when not used in frontend
    group = PlanSerializer(source="plan", read_only=True)
    plan = PlanSerializer(read_only=True)

    class Meta:
        model = SubscriptionType
        fields = ["id", "price", "group", "plan", "features"]
        read_only_fields = fields

    def get_price(self, subscription_type):
        if hasattr(subscription_type, "price_id"):
            return stripe.Price.retrieve(subscription_type.price_id)
