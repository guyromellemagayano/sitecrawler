from rest_framework import serializers


class PaymentMethodSerializer(serializers.Serializer):
    id = serializers.CharField()
