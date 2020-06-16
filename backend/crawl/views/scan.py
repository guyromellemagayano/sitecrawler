from django.db.models import Count, F, Q
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Link, Scan
from crawl.serializers import ScanDetailSerializer, ScanSerializer


class ScanViewSet(
    DetailSerializerMixin,
    NestedViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Scan.objects.all()
    serializer_class = ScanSerializer
    serializer_detail_class = ScanDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(site__user=self.request.user)
        if self._is_request_to_detail_endpoint():
            queryset = (
                queryset.annotate(num_pages=Count("link", filter=Q(link__type=Link.TYPE_PAGE)))
                .annotate(num_links=Count("link"))
                .annotate(num_ok_links=Count("link", filter=Q(link__status=Link.STATUS_OK)))
                .annotate(num_non_ok_links=F("num_links") - F("num_ok_links"))
                .annotate(num_external_links=Count("link", filter=Q(link__type=Link.TYPE_EXTERNAL)))
            )
        return queryset
