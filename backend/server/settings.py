"""
Django settings for server project.

Generated by 'django-admin startproject' using Django 3.0.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.0/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.0/ref/settings/
"""

import os
import sys

import boto3
import requests
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
import stripe


def secret(environment, default, secretname=None):
    v = os.getenv(environment)
    if v is not None:
        return v
    if secretname is None:
        secretname = environment

    try:
        secretmanager = boto3.client("secretsmanager")
        return secretmanager.get_secret_value(SecretId=f"{ENV}/{secretname}")["SecretString"]
    except Exception:
        pass

    return default


# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY", "3eqkw*0c+_*yw_syv8l1)b+i+8k=w^)3^j(0-89g)6&^(9bsv0")

TESTING = sys.argv[1:2] == ["test"]
IS_CRON = len(sys.argv) >= 2 and sys.argv[1].startswith("cron_")

ENV = os.environ.get("ENV", "dev")
if TESTING:
    ENV = "test"

AWS_SCAN_QUEUE_NAME = f"linkapp-{ENV}-scan"
AWS_ACCESS_KEY_ID = None
AWS_SECRET_ACCESS_KEY = None
AWS_USE_SSL = True
AWS_ENDPOINT_URL = None
AWS_REGION = "us-east-1"

DB_NAME = os.environ.get("DB_NAME", "postgres")
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASS = secret("DB_PASS", "crawldev", "DB_PASS_BACKEND")
DB_HOST = os.environ.get("DB_HOST", "db")
DB_PORT = os.environ.get("DB_PORT", "5432")

# db query timeout in seconds
DB_TIMEOUT = os.environ.get("DB_TIMEOUT", "60")

STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "123")


if ENV == "dev":
    DEBUG = True
    ALLOWED_HOSTS = ["*"]
    VERIFIER_URL = "http://verifier:3000"
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    AWS_ACCESS_KEY_ID = "foo"
    AWS_SECRET_ACCESS_KEY = "var"
    AWS_ENDPOINT_URL = "http://localstack:4566"
    AWS_USE_SSL = False
    STRIPE_WEBHOOK_SECRET = None
    EMAIL_SUBJECT_PREFIX = "SiteCrawlerDev - "
elif ENV == "staging":
    DEBUG = False
    ALLOWED_HOSTS = ["linkapp.epicsandbox.com", "backend"]
    SESSION_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    VERIFIER_URL = "http://verifier:8000"
    EMAIL_HOST = "smtp.mailgun.org"
    EMAIL_PORT = 587
    EMAIL_HOST_USER = "postmaster@mg.epicsandbox.com"
    EMAIL_USE_TLS = True
    EMAIL_HOST_PASSWORD = os.environ.get("MAILGUN_PASSWORD")
    DEFAULT_FROM_EMAIL = "linkapp@epicsandbox.com"
    EMAIL_SUBJECT_PREFIX = "SiteCrawlerSandbox - "
elif ENV == "production":
    DEBUG = False
    ALLOWED_HOSTS = ["app.sitecrawler.com", "backend"]
    SESSION_COOKIE_SECURE = True
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    VERIFIER_URL = "http://verifier:8000"
    EMAIL_HOST = "smtp.mailgun.org"
    EMAIL_PORT = 587
    EMAIL_HOST_USER = "app@mg.sitecrawler.com"
    EMAIL_USE_TLS = True
    EMAIL_HOST_PASSWORD = os.environ.get("MAILGUN_PASSWORD")
    DEFAULT_FROM_EMAIL = "noreply@sitecrawler.com"
    DB_NAME = "production"
    DB_USER = "backend"
    DB_HOST = "terraform-20200810173347645600000001.ceavi2ewfiqg.us-east-1.rds.amazonaws.com"
    EMAIL_SUBJECT_PREFIX = "SiteCrawler - "
elif ENV == "test":
    DEBUG = True
    ALLOWED_HOSTS = ["*"]
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
    STRIPE_WEBHOOK_SECRET = None
    EMAIL_SUBJECT_PREFIX = "SiteCrawlerTest - "
    DEFAULT_FROM_EMAIL = "from@test.com"
else:
    raise Exception(f"Unknown ENV: {ENV}")


if ENV != "dev" and ENV != "test":
    sentry_sdk.init(
        dsn="https://90c7ff164eee42279efb2d6c7d19b358@o432365.ingest.sentry.io/5394436",
        integrations=[DjangoIntegration()],
        environment=ENV,
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
STRIPE_PUBLISHABLE_KEY = os.environ.get(
    "STRIPE_PUBLISHABLE_KEY",
    "pk_test_51HIVFqBQhL0pYs2DVDldVquI8cWSn4zpmkPG5NOC7fR06i2HfvChSGs1geC30H5OAIrYbTEkj9s8Sei3etUr6FhD00iH8BAzac",
)

# pk of group that new users are auto added to
DEFAULT_USER_GROUP = 1

if IS_CRON:
    DB_TIMEOUT = 3600

# Database
# https://docs.djangoproject.com/en/3.0/ref/settings/#databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        "NAME": DB_NAME,
        "USER": DB_USER,
        "PASSWORD": DB_PASS,
        "HOST": DB_HOST,
        "PORT": DB_PORT,
        "ATOMIC_REQUESTS": True,
        "OPTIONS": {
            "options": f"-c statement_timeout={DB_TIMEOUT}000",
        },
    }
}

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
    "django_better_admin_arrayfield",
    "loginas",
    "health_check",
    "health_check.db",
    "crawl",
    "payments",
    "support",
    "uptime",
    "signup",
    "userext",
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

if ENV == "dev":
    INSTALLED_APPS += [
        "debug_toolbar",
    ]
    MIDDLEWARE += [
        "debug_toolbar.middleware.DebugToolbarMiddleware",
    ]
    DEBUG_TOOLBAR_CONFIG = {"SHOW_TOOLBAR_CALLBACK": lambda r: True}


ROOT_URLCONF = "server.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR + "/server/templates"],
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
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
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
ACCOUNT_EMAIL_SUBJECT_PREFIX = EMAIL_SUBJECT_PREFIX
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
    "DEFAULT_PAGINATION_CLASS": "server.pagination.StandardResultsSetPagination",
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
}

REST_AUTH_SERIALIZERS = {"USER_DETAILS_SERIALIZER": "userext.serializers.UserSerializer"}
REST_AUTH_REGISTER_SERIALIZERS = {
    "REGISTER_SERIALIZER": "server.serializers.NameRegistrationSerializer",
}

CAN_LOGIN_AS = lambda request, target_user: request.user.is_staff

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "static_out")
