from rest_framework import viewsets, mixins

from teams.models import MembershipType
from teams.serializers import MembershipTypeSerializer


class MembershipTypeViewSet(
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = MembershipType.objects.all()
    serializer_class = MembershipTypeSerializer
