from rest_framework import viewsets, mixins

from common import HasPermission
from ..models import SubscriptionType
from ..serializers import SubscriptionTypeSerializer


class SubscriptionViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [HasPermission("payments.can_manage_subscription")]
    serializer_class = SubscriptionTypeSerializer
    queryset = SubscriptionType.objects.all()
