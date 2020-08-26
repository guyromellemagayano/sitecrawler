from rest_framework import serializers

from crawl.common import ChoiceField
from crawl.models import Link
from .page_data import PageDataSerializer
from .tls import TlsSerializer


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
    tls_status = ChoiceField(Link.TLS_STATUS_CHOICES)
    num_tls_images = serializers.IntegerField(read_only=True)
    num_non_tls_images = serializers.IntegerField(read_only=True)
    num_tls_scripts = serializers.IntegerField(read_only=True)
    num_non_tls_scripts = serializers.IntegerField(read_only=True)
    num_tls_stylesheets = serializers.IntegerField(read_only=True)
    num_non_tls_stylesheets = serializers.IntegerField(read_only=True)
    tls_images = serializers.BooleanField(read_only=True)
    tls_scripts = serializers.BooleanField(read_only=True)
    tls_stylesheets = serializers.BooleanField(read_only=True)
    tls_total = serializers.BooleanField(read_only=True)

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
            "tls_status",
            "num_tls_images",
            "num_non_tls_images",
            "num_tls_scripts",
            "num_non_tls_scripts",
            "num_tls_stylesheets",
            "num_non_tls_stylesheets",
            "tls_images",
            "tls_scripts",
            "tls_stylesheets",
            "tls_total",
        ]
        read_only_fields = fields


class PageDetailSerializer(PageSerializer):
    pagedata = PageDataSerializer(read_only=True)
    tls = TlsSerializer(read_only=True)

    class Meta:
        model = Link
        fields = PageSerializer.Meta.fields + ["pagedata", "tls"]
        read_only_fields = PageSerializer.Meta.read_only_fields + ["pagedata", "tls"]
