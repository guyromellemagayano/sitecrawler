from django.contrib.sites import models
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import NestedViewSetMixin

from teams.common import HasTeamDetailPermission
from teams.models import Membership, Invitation
from teams.serializers import MembershipSerializer, MembershipCreateSerializer, MembershipUpdateSerializer
from teams.service import get_current_team


class MembershipViewSet(
    NestedViewSetMixin,
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [HasTeamDetailPermission("teams.can_manage_membership")]
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer

    def dispatch(self, request, *args, **kwargs):
        if "parent_lookup_team" in kwargs and kwargs["parent_lookup_team"] == "current":
            team = get_current_team(request)
            if team:
                kwargs["parent_lookup_team"] = team.id
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        return super().get_queryset().select_related("user", "type")

    def get_serializer_class(self):
        if self.action == "create":
            return MembershipCreateSerializer
        if self.action in ("update", "partial_update"):
            return MembershipUpdateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        invitation = Invitation.objects.create(
            team_id=self.kwargs["parent_lookup_team"],
            email=serializer.validated_data["user_email"],
            membership_type=serializer.validated_data["type_id"],
        )
        invitation.sites.add(*serializer.validated_data["sites"])

        site = models.Site.objects.get_current()
        context = {"invitation": invitation, "site": site}

        subject = render_to_string("teams_invitation_email_subject.txt", context).strip()
        message = render_to_string("teams_invitation_email_message.txt", context)
        send_mail(subject, message, None, [invitation.email])
