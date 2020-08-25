from django.db.models import Count, Subquery, IntegerField
from rest_framework import serializers


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
