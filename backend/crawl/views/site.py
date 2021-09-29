import datetime
import uuid

from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from common import HasPermission
from crawl.models import Site
from crawl.serializers import SiteSerializer, ScanSerializer
from crawl.services import scan, verify
from teams.service import get_current_team, has_permission


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
    ordering_fields = ["name", "url", "verified", "id", "created_at", "updated_at", "verification_id"]

    def get_permissions(self):
        permission_classes = self.permission_classes
        if self.action in ["destroy", "create", "update", "partial_update", "verify", "start_scan"]:
            permission_classes = [HasPermission("crawl.can_manage_site")]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        query = Site.objects.filter(deleted_at__isnull=True).annotate_last_finished_scan_id()
        if self.detail and self.request.user.is_superuser:
            return query
        return query.filter(team=get_current_team(self.request))

    def perform_create(self, serializer):
        serializer.save(team=get_current_team(self.request), verification_id=uuid.uuid4())

    def perform_destroy(self, instance):
        instance.deleted_at = datetime.datetime.now()
        instance.save()

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
        if not has_permission(request, "crawl.can_start_scan"):
            raise PermissionDenied("You don't have permission to start a scan.")

        site = self.get_object()
        if not site.verified:
            raise PermissionDenied("Site not verified.")

        scan_obj = scan.site(site)
        return Response(ScanSerializer(instance=scan_obj).data)
