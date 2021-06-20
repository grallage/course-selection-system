from .. import models
from django_filters import rest_framework as filters


class CourseFilterSet(filters.FilterSet):
    course_name = filters.CharFilter(field_name="title", lookup_expr="contains")
    class_name = filters.CharFilter(
        field_name="class_info__name", lookup_expr="contains"
    )

    class Meta:
        model = models.Course
        fields = ["course_name", "class_name"]
