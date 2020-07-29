from rest_framework import serializers

from crawl.models import PageData


class PageDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageData
        fields = ["title", "description", "h1_first", "h1_second", "h2_first", "h2_second"]
