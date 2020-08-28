from rest_framework import serializers
import stripe

from crawl.serializers import GroupSerializer
from ..models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=True)
    price = serializers.SerializerMethodField(read_only=True)
    group = GroupSerializer(read_only=True)

    class Meta:
        model = Subscription
        fields = ["id", "price", "group"]

    def get_price(self, subscription):
        if hasattr(subscription, "price_id"):
            return stripe.Price.retrieve(subscription.price_id)
