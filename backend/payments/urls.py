from django.urls import include, path, re_path
from rest_framework import routers

from .views import (
    ConfigViewSet,
    InvoiceViewSet,
    PaymentMethodViewSet,
    SubscriptionCurrentView,
    SubscriptionViewSet,
    WebhookView,
)


router = routers.DefaultRouter()
router.register(r"config", ConfigViewSet, basename="config")
router.register(r"invoice", InvoiceViewSet, basename="invoice")
router.register(r"payment-method", PaymentMethodViewSet, basename="payment_method")
router.register(r"subscription", SubscriptionViewSet, basename="subscription")


urlpatterns = [
    re_path(r"subscription/current", SubscriptionCurrentView.as_view()),
    re_path(r"webhook", WebhookView.as_view()),
    path("", include(router.urls)),
]
