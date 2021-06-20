from django.shortcuts import render
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser
from django.contrib.auth import logout as auth_logout

from rest_framework import viewsets, permissions, urls, status
from rest_framework.filters import OrderingFilter
from rest_framework import generics, mixins


from django_filters.rest_framework import DjangoFilterBackend

from ..serializers import student_serializers as serializers
from ..filters import student_filters as filters
from .. import models

import logging


logger = logging.getLogger(__name__)


class StudentPermission(permissions.BasePermission):
    message = "权限不足"

    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)

    def has_permission(self, request, view):
        user = request.user
        if isinstance(user, AnonymousUser) and not user.is_student:
            return False
        return True


class StudentViewSet(
    mixins.RetrieveModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet
):
    permission_classes = [StudentPermission]
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer


class StudentCourseViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    permission_classes = [StudentPermission]
    queryset = models.StudentCourse.objects.all()
    serializer_class = serializers.StudentCourseSerializer


class CourseScheduleViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    permission_classes = [StudentPermission]
    queryset = models.CourseSchedule.objects.all()
    serializer_class = serializers.CourseScheduleSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        return queryset.filter(course__students=user.id)


class CourseViewSet(
    mixins.RetrieveModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet
):
    permission_classes = [StudentPermission]
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer2

    filterset_class = filters.CourseFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def get_queryset(self):
        user = self.request.user
        queryset = super().get_queryset()
        return queryset.filter(students=user.id)
