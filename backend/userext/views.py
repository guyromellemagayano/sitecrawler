from django.contrib.auth.models import User
from rest_framework import mixins
from rest_framework import viewsets

from .serializers import UserSerializer


class UserExtViewSet(mixins.DestroyModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_destroy(self, user):
        for user_membership in user.membership_set.all():
            user_membership.delete()

        super().perform_destroy(user)

    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_superuser:
            queryset = queryset.filter(id=self.request.user.id)
        return queryset
