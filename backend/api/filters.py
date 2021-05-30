from . import models
from django_filters import rest_framework as filters


class MajorFilterSet(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="contains")
    description = filters.CharFilter(field_name="description", lookup_expr="contains")
    id = filters.NumberFilter(field_name="id", lookup_expr="exact")

    class Meta:
        model = models.Major
        fields = ["name", "id", "description"]
