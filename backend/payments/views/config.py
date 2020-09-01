from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response


class ConfigViewSet(viewsets.ViewSet):
    def list(self, request):
        config = {
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY,
        }
        return Response(config)
