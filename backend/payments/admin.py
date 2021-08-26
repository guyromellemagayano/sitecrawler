from django.contrib import admin
from django_better_admin_arrayfield.admin.mixins import DynamicArrayMixin

from .models import StripeCustomer, SubscriptionType, Subscription


@admin.register(SubscriptionType)
class SubscriptionTypeAdmin(admin.ModelAdmin, DynamicArrayMixin):
    list_display = (
        "name",
        "plan",
    )


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    readonly_fields = ("team", "created_at", "updated_at")
    list_display = ("team", "subscription_type", "status")


@admin.register(StripeCustomer)
class StripeCustomerAdmin(admin.ModelAdmin):
    readonly_fields = ("team",)
    list_display = ("team",)
