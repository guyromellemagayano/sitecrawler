from django.contrib import admin
from django_better_admin_arrayfield.admin.mixins import DynamicArrayMixin

from .models import StripeCustomer, Subscription, UserSubscription


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin, DynamicArrayMixin):
    list_display = (
        "name",
        "group",
    )


@admin.register(UserSubscription)
class UserSubscriptionAdmin(admin.ModelAdmin):
    list_display = ("user",)


@admin.register(StripeCustomer)
class StripeCustomerAdmin(admin.ModelAdmin):
    list_display = ("user",)
