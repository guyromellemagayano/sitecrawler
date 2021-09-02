import datetime

from django.db.models import DateTimeField, Avg, Max
from django.db.models.functions import Trunc
from django_filters import rest_framework as filters
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework_extensions.mixins import NestedViewSetMixin

from uptime.models import UptimeStat
from uptime.serializers import UptimeStatSerializer
from teams.service import get_current_team


class TooLarge(APIException):
    status_code = 413
    default_detail = "Too many stats in range, use smaller range or bigger time step"
    default_code = "too_large"


class UptimeStatFilter(filters.FilterSet):
    TIME_STEP_MINUTE = "minute"
    TIME_STEP_HOUR = "hour"
    TIME_STEP_DAY = "day"
    TIME_STEP_CHOICES = (
        (TIME_STEP_MINUTE, "Minute"),
        (TIME_STEP_HOUR, "Hour"),
        (TIME_STEP_DAY, "Day"),
    )

    time_step = filters.ChoiceFilter(choices=TIME_STEP_CHOICES, method="process_time_step", label="Time step")

    def __init__(self, *args, **kwargs):
        if "created_at__gte" not in kwargs["data"] and "created_at__lte" not in kwargs["data"]:
            kwargs["data"] = kwargs["data"].copy()
            kwargs["data"]["created_at__gte"] = (datetime.datetime.utcnow() - datetime.timedelta(days=1)).isoformat()
        return super().__init__(*args, **kwargs)

    def process_time_step(self, queryset, name, value):
        queryset = queryset.values().annotate(created_at=Trunc("created_at", value, output_field=DateTimeField()))
        queryset = queryset.values("created_at")
        return queryset.annotate(
            status=Max("status"),
            http_status=Max("http_status"),
            response_time=Avg("response_time"),
            error=Max("error"),
        )

    class Meta:
        model = UptimeStat
        fields = {
            "created_at": ["gte", "lte"],
        }


class UptimeStatViewSet(
    NestedViewSetMixin,
    viewsets.GenericViewSet,
):
    queryset = UptimeStat.objects.all()
    serializer_class = UptimeStatSerializer
    pagination_class = None

    filterset_class = UptimeStatFilter
    ordering_fields = ["created_at"]
    ordering = ["created_at"]

    def get_queryset(self):
        queryset = super().get_queryset().filter(site__deleted_at__isnull=True)
        if not self.request.user.is_superuser:
            queryset = queryset.filter(site__team=get_current_team(self.request))
        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        if queryset.count() > 500:
            raise TooLarge

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"])
    def summary(self, request, parent_lookup_site):
        queryset = self.get_queryset().filter(site_id=parent_lookup_site)

        last = queryset.order_by("-created_at").first()
        serializer = self.get_serializer(last)
        data = {
            "current": serializer.data,
            "uptime_percentage": {
                "24h": queryset.filter_timedelta(datetime.timedelta(hours=24)).uptime_percentage(),
                "7d": queryset.filter_timedelta(datetime.timedelta(days=7)).uptime_percentage(),
                "30d": queryset.filter_timedelta(datetime.timedelta(days=30)).uptime_percentage(),
            },
            "last_downtime": queryset.order_by("-created_at").exclude(status=UptimeStat.STATUS_OK).first_created_at(),
            "last_ok": queryset.order_by("-created_at").filter(status=UptimeStat.STATUS_OK).first_created_at(),
        }

        return Response(data)
