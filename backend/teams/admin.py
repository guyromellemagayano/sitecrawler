from django.contrib import admin

from .models import Team, MembershipType, Membership, Plan


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0
    readonly_fields = ("created_at", "updated_at")


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]
    search_fields = ("name",)
    readonly_fields = ("created_at", "updated_at")

    def has_delete_permission(self, *args, **kwargs):
        return False


@admin.register(MembershipType)
class MembershipTypeAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "group")

    def has_delete_permission(self, *args, **kwargs):
        return False

    def has_add_permission(self, *args, **kwargs):
        return False


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "group")

    def has_delete_permission(self, *args, **kwargs):
        return False

    def has_add_permission(self, *args, **kwargs):
        return False
