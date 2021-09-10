import datetime

from rest_framework import viewsets, mixins

from .models import Team
from .serializers import TeamSerializer
from .service import get_current_team


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
