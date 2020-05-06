from django.db.models import Count
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Scan
from crawl.serializers import ScanDetailSerializer, ScanSerializer


class ScanViewSet(
    DetailSerializerMixin, NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = Scan.objects.all()
    serializer_class = ScanSerializer
    serializer_detail_class = ScanDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(site__user=self.request.user)
        if self._is_request_to_detail_endpoint():
            queryset = queryset.annotate(num_links=Count("link"))
        return queryset
