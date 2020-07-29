from django_filters import rest_framework as filters
from rest_framework import viewsets, mixins
from rest_framework_extensions.mixins import DetailSerializerMixin, NestedViewSetMixin

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
    num_links = filters.RangeFilter(label="Number of Links")
    num_ok_links = filters.RangeFilter(label="Number of OK Links")
    num_non_ok_links = filters.RangeFilter(label="Number of non-OK Links")
    num_images = filters.RangeFilter(label="Number of Images")
    num_ok_images = filters.RangeFilter(label="Number of OK Images")
    num_non_ok_images = filters.RangeFilter(label="Number of non-OK Images")
    num_scripts = filters.RangeFilter(label="Number of Scripts")
    num_ok_scripts = filters.RangeFilter(label="Number of OK Scripts")
    num_non_ok_scripts = filters.RangeFilter(label="Number of non-OK Scripts")
    num_stylesheets = filters.RangeFilter(label="Number of Stylesheets")
    num_ok_stylesheets = filters.RangeFilter(label="Number of OK Stylesheets")
    num_non_ok_stylesheets = filters.RangeFilter(label="Number of non-OK Stylesheets")

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


class PageViewSet(
    DetailSerializerMixin, NestedViewSetMixin, mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
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
        "num_scripts",
        "num_ok_scripts",
        "num_non_ok_scripts",
        "num_stylesheets",
        "num_ok_stylesheets",
        "num_non_ok_stylesheets",
    ]

    def get_queryset(self):
        return super().get_queryset().filter(scan__site__user=self.request.user).pages()
