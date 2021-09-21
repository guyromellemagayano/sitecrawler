from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer

from teams.models import Membership, MembershipType
from .membership_type import MembershipTypeSerializer


class MembershipSerializer(serializers.ModelSerializer):
    type = MembershipTypeSerializer(read_only=True)
    user = UserDetailsSerializer(read_only=True)

    class Meta:
        model = Membership
        read_only_fields = [
            "id",
            "type",
            "user",
        ]
        fields = read_only_fields


class MembershipCreateSerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(queryset=MembershipType.objects.all())
    user_email = serializers.EmailField()

    class Meta:
        model = Membership
        fields = ["type_id", "user_email"]


class MembershipUpdateSerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(
        queryset=MembershipType.objects.all(),
        source="type",
    )

    class Meta:
        model = Membership
        fields = ["type_id"]
