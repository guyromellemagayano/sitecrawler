import uuid

from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from crawl.models import Site
from crawl.serializers import SiteSerializer, ScanSerializer
from crawl.services import scan, verify


class SiteViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = SiteSerializer

    filterset_fields = ["verified"]
    search_fields = ["url", "name"]
    ordering_fields = ["name", "url", "verified", "id", "created_at", "updated_at", "user_id", "verification_id"]

    def get_queryset(self):
        query = Site.objects.all().annotate_last_finished_scan_id()
        if self.detail and self.request.user.is_superuser:
            return query
        return query.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, verification_id=uuid.uuid4())

    @action(detail=True, methods=["post"])
    def verify(self, request, pk=None):
        site = self.get_object()
        if not site.verified:
            verify.site(site)
            site.refresh_from_db()

            if site.verified:
                scan.site(site)
        return Response(self.get_serializer(instance=site).data)

    @action(detail=True, methods=["post"])
    def start_scan(self, request, pk=None):
        if not request.user.has_perm("crawl.can_start_scan"):
            raise PermissionDenied("You don't have permission to start a scan.")

        site = self.get_object()
        if not site.verified:
            raise PermissionDenied("Site not verified.")

        scan_obj = scan.site(site)
        return Response(ScanSerializer(instance=scan_obj).data)
