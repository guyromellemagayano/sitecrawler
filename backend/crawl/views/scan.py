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

    filterset_fields = {
        "started_at": ["gt", "gte", "lt", "lte"],
        "finished_at": ["isnull", "gt", "gte", "lt", "lte"],
    }
    search_fields = []
    ordering_fields = ["started_at", "finished_at"]

    def get_queryset(self):
        queryset = super().get_queryset().filter(site__user=self.request.user)
        if self._is_request_to_detail_endpoint():
            queryset = (
                queryset.annotate(num_pages=Count("link", filter=Q(link__type=Link.TYPE_PAGE)))
                .annotate(num_links=Count("link"))
                .annotate(num_ok_links=Count("link", filter=Q(link__status=Link.STATUS_OK)))
                .annotate(num_non_ok_links=F("num_links") - F("num_ok_links"))
                .annotate(num_external_links=Count("link", filter=Q(link__type=Link.TYPE_EXTERNAL)))
                .annotate(
                    num_pages_without_title=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__title=""),
                    )
                )
                .annotate(
                    num_pages_without_description=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__description=""),
                    )
                )
                .annotate(
                    num_pages_without_h1_first=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__h1_first=""),
                    )
                )
                .annotate(
                    num_pages_without_h1_second=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__h1_second=""),
                    )
                )
                .annotate(
                    num_pages_without_h2_first=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__h2_first=""),
                    )
                )
                .annotate(
                    num_pages_without_h2_second=Count(
                        "link", filter=Q(link__type=Link.TYPE_PAGE) & Q(link__pagedata__h2_second=""),
                    )
                )
            )
        return queryset
