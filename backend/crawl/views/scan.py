from django.conf import settings
from django.contrib.sites.models import Site
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Scan
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
        queryset = super().get_queryset()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(site__user=self.request.user)
        if self._is_request_to_detail_endpoint():
            queryset = queryset.details()
        return queryset

    @action(detail=True, methods=["post"])
    def send_finished_email(self, request, pk=None, parent_lookup_site=None):
        scan = Scan.objects.select_related("site", "site__user").details().get(pk=pk)
        if scan.email_sent:
            return Response()

        # Send initial scan email on first scan
        if Scan.objects.filter(site_id=scan.site_id).count() == 1:
            self._send_initial_email(scan.site.user, scan)
            scan.email_sent = True
            scan.save()
            return Response()

        # If there are other scans for user in progress, wait
        if Scan.objects.filter(site__user_id=scan.site.user_id, finished_at__isnull=True).count() > 0:
            return Response()

        scans = Scan.objects.filter(site__user_id=scan.site.user_id, email_sent=False).select_related("site").details()
        self._send_email(
            scan.site.user,
            list(scans),
        )
        scans.update(email_sent=True)

        return Response()

    def _send_initial_email(self, user, scan):
        site = Site.objects.get_current()
        context = {"user": user, "scan": scan, "site": site}
        subject = render_to_string("crawl_initial_email_subject.txt", context).strip()
        message = render_to_string("crawl_initial_email_message.txt", context)
        send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])

    def _send_email(self, user, scans):
        site = Site.objects.get_current()
        context = {"user": user, "scans": scans, "site": site}
        subject = render_to_string("crawl_email_subject.txt", context).strip()
        message = render_to_string("crawl_email_message.txt", context)
        send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
