from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from teams.common import HasTeamDetailPermission
from teams.models import Invitation
from teams.serializers import InvitationSerializer
from teams.service import get_current_team


class InvitationViewSet(
    NestedViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [HasTeamDetailPermission("teams.can_manage_membership")]
    queryset = Invitation.objects.all().select_related("membership_type").prefetch_related("sites")
    serializer_class = InvitationSerializer

    def dispatch(self, request, *args, **kwargs):
        if "parent_lookup_team" in kwargs and kwargs["parent_lookup_team"] == "current":
            team = get_current_team(request)
            if team:
                kwargs["parent_lookup_team"] = team.id
        return super().dispatch(request, *args, **kwargs)
