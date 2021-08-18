from rest_framework import viewsets, mixins

from ..models import SubscriptionType
from ..serializers import SubscriptionTypeSerializer


class SubscriptionViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = SubscriptionTypeSerializer
    queryset = SubscriptionType.objects.all()
