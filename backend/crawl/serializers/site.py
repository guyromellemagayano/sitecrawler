from rest_framework import serializers

from crawl.models import Site
from teams.service import get_current_team


class SiteSerializer(serializers.ModelSerializer):
    url = serializers.URLField()
    last_finished_scan_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Site
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "verification_id",
            "verified",
            "last_finished_scan_id",
        ]
        fields = read_only_fields + [
            "url",
            "name",
            "large_page_size_threshold",
        ]

    def update(self, instance, validated_data):
        if "url" in validated_data:
            validated_data["url"] = instance.url

        return super().update(instance, validated_data)

    def validate(self, data):
        team = get_current_team(self.context["request"])
        existing_count = Site.objects.filter(team=team).count()
        if existing_count >= team.plan.max_sites:
            raise serializers.ValidationError("You have reached your sites limit.")

        return data
