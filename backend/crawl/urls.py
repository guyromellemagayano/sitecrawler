from django.urls import include, path
from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from .views import LinkViewSet, PageViewSet, ScanViewSet, SiteViewSet


class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()
site_router = router.register(r"site", SiteViewSet, basename="site")
scan_router = site_router.register(r"scan", ScanViewSet, basename="scan", parents_query_lookups=["site"])
page_router = scan_router.register(r"page", PageViewSet, basename="page", parents_query_lookups=["scan__site", "scan"])
page_router.register(r"link", LinkViewSet, basename="link", parents_query_lookups=["scan__site", "scan", "pages"])


urlpatterns = [
    path("", include(router.urls)),
]
