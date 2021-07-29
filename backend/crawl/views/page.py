from django.db import models
from django.contrib.postgres.aggregates import ArrayAgg
from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

from crawl.common import CsvMixin, HasPermission
from crawl.models import Link
from crawl.serializers import PageSerializer, PageDetailSerializer


class PageFilter(filters.FilterSet):
    has_title = filters.BooleanFilter(label="Has Title", field_name="pagedata__title", method="filter_has_pagedata")
    has_description = filters.BooleanFilter(
        label="Has Description", field_name="pagedata__description", method="filter_has_pagedata"
    )
    has_h1_first = filters.BooleanFilter(
        label="Has First H1", field_name="pagedata__h1_first", method="filter_has_pagedata"
    )
    has_h1_second = filters.BooleanFilter(
        label="Has Second H1", field_name="pagedata__h1_second", method="filter_has_pagedata"
    )
    has_h2_first = filters.BooleanFilter(
        label="Has First H2", field_name="pagedata__h2_first", method="filter_has_pagedata"
    )
    has_h2_second = filters.BooleanFilter(
        label="Has Second H2", field_name="pagedata__h2_second", method="filter_has_pagedata"
    )
    has_duplicated_title = filters.BooleanFilter(
        label="Has Duplicated Title", field_name="pagedata__title", method="filter_has_duplicated"
    )
    has_duplicated_description = filters.BooleanFilter(
        label="Has Duplicated Description", field_name="pagedata__description", method="filter_has_duplicated"
    )
    num_links = filters.RangeFilter(label="Number of Links")
    num_ok_links = filters.RangeFilter(label="Number of OK Links")
    num_non_ok_links = filters.RangeFilter(label="Number of non-OK Links")
    num_images = filters.RangeFilter(label="Number of Images")
    num_ok_images = filters.RangeFilter(label="Number of OK Images")
    num_non_ok_images = filters.RangeFilter(label="Number of non-OK Images")
    num_tls_images = filters.RangeFilter(label="Number of TLS Images")
    num_non_tls_images = filters.RangeFilter(label="Number of non-TLS Images")
    num_scripts = filters.RangeFilter(label="Number of Scripts")
    num_ok_scripts = filters.RangeFilter(label="Number of OK Scripts")
    num_non_ok_scripts = filters.RangeFilter(label="Number of non-OK Scripts")
    num_tls_scripts = filters.RangeFilter(label="Number of TLS Scripts")
    num_non_tls_scripts = filters.RangeFilter(label="Number of non-TLS Scripts")
    num_stylesheets = filters.RangeFilter(label="Number of Stylesheets")
    num_ok_stylesheets = filters.RangeFilter(label="Number of OK Stylesheets")
    num_non_ok_stylesheets = filters.RangeFilter(label="Number of non-OK Stylesheets")
    num_tls_stylesheets = filters.RangeFilter(label="Number of TLS Stylesheets")
    num_non_tls_stylesheets = filters.RangeFilter(label="Number of non-TLS Stylesheets")
    size_images = filters.RangeFilter(label="Size of Images")
    size_scripts = filters.RangeFilter(label="Size of Scripts")
    size_stylesheets = filters.RangeFilter(label="Size of Stylesheets")
    size_total = filters.RangeFilter(label="Total Size")
    tls_images = filters.BooleanFilter(label="All images tls ok")
    tls_scripts = filters.BooleanFilter(label="All scripts tls ok")
    tls_stylesheets = filters.BooleanFilter(label="All stylesheets tls ok")
    tls_total = filters.BooleanFilter(label="Whole page tls ok")

    class Meta:
        model = Link
        fields = {
            "created_at": ["gt", "gte", "lt", "lte"],
        }

    def filter_has_pagedata(self, queryset, name, value):
        kwargs = {name: ""}
        if value:
            queryset = queryset.exclude(**kwargs)
        else:
            queryset = queryset.filter(**kwargs)
        return queryset

    def filter_has_duplicated(self, queryset, name, value):
        ids = (
            queryset.values(name)  # group by
            .annotate(cnt=models.Count("id", distinct=True))  # count pages pery field
            .annotate(ids=models.Func(ArrayAgg("id", distinct=True), function="UNNEST"))  # get all ids
            .filter(cnt__gt=1)  # only count duplicates
            .values("ids")
        )
        kwargs = {"id__in": ids}
        if value:
            queryset = queryset.filter(**kwargs)
        else:
            queryset = queryset.exclude(**kwargs)
        return queryset


class PageViewSet(
    CsvMixin,
    DetailSerializerMixin,
    NestedViewSetMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [HasPermission("crawl.can_see_pages")]

    queryset = Link.objects.all()
    serializer_class = PageSerializer
    serializer_detail_class = PageDetailSerializer

    filterset_class = PageFilter
    search_fields = ["url"]
    ordering_fields = [
        "id",
        "created_at",
        "url",
        "num_links",
        "num_ok_links",
        "num_non_ok_links",
        "num_images",
        "num_ok_images",
        "num_non_ok_images",
        "num_tls_images",
        "num_non_tls_images",
        "num_scripts",
        "num_ok_scripts",
        "num_non_ok_scripts",
        "num_tls_scripts",
        "num_non_tls_scripts",
        "num_stylesheets",
        "num_ok_stylesheets",
        "num_non_ok_stylesheets",
        "num_tls_stylesheets",
        "num_non_tls_stylesheets",
        "size_images",
        "size_scripts",
        "size_stylesheets",
        "size_total",
        "tls_images",
        "tls_scripts",
        "tls_stylesheets",
        "tls_total",
    ]

    def get_queryset(self):
        queryset = super().get_queryset().filter(scan__site__deleted_at__isnull=True)
        if not self.request.user.is_superuser:
            queryset = queryset.filter(scan__site__user=self.request.user)
        return queryset.pages()
