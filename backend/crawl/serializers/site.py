from rest_framework import serializers

from crawl.models import Site


class SiteSerializer(serializers.ModelSerializer):
    url = serializers.URLField()

    class Meta:
        model = Site
        fields = ["id", "created_at", "updated_at", "user_id", "url", "verification_id", "verified"]
        read_only_fields = ["id", "created_at", "updated_at", "user_id", "verification_id", "verified"]
