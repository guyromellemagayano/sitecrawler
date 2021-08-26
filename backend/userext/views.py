import datetime

from django.contrib.auth.models import User
from rest_framework import mixins
from rest_framework import viewsets

from .serializers import UserSerializer
from teams.models import MembershipType


class UserExtViewSet(mixins.DestroyModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_destroy(self, user):
        for user_membership in user.membership_set.all():
            team = user_membership.team
            has_other_owner = False
            for team_membership in team.membership_set.all():
                if team_membership.user_id != user.id and team_membership.type_id == MembershipType.OWNER:
                    has_other_owner = True

            # delete team if it has no other owner
            if not has_other_owner:
                team.deleted_at = datetime.datetime.now()
                team.save()

        super().perform_destroy(user)

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(id=self.request.user.id)
        return queryset
