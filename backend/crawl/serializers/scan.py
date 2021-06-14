from rest_framework import serializers

from crawl.models import Scan


class ScanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scan
        fields = ["id", "started_at", "finished_at", "site_id", "force_https"]
        read_only_fields = fields


class ScanDetailSerializer(serializers.ModelSerializer):
    num_pages = serializers.IntegerField(read_only=True)
    num_external_links = serializers.IntegerField(read_only=True)
    num_links = serializers.IntegerField(read_only=True)
    num_ok_links = serializers.IntegerField(read_only=True)
    num_non_ok_links = serializers.IntegerField(read_only=True)
    num_images = serializers.IntegerField(read_only=True)
    num_ok_images = serializers.IntegerField(read_only=True)
    num_non_ok_images = serializers.IntegerField(read_only=True)
    num_images_with_missing_alts = serializers.IntegerField(read_only=True)
    num_scripts = serializers.IntegerField(read_only=True)
    num_ok_scripts = serializers.IntegerField(read_only=True)
    num_non_ok_scripts = serializers.IntegerField(read_only=True)
    num_stylesheets = serializers.IntegerField(read_only=True)
    num_ok_stylesheets = serializers.IntegerField(read_only=True)
    num_non_ok_stylesheets = serializers.IntegerField(read_only=True)
    num_pages_seo_ok = serializers.IntegerField(read_only=True)
    num_pages_without_title = serializers.IntegerField(read_only=True)
    num_pages_without_description = serializers.IntegerField(read_only=True)
    num_pages_without_h1_first = serializers.IntegerField(read_only=True)
    num_pages_without_h1_second = serializers.IntegerField(read_only=True)
    num_pages_without_h2_first = serializers.IntegerField(read_only=True)
    num_pages_without_h2_second = serializers.IntegerField(read_only=True)
    num_pages_big = serializers.IntegerField(read_only=True)
    num_pages_small_tls_ok = serializers.IntegerField(read_only=True)
    num_pages_tls_ok = serializers.IntegerField(read_only=True)
    num_pages_tls_non_ok = serializers.IntegerField(read_only=True)
    num_images_tls_ok = serializers.IntegerField(read_only=True)
    num_images_tls_non_ok = serializers.IntegerField(read_only=True)
    num_images_fully_ok = serializers.IntegerField(read_only=True)
    num_pages_duplicated_title = serializers.IntegerField(read_only=True)
    num_pages_duplicated_description = serializers.IntegerField(read_only=True)

    class Meta:
        model = Scan
        fields = ScanSerializer.Meta.fields + [
            "num_pages",
            "num_external_links",
            "num_links",
            "num_ok_links",
            "num_non_ok_links",
            "num_images",
            "num_ok_images",
            "num_non_ok_images",
            "num_images_with_missing_alts",
            "num_scripts",
            "num_ok_scripts",
            "num_non_ok_scripts",
            "num_stylesheets",
            "num_ok_stylesheets",
            "num_non_ok_stylesheets",
            "num_pages_seo_ok",
            "num_pages_without_title",
            "num_pages_without_description",
            "num_pages_without_h1_first",
            "num_pages_without_h1_second",
            "num_pages_without_h2_first",
            "num_pages_without_h2_second",
            "num_pages_big",
            "num_pages_small_tls_ok",
            "num_pages_tls_ok",
            "num_pages_tls_non_ok",
            "num_images_tls_ok",
            "num_images_tls_non_ok",
            "num_images_fully_ok",
            "num_pages_duplicated_title",
            "num_pages_duplicated_description",
        ]
        read_only_fields = fields
