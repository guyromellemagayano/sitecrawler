from django.contrib import admin

from .models import Link, Scan, Site


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ("scan_id", "url", "type", "status")


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    list_display = ("site_id", "started_at", "finished_at")


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("url", "user")
