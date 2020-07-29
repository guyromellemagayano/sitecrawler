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
    num_pages_without_title = serializers.IntegerField(read_only=True)
    num_pages_without_description = serializers.IntegerField(read_only=True)
    num_pages_without_h1_first = serializers.IntegerField(read_only=True)
    num_pages_without_h1_second = serializers.IntegerField(read_only=True)
    num_pages_without_h2_first = serializers.IntegerField(read_only=True)
    num_pages_without_h2_second = serializers.IntegerField(read_only=True)

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
            "num_pages_without_title",
            "num_pages_without_description",
            "num_pages_without_h1_first",
            "num_pages_without_h1_second",
            "num_pages_without_h2_first",
            "num_pages_without_h2_second",
        ]
        read_only_fields = ["id", "started_at", "finished_at", "site_id"]
