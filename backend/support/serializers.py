from rest_framework import serializers


class ContactSerializer(serializers.Serializer):
    message = serializers.CharField()
