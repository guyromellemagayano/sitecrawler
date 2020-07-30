from django.db.models import Count, Subquery, IntegerField


class SubQueryCount(Subquery):
    output_field = IntegerField()

    def __init__(self, queryset, *args, **kwargs):
        queryset = queryset.annotate(cnt=Count("id", distinct=True)).values("cnt")
        queryset.query.set_group_by()
        super().__init__(queryset, *args, **kwargs)
