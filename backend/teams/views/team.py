from django.db import IntegrityError
from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.serializers import Serializer, ValidationError
from rest_framework.response import Response

from teams.common import HasTeamDetailPermission
from teams.models import Team, Membership
from teams.serializers import TeamSerializer, InvitationSerializer
from teams.service import get_current_team, set_current_team


class TeamViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = TeamSerializer

    ordering_fields = ["id", "name", "created_at", "updated_at"]

    def get_permissions(self):
        permission_classes = self.permission_classes
        if self.action == "destroy":
            permission_classes = [HasTeamDetailPermission("teams.can_delete_team")]
        elif self.action in ["update", "partial_update"]:
            permission_classes = [HasTeamDetailPermission("teams.can_manage_team")]
        return [permission() for permission in permission_classes]

    def dispatch(self, request, *args, **kwargs):
        if "pk" in kwargs and kwargs["pk"] == "current":
            team = get_current_team(request)
            if team:
                kwargs["pk"] = team.id
        return super().dispatch(request, *args, **kwargs)

    def get_queryset(self):
        query = Team.objects.filter(deleted_at__isnull=True).select_related("plan", "crawl_config")
        if self.detail and self.request.user.is_superuser:
            return query
        return query.filter(membership__user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_destroy(self, instance):
        instance.soft_delete()

    @action(detail=False, methods=["post"], serializer_class=InvitationSerializer)
    def accept_invitation(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        invitation = serializer.validated_data["id"]

        try:
            Membership.objects.create(user=request.user, team=invitation.team, type=invitation.membership_type)
        except IntegrityError:
            raise ValidationError(f"{request.user} is already member of {invitation.team.name} team.")

        invitation.delete()

        set_current_team(request, invitation.team)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], serializer_class=Serializer)
    def set_current(self, request, pk):
        set_current_team(request, pk)
        return Response(None, status=status.HTTP_200_OK)
