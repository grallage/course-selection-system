from . import models
from django_filters import rest_framework as filters


class MajorFilterSet(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="contains")
    description = filters.CharFilter(field_name="description", lookup_expr="contains")
    id = filters.NumberFilter(field_name="id", lookup_expr="exact")
    is_active = filters.BooleanFilter(field_name="is_active", lookup_expr="exact")

    class Meta:
        model = models.Major
        fields = ["name", "id", "description", "is_active"]


class ClassInfoFilterSet(filters.FilterSet):
    name = filters.CharFilter(field_name="name", lookup_expr="contains")
    major_name = filters.CharFilter(field_name="major__name", lookup_expr="contains")

    class Meta:
        model = models.ClassInfo
        fields = ["name", "major_name"]


class TeacherFilterSet(filters.FilterSet):
    full_name = filters.CharFilter(field_name="user__full_name", lookup_expr="contains")

    class Meta:
        model = models.Teacher
        fields = ["full_name"]
