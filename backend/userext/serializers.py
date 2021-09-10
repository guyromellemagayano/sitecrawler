from rest_framework import serializers
from rest_auth.serializers import UserDetailsSerializer

from teams.serializers import PlanSerializer
from teams.service import get_current_team, get_current_membership


class UserSerializer(UserDetailsSerializer):
    id = serializers.IntegerField()

    # TODO: remove settings, plan and large_page_size_threshold from here
    settings = serializers.JSONField(source="membership_set.first.team.crawl_config.settings")
    permissions = serializers.SerializerMethodField()
    group = PlanSerializer(source="membership_set.first.team.plan", read_only=True)
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
        return [p.codename for p in get_current_membership(self.context["request"]).permissions.values()]
