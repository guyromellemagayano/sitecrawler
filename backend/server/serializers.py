from rest_auth.registration.serializers import RegisterSerializer
from rest_framework import serializers


class NameRegistrationSerializer(RegisterSerializer):

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)

    def custom_signup(self, request, user):
        user.first_name = self.validated_data["first_name"]
        user.last_name = self.validated_data["last_name"]
        user.save(update_fields=["first_name", "last_name"])
