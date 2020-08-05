from rest_framework import serializers

from crawl.models import Link
from .page_data import PageDataSerializer


class PageSerializer(serializers.ModelSerializer):
    num_links = serializers.IntegerField(read_only=True)
    num_ok_links = serializers.IntegerField(read_only=True)
    num_non_ok_links = serializers.IntegerField(read_only=True)
    num_images = serializers.IntegerField(read_only=True)
    num_ok_images = serializers.IntegerField(read_only=True)
    num_non_ok_images = serializers.IntegerField(read_only=True)
    num_scripts = serializers.IntegerField(read_only=True)
    num_ok_scripts = serializers.IntegerField(read_only=True)
    num_non_ok_scripts = serializers.IntegerField(read_only=True)
    num_stylesheets = serializers.IntegerField(read_only=True)
    num_ok_stylesheets = serializers.IntegerField(read_only=True)
    num_non_ok_stylesheets = serializers.IntegerField(read_only=True)
    size_images = serializers.IntegerField(read_only=True)
    size_scripts = serializers.IntegerField(read_only=True)
    size_stylesheets = serializers.IntegerField(read_only=True)
    size_total = serializers.IntegerField(read_only=True)

    class Meta:
        model = Link
        fields = [
            "id",
            "created_at",
            "scan_id",
            "url",
            "size",
            "num_links",
            "num_ok_links",
            "num_non_ok_links",
            "num_images",
            "num_ok_images",
            "num_non_ok_images",
            "num_scripts",
            "num_ok_scripts",
            "num_non_ok_scripts",
            "num_stylesheets",
            "num_ok_stylesheets",
            "num_non_ok_stylesheets",
            "size_images",
            "size_scripts",
            "size_stylesheets",
            "size_total",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "scan_id",
            "url",
            "size",
            "num_links",
            "num_ok_links",
            "num_non_ok_links",
            "num_images",
            "num_ok_images",
            "num_non_ok_images",
            "num_scripts",
            "num_ok_scripts",
            "num_non_ok_scripts",
            "num_stylesheets",
            "num_ok_stylesheets",
            "num_non_ok_stylesheets",
            "size_images",
            "size_scripts",
            "size_stylesheets",
            "size_total",
        ]


class PageDetailSerializer(PageSerializer):
    pagedata = PageDataSerializer(read_only=True)

    class Meta:
        model = Link
        fields = PageSerializer.Meta.fields + ["pagedata"]
        read_only_fields = PageSerializer.Meta.read_only_fields + ["pagedata"]
