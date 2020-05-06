from django.urls import include, path
from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from .views import ScanViewSet, SiteViewSet


class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()
site_router = router.register(r"site", SiteViewSet, basename="site")
site_router.register(r"scan", ScanViewSet, basename="scan", parents_query_lookups=["site"])

urlpatterns = [
    path("", include(router.urls)),
]
