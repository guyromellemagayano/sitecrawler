from rest_framework import serializers

from crawl.models import Scan


class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ["id", "started_at", "finished_at", "site_id"]
        read_only_fields = ["id", "started_at", "finished_at", "site_id"]


class ScanDetailSerializer(serializers.ModelSerializer):
    num_links = serializers.IntegerField(read_only=True)

    class Meta:
        model = Scan
        fields = ["id", "started_at", "finished_at", "site_id", "num_links"]
        read_only_fields = ["id", "started_at", "finished_at", "site_id", "num_links"]
