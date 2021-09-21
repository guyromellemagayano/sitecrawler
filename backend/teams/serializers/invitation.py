from rest_framework import serializers
from teams.models import Invitation


class InvitationSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(queryset=Invitation.objects.all())

    def validate(self, data):
        if self.context["request"].user.email != data["id"].email:
            raise serializers.ValidationError(f"Only {data['id'].email} can accept this inviation.")
        return data

    class Meta:
        model = Invitation
        fields = ["id"]
