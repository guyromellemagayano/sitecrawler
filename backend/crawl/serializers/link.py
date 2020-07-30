from rest_framework import serializers

from crawl.models import Link


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        return self._choices[obj]


class LinkSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Link
        fields = ["id", "url"]
        read_only_fields = ["id", "url"]


class LinkSerializer(serializers.ModelSerializer):
    status = ChoiceField(Link.STATUS_CHOICES)
    type = ChoiceField(Link.TYPE_CHOICES)
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
            "occurences",
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
            "occurences",
        ]


class LinkDetailSerializer(LinkSerializer):
    pages = LinkSummarySerializer(source="get_pages", many=True)

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
            "pages",
        ]
