from django.urls import include, path
from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from .views import MembershipViewSet, TeamViewSet


class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()
team_router = router.register(r"", TeamViewSet, basename="team")
team_router.register(r"membership", MembershipViewSet, basename="membership", parents_query_lookups=["team"])


urlpatterns = [
    path("", include(router.urls)),
]
