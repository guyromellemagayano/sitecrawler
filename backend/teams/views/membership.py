from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from teams.models import Membership
from teams.serializers import MembershipSerializer, MembershipCreateSerializer, MembershipUpdateSerializer


class MembershipViewSet(
    NestedViewSetMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def get_queryset(self):
        return super().get_queryset().select_related("user", "type")

    def get_serializer_class(self):
        if self.action == "create":
            return MembershipCreateSerializer
        if self.action == "update":
            return MembershipUpdateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        # TODO; send invitation
        print(serializer.validated_data)
