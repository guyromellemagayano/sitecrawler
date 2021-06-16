from rest_framework import serializers

from crawl.models import Site


class SiteSerializer(serializers.ModelSerializer):
    url = serializers.URLField()
    last_finished_scan_id = serializers.IntegerField(read_only=True)

    class Meta:
        model = Site
        fields = [
            "id",
            "created_at",
            "updated_at",
            "user_id",
            "url",
            "name",
            "verification_id",
            "verified",
            "large_page_size_threshold",
            "last_finished_scan_id",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "user_id",
            "verification_id",
            "verified",
            "last_finished_scan_id",
        ]

    def update(self, instance, validated_data):
        if "url" in validated_data:
            validated_data["url"] = instance.url

        return super().update(instance, validated_data)

    def validate(self, data):
        user = self.context["request"].user
        existing_count = Site.objects.filter(user=user).count()
        if existing_count >= user.groups.first().groupsettings.max_sites:
            raise serializers.ValidationError("You have reached your sites limit.")

        return data
