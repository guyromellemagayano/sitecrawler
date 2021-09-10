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
    path(
        "api/auth/registration/",
        include(("rest_auth.registration.urls", "rest_auth"), namespace="rest_auth_registration"),
    ),
    path("api/auth/", include("rest_auth.urls")),
    path("api/auth/user/", include("userext.urls")),
    path("auth/", include("allauth.socialaccount.providers.google.urls")),
    path("api/support/", include("support.urls")),
    path("api/stripe/", include("payments.urls")),
    path("api/signup/", include("signup.urls")),
    path("api/team/", include("teams.urls")),
    path("api/", include("crawl.urls")),
    re_path(r"^static/(?P<path>.+)", serve, {"document_root": settings.STATIC_ROOT}),
]

if settings.ENV == "dev":
    import debug_toolbar

    urlpatterns += [
        path("api/__debug__/", include(debug_toolbar.urls)),
    ]
