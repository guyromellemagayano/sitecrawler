from rest_framework import serializers

from crawl.serializers import ConfigSerializer as CrawlConfigSerializer
from teams.models import Team
from .plan import PlanSerializer


class TeamSerializer(serializers.ModelSerializer):
    plan = PlanSerializer(read_only=True)
    crawl_config = CrawlConfigSerializer(required=False)

    class Meta:
        model = Team
        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
            "plan",
        ]
        fields = read_only_fields + [
            "name",
            "crawl_config",
        ]

    def update(self, instance, validated_data):
        crawl_config = CrawlConfigSerializer(instance.crawl_config, data=validated_data.pop("crawl_config"))
        crawl_config.is_valid(raise_exception=True)
        crawl_config.save()

        return super().update(instance, validated_data)

    def create(self, validated_data):
        return Team.objects.create_for_user(validated_data["user"], validated_data["name"])
