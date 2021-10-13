"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.views.static import serve
from django.urls import include, path, re_path
from django.views.generic import TemplateView

from rest_framework import routers
from rest_framework_extensions.routers import NestedRouterMixin

from crawl.views import (
    LinkViewSet,
    PageViewSet,
    ScanViewSet,
    SiteViewSet,
    ImageViewSet,
    ScriptViewSet,
    StylesheetViewSet,
)
from payments.views import (
    ConfigViewSet,
    InvoiceViewSet,
    PaymentMethodViewSet,
    SubscriptionCurrentView,
    SubscriptionViewSet,
    WebhookView,
)
from signup.views import SignupViewSet
from support.views import ContactView
from teams.views import MembershipViewSet, TeamViewSet, MembershipTypeViewSet, InvitationViewSet
from uptime.views import UptimeStatViewSet, SendUptimeEmailsView
from userext.views import UserExtViewSet


class NestedDefaultRouter(NestedRouterMixin, routers.DefaultRouter):
    pass


router = NestedDefaultRouter()
site_router = router.register(r"site", SiteViewSet, basename="site")
scan_router = site_router.register(r"scan", ScanViewSet, basename="scan", parents_query_lookups=["site"])
scan_router.register(r"link", LinkViewSet, basename="link", parents_query_lookups=["scan__site", "scan"])
scan_router.register(r"image", ImageViewSet, basename="image", parents_query_lookups=["scan__site", "scan"])
scan_router.register(r"script", ScriptViewSet, basename="script", parents_query_lookups=["scan__site", "scan"])
scan_router.register(
    r"stylesheet", StylesheetViewSet, basename="stylesheet", parents_query_lookups=["scan__site", "scan"]
)
page_router = scan_router.register(r"page", PageViewSet, basename="page", parents_query_lookups=["scan__site", "scan"])
page_router.register(r"link", LinkViewSet, basename="link", parents_query_lookups=["scan__site", "scan", "pages"])
page_router.register(
    r"image", ImageViewSet, basename="image", parents_query_lookups=["scan__site", "scan", "image_pages"]
)
page_router.register(
    r"script", ScriptViewSet, basename="script", parents_query_lookups=["scan__site", "scan", "script_pages"]
)
page_router.register(
    r"stylesheet",
    StylesheetViewSet,
    basename="stylesheet",
    parents_query_lookups=["scan__site", "scan", "stylesheet_pages"],
)

site_router.register(r"uptime", UptimeStatViewSet, basename="uptime", parents_query_lookups=["site"])

router.register(r"stripe/config", ConfigViewSet, basename="config")
router.register(r"stripe/invoice", InvoiceViewSet, basename="invoice")
router.register(r"stripe/payment-method", PaymentMethodViewSet, basename="payment_method")
router.register(r"stripe/subscription", SubscriptionViewSet, basename="subscription")
router.register(r"signup", SignupViewSet, basename="signup")

team_router = router.register(r"team", TeamViewSet, basename="team")
team_router.register(r"membership", MembershipViewSet, basename="membership", parents_query_lookups=["team"])
team_router.register(r"invitation", InvitationViewSet, basename="invitation", parents_query_lookups=["team"])
router.register(r"membership_type", MembershipTypeViewSet, basename="membership_type")

router.register(r"auth/user", UserExtViewSet, basename="user")


urlpatterns = [
    # needed but not used
    path("confirm-sent/", TemplateView.as_view(), name="account_email_verification_sent"),
    re_path(r"confirm-email/(?P<key>[-:\w]+)/$", TemplateView.as_view(), name="account_confirm_email"),
    path("account-exist", TemplateView.as_view(), name="socialaccount_signup"),
    path("reset-password/form/<uidb64>/<token>/", TemplateView.as_view(), name="password_reset_confirm"),
    # urls
    path("admin/", include("loginas.urls")),
    path("admin/", admin.site.urls),
    path("healthcheck/", include("health_check.urls")),
    path("auth/", include("allauth.socialaccount.providers.google.urls")),
    re_path(r"^static/(?P<path>.+)", serve, {"document_root": settings.STATIC_ROOT}),
    # api auth
    path(
        "api/auth/registration/",
        include(("rest_auth.registration.urls", "rest_auth"), namespace="rest_auth_registration"),
    ),
    path("api/auth/", include("rest_auth.urls")),
    # api
    re_path(r"api/support/contact", ContactView.as_view()),
    re_path(r"stripe/subscription/current", SubscriptionCurrentView.as_view()),
    re_path(r"stripe/webhook", WebhookView.as_view()),
    path("api/internal/send_uptime_emails/", SendUptimeEmailsView.as_view()),
    path("api/", include(router.urls)),
]

if settings.ENV == "dev":
    import debug_toolbar

    urlpatterns += [
        path("api/__debug__/", include(debug_toolbar.urls)),
    ]
