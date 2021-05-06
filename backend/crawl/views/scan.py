from django.conf import settings
from django.contrib.sites import models
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.models import Scan, Site
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
        "force_https": ["exact"],
    }
    search_fields = []
    ordering_fields = ["started_at", "finished_at"]

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(site__user=self.request.user)
        if self._is_request_to_detail_endpoint():
            # use threshold from site if not null, otherwise from user
            site = Site.objects.get(pk=self.kwargs["parent_lookup_site"])
            large_page_size_threshold = site.large_page_size_threshold
            if not large_page_size_threshold:
                large_page_size_threshold = self.request.user.userprofile.large_page_size_threshold
            queryset = queryset.details(large_page_size_threshold=large_page_size_threshold)
        return queryset

    @action(detail=True, methods=["post"])
    def send_finished_email(self, request, pk=None, parent_lookup_site=None):
        scan = (
            Scan.objects.select_related("site", "site__user")
            .details(user_large_page_size_threshold=request.user.userprofile.large_page_size_threshold)
            .get(pk=pk)
        )

        # Only send initial emails here, others will be handled by cron
        if Scan.objects.filter(site_id=scan.site_id).count() == 1:
            self._send_initial_email(scan.site.user, scan)
            return Response()

        return Response()

    def _send_initial_email(self, user, scan):
        site = models.Site.objects.get_current()
        context = {"user": user, "scan": scan, "site": site}
        subject = render_to_string("crawl_initial_email_subject.txt", context).strip()
        message = render_to_string("crawl_initial_email_message.txt", context)
        send_mail(settings.EMAIL_SUBJECT_PREFIX + subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
