from django.contrib import admin

from .models import Team, MembershipType, Membership


class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    inlines = [MembershipInline]
    search_fields = ("name",)

    def has_delete_permission(self, *args, **kwargs):
        return False


@admin.register(MembershipType)
class MembershipTypeAdmin(admin.ModelAdmin):
    readonly_fields = ("id", "group")

    def has_delete_permission(self, *args, **kwargs):
        return False

    def has_add_permission(self, *args, **kwargs):
        return False
