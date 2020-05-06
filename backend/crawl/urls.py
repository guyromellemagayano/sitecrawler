from django.urls import include, path
from rest_framework import routers

from .views import SiteViewSet

router = routers.DefaultRouter()
router.register(r"site", SiteViewSet, basename="site")

urlpatterns = [
    path("", include(router.urls)),
]
