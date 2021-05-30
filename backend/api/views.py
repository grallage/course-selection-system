from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, permissions
from rest_framework.filters import OrderingFilter

from . import serializers, models, filters
from rest_framework import urls


class UserViewSet(viewsets.ModelViewSet):
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class MajorViewSet(viewsets.ModelViewSet):
    queryset = models.Major.objects.all()
    serializer_class = serializers.MajorSerializer
    filterset_class = filters.MajorFilterSet
    filter_backends = [OrderingFilter]
    ordering_fields = "__all__"


class ClassInfoViewSet(viewsets.ModelViewSet):
    queryset = models.ClassInfo.objects.all()
    serializer_class = serializers.ClassInfoSerializer


class StudentViewSet(viewsets.ModelViewSet):
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = models.Teacher.objects.all()
    serializer_class = serializers.TeacherSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer


class CourseScheduleViewSet(viewsets.ModelViewSet):
    queryset = models.CourseSchedule.objects.all()
    serializer_class = serializers.CourseScheduleSerializer


class StudentCourseViewSet(viewsets.ModelViewSet):
    queryset = models.StudentCourse.objects.all()
    serializer_class = serializers.StudentCourseSerializer
