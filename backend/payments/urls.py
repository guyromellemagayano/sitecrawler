from django.urls import include, path
from rest_framework import routers

from .views import InvoiceViewSet, PaymentMethodViewSet


router = routers.DefaultRouter()
router.register(r"invoice", InvoiceViewSet, basename="invoice")
router.register(r"payment-method", PaymentMethodViewSet, basename="payment_method")


urlpatterns = [
    path("", include(router.urls)),
]
