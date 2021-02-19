from django.urls import include, path
from rest_framework import routers

from .views import UserExtViewSet


router = routers.DefaultRouter()
router.register(r"", UserExtViewSet)


urlpatterns = [
    path("", include(router.urls)),
]
