from django.contrib import admin


from .models import Link, Scan, Site, UserProfile, GroupSettings, PageData


class LinkInline(admin.TabularInline):
    model = Link.links.through
    fk_name = "from_link"
    exclude = ("to_link",)
    readonly_fields = ("url", "type", "status", "http_status", "error", "response_time")
    verbose_name = "Link"
    verbose_name_plural = "Links"

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


class PageDataInline(admin.StackedInline):
    model = PageData


@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ("scan_id", "url", "type", "status")
    exclude = ("links",)
    inlines = [LinkInline, PageDataInline]


class PageInline(admin.TabularInline):
    model = Link
    verbose_name = "Page"
    verbose_name_plural = "Pages"
    readonly_fields = ("id", "url", "num_links", "num_non_ok_links")
    exclude = ("type", "status", "http_status", "error", "links", "response_time")
    show_change_link = True

    def get_queryset(self, request):
        return Link.objects.pages()

    def has_add_permission(self, request, obj):
        return False

    def num_links(self, obj):
        return obj.num_links

    def num_non_ok_links(self, obj):
        return obj.num_non_ok_links


@admin.register(Scan)
class ScanAdmin(admin.ModelAdmin):
    readonly_fields = ("started_at",)
    list_display = ("site_id", "finished_at")
    inlines = [PageInline]


class ScanInline(admin.TabularInline):
    model = Scan
    readonly_fields = ("id", "started_at", "finished_at")
    show_change_link = True
    max_num = 10
    ordering = ("-finished_at",)

    def has_add_permission(self, request, obj):
        return False


@admin.register(Site)
class SiteAdmin(admin.ModelAdmin):
    list_display = ("url", "user")
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
