from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer


class UserSerializer(UserDetailsSerializer):

    settings = serializers.JSONField(source="userprofile.settings")

    class Meta(UserDetailsSerializer.Meta):
        fields = UserDetailsSerializer.Meta.fields + ("settings",)

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})
        settings = profile_data.get("settings")

        instance = super(UserSerializer, self).update(instance, validated_data)

        # get and update user profile
        profile = instance.userprofile
        if profile_data and settings:
            profile.settings = settings
            profile.save()
        return instance
