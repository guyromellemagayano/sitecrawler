from django.urls import include, path
from rest_framework import routers

from .views import SignupViewSet


router = routers.SimpleRouter()
router.register(r"", SignupViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
