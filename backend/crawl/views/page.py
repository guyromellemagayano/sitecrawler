from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import PageSerializer


class PageViewSet(NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Link.objects.all()
    serializer_class = PageSerializer

    filterset_fields = {"created_at": ["gt", "gte", "lt", "lte"]}
    search_fields = ["url"]
    ordering_fields = ["id", "created_at", "url", "num_links", "num_ok_links", "num_non_ok_links"]

    def get_queryset(self):
        return super().get_queryset().filter(scan__site__user=self.request.user).pages()
