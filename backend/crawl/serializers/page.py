from rest_framework import serializers

from crawl.common import ChoiceField, Fields
from crawl.models import Link
from .page_data import PageDataSerializer
from .tls import TlsSerializer
from .link import LinkSummarySerializer


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
    size_total_adjusted = serializers.IntegerField(read_only=True)
    tls_status = ChoiceField(Link.TLS_STATUS_CHOICES, read_only=True)
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
    tls_total_adjusted = serializers.BooleanField(read_only=True)
    has_title_adjusted = serializers.BooleanField(read_only=True)
    has_description_adjusted = serializers.BooleanField(read_only=True)
    has_h1_first_adjusted = serializers.BooleanField(read_only=True)
    has_h1_second_adjusted = serializers.BooleanField(read_only=True)
    has_h2_first_adjusted = serializers.BooleanField(read_only=True)
    has_h2_second_adjusted = serializers.BooleanField(read_only=True)

    class Meta:
        model = Link
        read_only_fields = Fields(
            [
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
                "size_total_adjusted",
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
                "tls_total_adjusted",
                "has_title_adjusted",
                "has_description_adjusted",
                "has_h1_first_adjusted",
                "has_h1_second_adjusted",
                "has_h2_first_adjusted",
                "has_h2_second_adjusted",
            ]
        )
        fields = read_only_fields + Fields(
            [
                "resolved_tls",
                "resolved_size",
                "resolved_missing_title",
                "resolved_missing_description",
                "resolved_missing_h1_first",
                "resolved_missing_h1_second",
                "resolved_missing_h2_first",
                "resolved_missing_h2_second",
                "resolved_duplicate_title",
                "resolved_duplicate_description",
            ]
        )


class PageDetailSerializer(PageSerializer):
    pagedata = PageDataSerializer(read_only=True)
    tls = TlsSerializer(read_only=True)

    class Meta:
        model = Link
        read_only_fields = PageSerializer.Meta.read_only_fields + Fields(
            [
                "pagedata",
                "tls",
            ]
        )
        fields = read_only_fields + PageSerializer.Meta.fields


class PageDuplicatesSerializer(PageSerializer):
    pages_with_same_title = LinkSummarySerializer(many=True)
    pages_with_same_description = LinkSummarySerializer(many=True)

    class Meta:
        model = Link
        read_only_fields = PageSerializer.Meta.read_only_fields + Fields(
            [
                "pages_with_same_title",
                "pages_with_same_description",
            ]
        )
        fields = read_only_fields
