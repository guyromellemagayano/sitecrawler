import re

from django.contrib import admin

from crawl.models import Site
from .models import Invitation, Team, MembershipType, Membership, Plan


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0
    readonly_fields = ("created_at", "updated_at")

    def formfield_for_manytomany(self, db_field, request, **kwargs):
        if db_field.name == "sites":
            team_id = int(re.findall(r"[0-9]+", request.path)[0])
            kwargs["queryset"] = Site.objects.filter(team_id=team_id)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


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


@admin.register(Invitation)
class InvitationAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)
