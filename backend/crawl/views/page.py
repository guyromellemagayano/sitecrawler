from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from crawl.models import Link
from crawl.serializers import PageSerializer


class PageViewSet(NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Link.objects.all()
    serializer_class = PageSerializer

    def get_queryset(self):
        return super().get_queryset().filter(scan__site__user=self.request.user).pages()
