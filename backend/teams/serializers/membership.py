from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer

from crawl.models import Site
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
            "sites",
        ]
        fields = read_only_fields


class ValidatedSites(serializers.PrimaryKeyRelatedField):
    def get_queryset(self):
        return super().get_queryset().filter(team_id=self.context["view"].kwargs["parent_lookup_team"])


class MembershipCreateSerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(queryset=MembershipType.objects.all())
    user_email = serializers.EmailField()
    sites = ValidatedSites(queryset=Site.objects.all(), many=True)

    class Meta:
        model = Membership
        fields = ["type_id", "user_email", "sites"]


class MembershipUpdateSerializer(serializers.ModelSerializer):
    type_id = serializers.PrimaryKeyRelatedField(
        queryset=MembershipType.objects.all(),
        source="type",
    )
    sites = ValidatedSites(queryset=Site.objects.all(), many=True)

    class Meta:
        model = Membership
        fields = ["type_id", "sites"]
