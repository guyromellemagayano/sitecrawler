from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response

from common import HasPermission


class ConfigViewSet(viewsets.ViewSet):
    permission_classes = [HasPermission("payments.can_manage_subscription")]

    def list(self, request):
        config = {
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        }
        return Response(config)
