from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import LinkSerializer


class LinkViewSet(NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer

    def get_queryset(self):
        queryset = super().get_queryset().filter(scan__site__user=self.request.user).order_by("-status")
        return queryset
