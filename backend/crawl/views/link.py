from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import LinkDetailSerializer, LinkSerializer


class HumanReadableMultipleChoiceFilter(filters.MultipleChoiceFilter):
    def __init__(self, *args, **kwargs):
        if "choices" in kwargs:
            self.choices_map = {x[1]: x[0] for x in kwargs["choices"]}
            kwargs["choices"] = [(x[1], x[1]) for x in kwargs["choices"]]
        return super().__init__(*args, **kwargs)

    def filter(self, qs, values):
        return super().filter(qs, [self.choices_map.get(value, value) for value in values])


class LinkFilter(filters.FilterSet):
    type = HumanReadableMultipleChoiceFilter(choices=Link.TYPE_CHOICES)
    status = HumanReadableMultipleChoiceFilter(choices=Link.STATUS_CHOICES)

    class Meta:
        model = Link
        fields = {
            "created_at": ["gt", "gte", "lt", "lte"],
            "http_status": ["exact", "gt", "gte", "lt", "lte", "in"],
            "response_time": ["gt", "gte", "lt", "lte"],
            "error": ["exact", "icontains"],
        }


class LinkViewSet(
    DetailSerializerMixin, NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    serializer_detail_class = LinkDetailSerializer

    filterset_class = LinkFilter
    search_fields = ["url"]
    ordering_fields = [
        "id",
        "created_at",
        "type",
        "url",
        "status",
        "http_status",
        "response_time",
        "error",
        "occurences",
    ]

    def get_queryset(self):
        queryset = super().get_queryset().filter(scan__site__user=self.request.user).links()
        return queryset
