from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from ..models import Subscription
from ..serializers import SubscriptionSerializer


class SubscriptionViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet,
):
    serializer_class = SubscriptionSerializer
    queryset = Subscription.objects.all()
