from rest_framework import serializers

from .models import Signup


class SignupSerializer(serializers.ModelSerializer):
    url = serializers.URLField()

    class Meta:
        model = Signup
        read_only_fields = ["id", "created_at"]
        fields = read_only_fields + ["first_name", "last_name", "username", "email", "url"]


class ConfirmSerializer(serializers.Serializer):
    password = serializers.CharField(style={"input_type": "password"})
