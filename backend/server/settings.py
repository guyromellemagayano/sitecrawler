"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os

import requests
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
import stripe

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "3eqkw*0c+_*yw_syv8l1)b+i+8k=w^)3^j(0-89g)6&^(9bsv0")

env = os.environ.get("ENV", "dev")

AWS_SCAN_QUEUE_NAME = f"linkapp-{env}-scan"
AWS_ACCESS_KEY_ID = None
AWS_SECRET_ACCESS_KEY = None
AWS_USE_SSL = True
AWS_ENDPOINT_URL = None
AWS_REGION = "us-east-1"

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": os.environ.get("DB_NAME", "postgres"),
        "USER": os.environ.get("DB_USER", "postgres"),
        "PASSWORD": os.environ.get("DB_PASS", "crawldev"),
        "HOST": os.environ.get("DB_HOST", "db"),
        "PORT": os.environ.get("DB_PORT", "5432"),
    }
}


if env == "dev":
    DEBUG = True
    ALLOWED_HOSTS = ["*"]
    CRAWLER_URL = "http://crawler:3000"
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    AWS_ACCESS_KEY_ID = "foo"
    AWS_SECRET_ACCESS_KEY = "var"
    AWS_ENDPOINT_URL = "http://localstack:4566"
    AWS_USE_SSL = False
elif env == "staging":
    DEBUG = False
    ALLOWED_HOSTS = ["linkapp.epicsandbox.com"]
    SESSION_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    CRAWLER_URL = "http://crawler:8000"
    EMAIL_HOST = "smtp.mailgun.org"
    EMAIL_PORT = 587
    EMAIL_HOST_USER = "postmaster@mg.epicsandbox.com"
    EMAIL_USE_TLS = True
    EMAIL_HOST_PASSWORD = os.environ.get("MAILGUN_PASSWORD")
    DEFAULT_FROM_EMAIL = "linkapp@epicsandbox.com"
elif env == "production":
    DEBUG = False
    ALLOWED_HOSTS = ["app.sitecrawler.com"]
    SESSION_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    CRAWLER_URL = "http://crawler:8000"
    EMAIL_HOST = "smtp.mailgun.org"
    EMAIL_PORT = 587
    EMAIL_HOST_USER = "app@mg.sitecrawler.com"
    EMAIL_USE_TLS = True
    EMAIL_HOST_PASSWORD = os.environ.get("MAILGUN_PASSWORD")
    DEFAULT_FROM_EMAIL = "noreply@sitecrawler.com"
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql_psycopg2",
            "NAME": "production",
            "USER": "production",
            "PASSWORD": os.environ.get("DB_PASS", "crawldev"),
            "HOST": "terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com",
            "PORT": os.environ.get("DB_PORT", "5432"),
        }
    }
else:
    raise Exception(f"Unknown env: {env}")


if env != "dev":
    sentry_sdk.init(
        dsn="https://90c7ff164eee42279efb2d6c7d19b358@o432365.ingest.sentry.io/5394436",
        integrations=[DjangoIntegration()],
        environment=env,
        send_default_pii=True,
    )

# add ec2 ip to allowed hosts for alb healthchecks
try:
    EC2_IP = requests.get("http://169.254.169.254/latest/meta-data/local-ipv4").text
    ALLOWED_HOSTS.append(EC2_IP)
except requests.exceptions.RequestException:
    pass


stripe.api_key = os.environ.get(
    "STRIPE_SECRET_KEY",
    "sk_test_51HIVFqBQhL0pYs2DCd5btngeCNpFsYM6dhjnN52P6pQTAYL6bPc9NT6DAgdy61ieo9DTrcCTEgGTCqeoCnINImVX005V3rKSoF",
)
stripe.api_version = "2020-03-02"

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.sites",
    "django.contrib.staticfiles",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_auth",
    "allauth",
    "allauth.account",
    "rest_auth.registration",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",
    "django_filters",
    "health_check",
    "health_check.db",
    "crawl",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "server.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "server.wsgi.application"


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {"django": {"handlers": ["console"], "level": "ERROR"}},
}


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

SITE_ID = 1

ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "mandatory"
ACCOUNT_AUTHENTICATION_METHOD = "username_email"
LOGIN_REDIRECT_URL = "/dashboard/sites"

AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    "django.contrib.auth.backends.ModelBackend",
    # `allauth` specific authentication methods, such as login by e-mail
    "allauth.account.auth_backends.AuthenticationBackend",
)

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "PAGE_SIZE": 20,
}

REST_AUTH_SERIALIZERS = {"USER_DETAILS_SERIALIZER": "crawl.serializers.UserSerializer"}

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static_out")
