from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import LinkDetailSerializer, LinkSerializer


class LinkViewSet(
    DetailSerializerMixin, NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    serializer_detail_class = LinkDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(scan__site__user=self.request.user).links()
        return queryset
