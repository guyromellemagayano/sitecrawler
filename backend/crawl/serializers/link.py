from rest_framework import serializers

from crawl.models import Link


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        return self._choices[obj]


class LinkSerializer(serializers.ModelSerializer):
    status = ChoiceField(Link.STATUS_CHOICES)
    type = ChoiceField(Link.TYPE_CHOICES)

    class Meta:
        model = Link
        fields = ["id", "created_at", "scan_id", "type", "url", "status", "http_status", "response_time", "error"]
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
        ]
