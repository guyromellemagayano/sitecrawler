from rest_framework import serializers

from crawl.models import Link


class PageSerializer(serializers.ModelSerializer):
    num_links = serializers.IntegerField(read_only=True)
    num_ok_links = serializers.IntegerField(read_only=True)
    num_non_ok_links = serializers.IntegerField(read_only=True)

    class Meta:
        model = Link
        fields = ["id", "created_at", "scan_id", "url", "num_links", "num_ok_links", "num_non_ok_links"]
        read_only_fields = ["id", "created_at", "scan_id", "url", "num_links", "num_ok_links", "num_non_ok_links"]
