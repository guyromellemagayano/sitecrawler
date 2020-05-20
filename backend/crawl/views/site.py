import uuid

from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response

from crawl.models import Site
from crawl.serializers import SiteSerializer
from crawl.services import verify


class SiteViewSet(mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
    serializer_class = SiteSerializer

    def get_queryset(self):
        return Site.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, verification_id=uuid.uuid4())

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        site = self.get_object()
        if not site.verified:
            site.verified = verify.url(site.url)
            site.save()
        return Response(self.get_serializer(instance=site).data)
