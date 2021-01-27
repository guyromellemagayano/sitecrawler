from rest_framework import serializers

from crawl.common import ChoiceField
from crawl.models import Link
from .tls import TlsSerializer


class LinkSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ["id", "url"]
        read_only_fields = fields


class SourceLinkImageSerializer(serializers.Serializer):
    id = serializers.IntegerField(source="from_link.id")
    url = serializers.CharField(source="from_link.url")
    alt_text = serializers.CharField()


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
        read_only_fields = fields


class LinkDetailSerializer(LinkSerializer):
    pages = serializers.SerializerMethodField()
    tls = TlsSerializer(read_only=True)

    def get_pages(self, obj):
        query = getattr(obj, self.Meta.pages_attr)
        many = True
        pages_parent_lookup = getattr(self.Meta, "pages_parent_lookup", "parent_lookup_" + self.Meta.pages_attr)
        if pages_parent_lookup in self.context["view"].kwargs:
            query = query.get(
                **{
                    self.Meta.pages_get_key: self.context["view"].kwargs[pages_parent_lookup],
                },
            )
            many = False
        return self.Meta.pages_serializer(query, many=many).data

    class Meta:
        pages_attr = "pages"
        pages_serializer = LinkSummarySerializer
        pages_get_key = "id"

        model = Link
        fields = [x for x in LinkSerializer.Meta.fields if x != "occurences"] + [
            "tls",
            "pages",
        ]
        read_only_fields = fields


class ImageDetailSerializer(LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "source_link_images"
        pages_parent_lookup = "parent_lookup_image_pages"
        pages_serializer = SourceLinkImageSerializer
        pages_get_key = "from_link_id"


class ScriptDetailSerializer(LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "script_pages"


class StylesheetDetailSerializer(LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "stylesheet_pages"
