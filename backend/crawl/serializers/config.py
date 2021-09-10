from rest_framework import serializers

from crawl.models import Config


class ConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = Config
        fields = [
            "settings",
            "large_page_size_threshold",
        ]
