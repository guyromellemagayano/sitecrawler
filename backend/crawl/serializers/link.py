from rest_framework import serializers

from crawl.common import ChoiceField
from crawl.models import Link
from .tls import TlsSerializer


class LinkSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ["id", "url"]
        read_only_fields = ["id", "url"]


class LinkSerializer(serializers.ModelSerializer):
    status = ChoiceField(Link.STATUS_CHOICES)
    type = ChoiceField(Link.TYPE_CHOICES)
    tls_status = ChoiceField(Link.TLS_STATUS_CHOICES)
    occurences = serializers.IntegerField(read_only=True)

    class Meta:
        model = Link
        fields = [
            "id",
            "created_at",
            "scan_id",
            "type",
            "url",
            "status",
            "http_status",
            "response_time",
            "error",
            "size",
            "occurences",
            "tls_status",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "scan_id",
            "type",
            "url",
            "status",
            "http_status",
            "response_time",
            "error",
            "size",
            "occurences",
            "tls_status",
        ]


class LinkDetailSerializer(LinkSerializer):
    pages = LinkSummarySerializer(source="get_pages", many=True)
    tls = TlsSerializer(read_only=True)

    class Meta:
        model = Link
        fields = [
            "id",
            "created_at",
            "scan_id",
            "type",
            "url",
            "status",
            "http_status",
            "response_time",
            "error",
            "size",
            "tls_status",
            "tls",
            "pages",
        ]
        read_only_fields = [
            "id",
            "created_at",
            "scan_id",
            "type",
            "url",
            "status",
            "http_status",
            "response_time",
            "error",
            "size",
            "tls_status",
            "tls",
            "pages",
        ]
