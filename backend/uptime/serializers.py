from rest_framework import serializers

from crawl.common import ChoiceField
from .models import UptimeStat


class UptimeStatSerializer(serializers.ModelSerializer):
    status = ChoiceField(UptimeStat.STATUS_CHOICES)

    class Meta:
        model = UptimeStat
        fields = ["created_at", "status", "http_status", "response_time", "error"]
        read_only_fields = fields
