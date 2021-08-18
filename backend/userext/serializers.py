from django.contrib.auth.models import Permission, Group
from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer

from teams.service import get_current_team


class GroupSerializer(serializers.ModelSerializer):
    max_sites = serializers.IntegerField(source="groupsettings.max_sites", read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "max_sites"]
        read_only_fields = ["id", "name", "max_sites"]


class UserSerializer(UserDetailsSerializer):
    id = serializers.IntegerField()

    settings = serializers.JSONField(source="membership_set.first.team.crawl_config.settings")
    permissions = serializers.SerializerMethodField()
    group = GroupSerializer(source="groups.first", read_only=True)
    large_page_size_threshold = serializers.IntegerField(
        source="membership_set.first.team.crawl_config.large_page_size_threshold"
    )

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
        config_data = validated_data.pop("membership_set", {}).get("first", {}).get("team", {}).get("crawl_config")

        instance = super(UserSerializer, self).update(instance, validated_data)

        # get and update crawl config
        team = get_current_team(self.context["request"])
        config = team.crawl_config
        if config_data:
            settings = config_data.get("settings")
            if settings:
                config.settings = settings
            large_page_size_threshold = config_data.get("large_page_size_threshold")
            if large_page_size_threshold:
                config.large_page_size_threshold = large_page_size_threshold
            config.save()
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
