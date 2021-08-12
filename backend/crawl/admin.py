from django.contrib import admin
from django.db.models.functions import Now

from .models import Link, Scan, Site, UserProfile, GroupSettings, PageData, Tls, LinkImage, ScanArchive, ScanCache


class PageChildInline(admin.TabularInline):
    fk_name = "from_link"
    exclude = ("to_link",)
    readonly_fields = ("url", "type", "status", "http_status", "error", "response_time")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.select_related("to_link").order_by("-to_link__status")

    def has_add_permission(self, request, obj):
        return False

    def url(self, obj):
        return obj.to_link.url

    def type(self, obj):
        return obj.to_link.get_type_display()

    def status(self, obj):
        return obj.to_link.get_status_display()

    def http_status(self, obj):
        return obj.to_link.http_status

    def error(self, obj):
        return obj.to_link.error

    def response_time(self, obj):
        return obj.to_link.response_time


class LinkInline(PageChildInline):
    model = Link.links.through
    verbose_name = "Link"
    verbose_name_plural = "Links"


class ImageInline(PageChildInline):
    model = LinkImage
    verbose_name = "Image"
    verbose_name_plural = "Images"
    readonly_fields = PageChildInline.readonly_fields + ("alt_text",)


class ScriptInline(PageChildInline):
    model = Link.scripts.through
    verbose_name = "Script"
    verbose_name_plural = "Scripts"


class StylesheetInline(PageChildInline):
    model = Link.stylesheets.through
    verbose_name = "Stylesheet"
    verbose_name_plural = "Stylesheets"


class PageDataInline(admin.StackedInline):
    model = PageData


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ("scan_id", "url", "type", "status")
    exclude = ("links", "images", "stylesheets", "scripts")
    inlines = [LinkInline, ImageInline, ScriptInline, StylesheetInline, PageDataInline]


class PageInline(admin.TabularInline):
    model = Link
    verbose_name = "Page"
    verbose_name_plural = "Pages"
    readonly_fields = ("id", "url", "num_links", "num_non_ok_links", "tls_status")
    exclude = (
        "type",
        "status",
        "http_status",
        "error",
        "links",
        "images",
        "stylesheets",
        "scripts",
        "response_time",
        "tls",
        "size",
        "cached_num_tls_images",
        "cached_num_tls_scripts",
        "cached_num_tls_stylesheets",
        "cached_num_non_tls_images",
        "cached_num_non_tls_scripts",
        "cached_num_non_tls_stylesheets",
        "cached_tls_images",
        "cached_tls_scripts",
        "cached_tls_stylesheets",
        "cached_tls_total",
        "cached_size_images",
        "cached_size_scripts",
        "cached_size_stylesheets",
        "cached_size_total",
        "cached_link_occurences",
        "cached_image_occurences",
        "cached_script_occurences",
        "cached_stylesheet_occurences",
        "cached_image_missing_alts",
        "cached_num_links",
        "cached_num_images",
        "cached_num_scripts",
        "cached_num_stylesheets",
        "cached_num_ok_links",
        "cached_num_ok_images",
        "cached_num_ok_scripts",
        "cached_num_ok_stylesheets",
        "cached_num_non_ok_links",
        "cached_num_non_ok_images",
        "cached_num_non_ok_scripts",
        "cached_num_non_ok_stylesheets",
    )
    show_change_link = True

    def get_queryset(self, request):
        return Link.objects.pages()

    def has_add_permission(self, request, obj):
        return False

    def num_links(self, obj):
        return obj.num_links

    def num_non_ok_links(self, obj):
        return obj.num_non_ok_links


def mark_finished(modeladmin, request, queryset):
    queryset.filter(finished_at__isnull=True).update(finished_at=Now())


mark_finished.short_description = "Mark scans as finished"


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    readonly_fields = ("started_at",)
    list_display = ("url", "started_at", "finished_at")
    list_filter = ("finished_at",)
    inlines = [PageInline]
    actions = [mark_finished]

    def url(self, obj):
        return obj.site.url

    def get_queryset(self, request):
        return super().get_queryset(request).select_related("site")


class ScanInline(admin.TabularInline):
    model = Scan
    readonly_fields = ("id", "started_at", "finished_at", "force_https")
    show_change_link = True
    max_num = 10
    ordering = ("-finished_at",)

    def has_add_permission(self, request, obj):
        return False


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    readonly_fields = ("created_at", "updated_at")
    list_display = ("url", "team")
    list_filter = ("user__username",)
    inlines = [ScanInline]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)
    search_fields = ("user__username", "user__email")
    readonly_fields = ("user",)


@admin.register(GroupSettings)
class GroupSettingsAdmin(admin.ModelAdmin):
    list_display = ("group",)
    search_fields = ("group__name",)
    readonly_fields = ("group",)


@admin.register(Tls)
class TlsAdmin(admin.ModelAdmin):
    list_display = ("common_name", "issuer_organization", "version", "errors")


@admin.register(ScanArchive)
class ScanArchiveAdmin(admin.ModelAdmin):
    list_display = ("url", "started_at", "finished_at", "scan_id")

    def url(self, obj):
        return obj.site.url


@admin.register(ScanCache)
class ScanCacheAdmin(admin.ModelAdmin):
    list_display = ("scan", "created_at")
