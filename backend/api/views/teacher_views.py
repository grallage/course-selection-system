from django.shortcuts import render
from django.db.models import Q
from rest_framework import viewsets, permissions, urls, status
from rest_framework.filters import OrderingFilter
from django.contrib.auth.models import AnonymousUser


from ..serializers import teacher_serializers as serializers
from ..filters import teacher_filters as filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, mixins
import logging
from .. import models

from django.contrib.auth import logout as auth_logout

logger = logging.getLogger(__name__)


class TeacherPermission(permissions.BasePermission):
    message = "权限不足"

    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)

    def has_permission(self, request, view):
        user = request.user
        if isinstance(user, AnonymousUser) and not user.is_teacher:
            return False
        return True


class ClassInfoViewSet(viewsets.ModelViewSet):
    permission_classes = [TeacherPermission]
    queryset = models.ClassInfo.objects.all()
    serializer_class = serializers.ClassInfoSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [TeacherPermission]
    queryset = models.Course.objects.all()
    # serializer_class = serializers.CourseSerializer
    filterset_class = filters.CourseFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def get_serializer_class(self):

        if self.action == "create" or self.action == "update":
            return serializers.CourseEditSerializer
        return serializers.CourseSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        return queryset.filter(teacher__user__id=user.id)


# class CourseViewSet(viewsets.ModelViewSet):
#     queryset = models.Course.objects.all()
#     serializer_class = serializers.CourseSerializer


class CourseScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = [TeacherPermission]
    queryset = models.CourseSchedule.objects.all()
    serializer_class = serializers.CourseScheduleSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def get_queryset(self):
        showOtherTeacherCourse = self.request.GET.get("showOtherTeacherCourse", False)
        user = self.request.user
        queryset = super().get_queryset()
        if showOtherTeacherCourse:
            class_ids = (
                models.Course.objects.filter(
                    teacher__user__id=user.id,
                    # is_compulsory=True
                )
                .values("class_info__id")
                .distinct()
            )
            return queryset.filter(
                Q(course__class_info__id__in=class_ids) | Q(teacher_id=user.id)
            ).distinct()

        return queryset.filter(teacher__user__id=user.id)
