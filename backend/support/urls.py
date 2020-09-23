from django.urls import include, path, re_path
from rest_framework import routers

from .views import ContactView


router = routers.DefaultRouter()


urlpatterns = [
    re_path(r"contact", ContactView.as_view()),
    path("", include(router.urls)),
]
