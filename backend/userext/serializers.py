from django.contrib.auth.models import Permission, Group
from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer


class GroupSerializer(serializers.ModelSerializer):
    max_sites = serializers.IntegerField(source="groupsettings.max_sites", read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "max_sites"]
        read_only_fields = ["id", "name", "max_sites"]


class UserSerializer(UserDetailsSerializer):
    id = serializers.IntegerField()

    settings = serializers.JSONField(source="userprofile.settings")
    permissions = serializers.SerializerMethodField()
    group = GroupSerializer(source="groups.first", read_only=True)
    large_page_size_threshold = serializers.IntegerField(source="userprofile.large_page_size_threshold")

    class Meta(UserDetailsSerializer.Meta):
        fields = (
            ("id",)
            + tuple(f for f in UserDetailsSerializer.Meta.fields if f != "pk")
            + (
                "settings",
                "permissions",
                "group",
                "large_page_size_threshold",
            )
        )

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})

        instance = super(UserSerializer, self).update(instance, validated_data)

        # get and update user profile
        profile = instance.userprofile
        if profile_data:
            settings = profile_data.get("settings")
            if settings:
                profile.settings = settings
            large_page_size_threshold = profile_data.get("large_page_size_threshold")
            if large_page_size_threshold:
                profile.large_page_size_threshold = large_page_size_threshold
            profile.save()
        return instance

    def get_permissions(self, user):
        return [p.codename for p in self._user_permissions(user) if self._is_custom(p)]

    def _is_custom(self, permission):
        django_prefixes = ["add_", "change_", "delete_", "view_"]
        return not any(permission.codename.startswith(prefix) for prefix in django_prefixes)

    def _user_permissions(self, user):
        if user.is_superuser:
            return Permission.objects.all()
        return user.user_permissions.all() | Permission.objects.filter(group__user=user)
