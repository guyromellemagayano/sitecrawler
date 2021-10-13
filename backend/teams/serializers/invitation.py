from rest_framework import serializers

from teams.models import Invitation
from .membership_type import MembershipTypeSerializer


class InvitationSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Invitation.objects.all())

    membership_type = MembershipTypeSerializer(read_only=True)

    def validate(self, data):
        if self.context["request"].user.email != data["id"].email:
            raise serializers.ValidationError(f"Only {data['id'].email} can accept this inviation.")
        return data

    class Meta:
        model = Invitation
        read_only_fields = ["created_at", "email", "membership_type", "sites"]
        fields = ["id"] + read_only_fields
