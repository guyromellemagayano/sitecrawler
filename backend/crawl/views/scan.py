from django.conf import settings
from django.contrib.sites import models
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Scan
from crawl.serializers import ScanDetailSerializer, ScanSerializer
from teams.service import get_current_membership, get_current_team, has_permission


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
        "force_https": ["exact"],
    }
    search_fields = []
    ordering_fields = ["started_at", "finished_at"]
    ordering = ["-finished_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(site__deleted_at__isnull=True)
        if self.request.user.is_superuser:
            pass
        elif has_permission(self.request, "crawl.can_see_all_sites"):
            queryset = queryset.filter(site__team=get_current_team(self.request))
        else:
            queryset = queryset.filter(site__membership=get_current_membership(self.request))
        if self._is_request_to_detail_endpoint():
            queryset = queryset.with_details()
        return queryset

    @action(detail=True, methods=["post"])
    def send_finished_email(self, request, pk=None, parent_lookup_site=None):
        scan = Scan.objects.filter(site__deleted_at__isnull=True).get(pk=pk)

        # Only send initial emails here, others will be handled by cron
        if Scan.objects.filter(site_id=scan.site_id).count() == 1:
            users = [m.user for m in scan.site.team.membership_set.all()]
            swd = Scan.objects.with_details().get(pk=scan.id)
            self._send_initial_email(users, swd)

            return Response()

        return Response()

    def _send_initial_email(self, users, scan):
        for user in users:
            if not user.email or not user.is_active:
                continue

            site = models.Site.objects.get_current()
            context = {"user": user, "scan": scan, "site": site}
            subject = render_to_string("crawl_initial_email_subject.txt", context).strip()
            message = render_to_string("crawl_initial_email_message.txt", context)
            send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
