from django.shortcuts import render

from rest_framework import viewsets, permissions, urls, status
from rest_framework.filters import OrderingFilter
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from django.contrib.auth.models import AnonymousUser


from .. import models
from ..serializers import serializers
from ..filters import filters
from django_filters.rest_framework import DjangoFilterBackend
import logging, string, datetime

from django.contrib.auth import logout as auth_logout

logger = logging.getLogger(__name__)


class AdminPermission(permissions.BasePermission):
    message = "权限不足"

    def has_object_permission(self, request, view, obj):
        return super().has_object_permission(request, view, obj)

    def has_permission(self, request, view):
        user = request.user
        if isinstance(user, AnonymousUser) and not user.is_admin:
            return False
        return True


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.User.objects.all()
    serializer_class = serializers.UserSerializer


class MajorViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.Major.objects.all()
    serializer_class = serializers.MajorSerializer
    filterset_class = filters.MajorFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"


class ClassInfoViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.ClassInfo.objects.all()
    serializer_class = serializers.ClassInfoSerializer
    filterset_class = filters.ClassInfoFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def create(self, request, *args, **kwargs):
        serializer = serializers.ClassInfoCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        classCount = serializer.data.get("classCount")
        year = serializer.data.get("year")
        createdDate = datetime.datetime.strptime(str(year), "%Y-%m-%dT%H:%M:%S.%f%z")
        createdDate = createdDate.replace(
            day=1, month=1, hour=0, second=0, microsecond=0
        )
        yearString = str(createdDate.year)
        majorId = serializer.data.get("majorId")
        major = models.Major.objects.get(pk=majorId)
        asciiList = string.ascii_uppercase
        classList = models.ClassInfo.objects.filter(
            year=createdDate, major=major
        ).order_by("-name")
        alphabetIndex = 0
        total = classList.count()
        if (total + classCount) > 10:
            msg = "目前{year}届{major}专业已创建{total}个班级，最多只能创建10个班级".format(
                year=yearString, major=major.name, total=total
            )
            headers = self.get_success_headers(serializer.data)
            return Response(
                {"msg": msg}, status=status.HTTP_400_BAD_REQUEST, headers=headers
            )

        if classList:
            alphabet = classList[0].name[-2:-1]
            alphabetIndex = asciiList.index(alphabet) + 1

        for index in range(classCount):
            name = "{year}{majorName}{classNumber}班".format(
                year=yearString,
                majorName=major.name,
                classNumber=asciiList[index + alphabetIndex],
            )

            models.ClassInfo(major=major, name=name, year=createdDate).save()

        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
        # return super().create(request, *args, **kwargs)


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.Student.objects.all()
    serializer_class = serializers.StudentSerializer
    filterset_class = filters.StudentFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def get_serializer_class(self):
        if self.action == "update":
            return serializers.StudentEditSerializer
        return serializers.StudentSerializer


class TeacherViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.Teacher.objects.all()
    serializer_class = serializers.TeacherSerializer
    filterset_class = filters.TeacherFilterSet
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    ordering_fields = "__all__"

    def get_serializer_class(self):
        if self.action == "update":
            return serializers.TeacherEditSerializer
        return serializers.TeacherSerializer


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.Course.objects.all()
    serializer_class = serializers.CourseSerializer


class CourseScheduleViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.CourseSchedule.objects.all()
    serializer_class = serializers.CourseScheduleSerializer


class StudentCourseViewSet(viewsets.ModelViewSet):
    permission_classes = [AdminPermission]
    queryset = models.StudentCourse.objects.all()
    serializer_class = serializers.StudentCourseSerializer


class PasswordView(UpdateAPIView):
    permission_classes = [AdminPermission]
    serializer_class = serializers.PasswordSerializer
    model = models.User
    queryset = models.User.objects.all()


def logout(self, request):
    logger.info("##########################")
    auth_logout(request)
    return Response(status=status.HTTP_200_OK)
