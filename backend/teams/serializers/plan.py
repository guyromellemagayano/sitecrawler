from rest_framework import serializers

from teams.models import Plan


class PlanSerializer(serializers.ModelSerializer):
    max_sites = serializers.IntegerField(read_only=True)
    name = serializers.CharField(source="get_id_display", read_only=True)

    class Meta:
        model = Plan
        fields = ["id", "name", "max_sites"]
        read_only_fields = fields
