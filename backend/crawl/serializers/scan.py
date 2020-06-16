from rest_framework import serializers

from crawl.models import Scan


class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ["id", "started_at", "finished_at", "site_id"]
        read_only_fields = ["id", "started_at", "finished_at", "site_id"]


class ScanDetailSerializer(serializers.ModelSerializer):
    num_pages = serializers.IntegerField(read_only=True)
    num_links = serializers.IntegerField(read_only=True)
    num_ok_links = serializers.IntegerField(read_only=True)
    num_non_ok_links = serializers.IntegerField(read_only=True)
    num_external_links = serializers.IntegerField(read_only=True)

    class Meta:
        model = Scan
        fields = [
            "id",
            "started_at",
            "finished_at",
            "site_id",
            "num_pages",
            "num_links",
            "num_ok_links",
            "num_non_ok_links",
            "num_external_links",
        ]
        read_only_fields = ["id", "started_at", "finished_at", "site_id"]
