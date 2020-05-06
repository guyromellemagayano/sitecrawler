from django.db.models import Count, F, Q
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import PageSerializer


class PageViewSet(NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Link.objects.filter(type=Link.TYPE_PAGE)
    serializer_class = PageSerializer

    def get_queryset(self):
        return (
            super()
            .get_queryset()
            .filter(scan__site__user=self.request.user)
            .annotate(num_links=Count("links"))
            .annotate(num_ok_links=Count("links", filter=Q(links__status=Link.STATUS_OK)))
            .annotate(num_non_ok_links=F("num_links") - F("num_ok_links"))
            .order_by("-num_non_ok_links")
        )
