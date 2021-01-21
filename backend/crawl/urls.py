from django.urls import include, path
from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from .views import LinkViewSet, PageViewSet, ScanViewSet, SiteViewSet, ImageViewSet, ScriptViewSet, StylesheetViewSet

from uptime.views import UptimeStatViewSet, SendUptimeEmailsView


class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()
site_router = router.register(r"site", SiteViewSet, basename="site")
scan_router = site_router.register(r"scan", ScanViewSet, basename="scan", parents_query_lookups=["site"])
scan_router.register(r"link", LinkViewSet, basename="link", parents_query_lookups=["scan__site", "scan"])
scan_router.register(r"image", ImageViewSet, basename="image", parents_query_lookups=["scan__site", "scan"])
scan_router.register(r"script", ScriptViewSet, basename="script", parents_query_lookups=["scan__site", "scan"])
scan_router.register(
    r"stylesheet", StylesheetViewSet, basename="stylesheet", parents_query_lookups=["scan__site", "scan"]
)
page_router = scan_router.register(r"page", PageViewSet, basename="page", parents_query_lookups=["scan__site", "scan"])
page_router.register(r"link", LinkViewSet, basename="link", parents_query_lookups=["scan__site", "scan", "pages"])
page_router.register(
    r"image", ImageViewSet, basename="image", parents_query_lookups=["scan__site", "scan", "image_pages"]
)
page_router.register(
    r"script", ScriptViewSet, basename="script", parents_query_lookups=["scan__site", "scan", "script_pages"]
)
page_router.register(
    r"stylesheet",
    StylesheetViewSet,
    basename="stylesheet",
    parents_query_lookups=["scan__site", "scan", "stylesheet_pages"],
)

site_router.register(r"uptime", UptimeStatViewSet, basename="uptime", parents_query_lookups=["site"])

urlpatterns = [
    path("", include(router.urls)),
    path("internal/send_uptime_emails/", SendUptimeEmailsView.as_view()),
]
