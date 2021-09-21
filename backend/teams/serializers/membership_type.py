from rest_framework import serializers

from teams.models import MembershipType


class MembershipTypeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="get_id_display")

    class Meta:
        model = MembershipType
        read_only_fields = [
            "id",
            "name",
        ]
        fields = read_only_fields
