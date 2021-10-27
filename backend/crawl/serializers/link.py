from rest_framework import serializers

from crawl.common import ChoiceField, Fields
from crawl.models import Link
from .tls import TlsSerializer


class LinkSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ["id", "url"]
        read_only_fields = fields


class SourceLinkImageSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    url = serializers.CharField()
    alt_text = serializers.CharField()


class LinkSerializer(serializers.ModelSerializer):
    status = ChoiceField(Link.STATUS_CHOICES, read_only=True)
    status_adjusted = ChoiceField(Link.STATUS_CHOICES, read_only=True)
    type = ChoiceField(Link.TYPE_CHOICES, read_only=True)
    tls_status = ChoiceField(Link.TLS_STATUS_CHOICES, read_only=True)
    tls_status_adjusted = ChoiceField(Link.TLS_STATUS_CHOICES, read_only=True)
    occurences = serializers.IntegerField(read_only=True)

    class Meta:
        model = Link
        read_only_fields = Fields(
            [
                "id",
                "created_at",
                "scan_id",
                "type",
                "url",
                "status",
                "status_adjusted",
                "http_status",
                "response_time",
                "error",
                "size",
                "occurences",
                "tls_status",
                "tls_status_adjusted",
            ]
        )
        fields = read_only_fields + Fields(
            [
                "resolved_status",
                "resolved_tls",
            ]
        )


class LinkDetailSerializer(LinkSerializer):
    pages = serializers.SerializerMethodField(read_only=True)
    tls = TlsSerializer(read_only=True)

    def get_pages(self, obj):
        query = getattr(obj, self.Meta.pages_attr)
        many = True
        pages_parent_lookup = getattr(self.Meta, "pages_parent_lookup", "parent_lookup_" + self.Meta.pages_attr)
        if getattr(self.Meta, "pages_select_related", None):
            query = query.select_related(*self.Meta.pages_select_related)
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
        read_only_fields = LinkSerializer.Meta.read_only_fields + Fields(
            add=[
                "tls",
                "pages",
            ],
            remove=["occurences"],
        )
        fields = LinkSerializer.Meta.fields + read_only_fields


class ImageSerializer(LinkSerializer):
    missing_alts = serializers.IntegerField(read_only=True)
    missing_alts_adjusted = serializers.IntegerField(read_only=True)

    class Meta(LinkSerializer.Meta):
        read_only_fields = LinkSerializer.Meta.read_only_fields + Fields(
            [
                "missing_alts",
                "missing_alts_adjusted",
            ]
        )
        fields = (
            LinkSerializer.Meta.fields
            + read_only_fields
            + Fields(
                [
                    "resolved_missing_alts",
                ]
            )
        )


class ImageDetailSerializer(ImageSerializer, LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "source_link_images"
        pages_parent_lookup = "parent_lookup_image_pages"
        pages_serializer = SourceLinkImageSerializer
        pages_get_key = "from_link_id"
        pages_select_related = ["from_link"]

        read_only_fields = ImageSerializer.Meta.read_only_fields + LinkDetailSerializer.Meta.read_only_fields
        fields = ImageSerializer.Meta.fields + LinkDetailSerializer.Meta.fields

    def get_pages(self, obj):
        query_str = """
SELECT
  i.alt_text AS alt_text,
  l.id AS id,
  l.url AS url
FROM crawl_link_images i
JOIN crawl_link l
  ON i.from_link_id = l.id
WHERE i.to_link_id = %(to_link_id)s
"""
        query_params = {"to_link_id": obj.id}
        many = True

        if "parent_lookup_image_pages" in self.context["view"].kwargs:
            query_str += "AND i.from_link_id = %(from_link_id)s"
            query_params["from_link_id"] = int(self.context["view"].kwargs["parent_lookup_image_pages"])
            many = False

        query = obj.source_link_images.raw(query_str, query_params)
        if not many:
            query = query[0]

        return SourceLinkImageSerializer(query, many=many).data


class ScriptDetailSerializer(LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "script_pages"


class StylesheetDetailSerializer(LinkDetailSerializer):
    class Meta(LinkDetailSerializer.Meta):
        pages_attr = "stylesheet_pages"
