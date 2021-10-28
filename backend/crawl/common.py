from django.db.models import Count, Subquery, IntegerField
from rest_framework import serializers
from rest_framework.settings import api_settings
from rest_framework_csv.renderers import CSVRenderer


class SubQueryCount(Subquery):
    output_field = IntegerField()

    def __init__(self, queryset, *args, **kwargs):
        queryset = queryset.annotate(cnt=Count("id", distinct=True)).values("cnt")
        queryset.query.set_group_by()
        super().__init__(queryset, *args, **kwargs)


class ChoiceField(serializers.ChoiceField):
    def to_representation(self, obj):
        return self._choices[obj]


class CalculatedField:
    def __init__(self, *fields):
        self.fields = fields

    def __get__(self, obj, owner=None):
        total = 0
        for field in self.fields:
            mult = 1
            if field[0] == "-":
                field = field[1:]
                mult = -1

            value = getattr(obj, field, None)
            if value is None:
                return None

            total += mult * value
        return total


class CustomCSVRenderer(CSVRenderer):
    def render(self, data, media_type=None, renderer_context=None):
        if renderer_context is not None:
            filename = renderer_context["request"].path[5:-1].replace("/", "-") + "s.csv"
            renderer_context["response"]["Content-Disposition"] = f"attachment; filename={filename}"

        return super().render(data, media_type, renderer_context)


class CsvMixin:
    renderer_classes = tuple(api_settings.DEFAULT_RENDERER_CLASSES) + (CustomCSVRenderer,)

    def paginate_queryset(self, queryset):
        # disable pagination for csv
        if self.request.query_params.get("format") == "csv":
            return None
        return super().paginate_queryset(queryset)


class Fields(list):
    def __init__(self, add=[], remove=[]):
        self.remove = set(remove)
        super().__init__(x for x in add if x not in remove)

    def __add__(self, other):
        return Fields(super().__add__(other), self.remove | other.remove)
