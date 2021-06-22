from django.core.exceptions import ValidationError
from django.db.models import fields
from django.db import transaction
from rest_framework.fields import ReadOnlyField
from django.db.models import Q

from .. import models
from rest_framework import serializers
import logging, datetime

logger = logging.getLogger(__name__)


class ClassInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClassInfo
        fields = "__all__"


class UserSerializer(serializers.ModelSerializer):
    email = serializers.ReadOnlyField()
    full_name = serializers.ReadOnlyField()
    is_student = serializers.ReadOnlyField()
    is_admin = serializers.ReadOnlyField()
    is_teacher = serializers.ReadOnlyField()
    is_active = serializers.ReadOnlyField()

    class Meta:
        model = models.User
        # fields = "__all__"
        exclude = ["password"]


class StudentSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    code = serializers.ReadOnlyField()
    class_info = ClassInfoSerializer(read_only=True)

    class Meta:
        model = models.Student
        fields = "__all__"

    @transaction.atomic
    def update(self, instance, validated_data):
        user = validated_data.pop("user")
        userSerializer = UserSerializer(
            models.User.objects.get(pk=instance.user.id), user
        )
        userSerializer.is_valid(raise_exception=True)
        userSerializer.save()

        return instance


class TeacherSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = models.Teacher
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)

    class Meta:
        model = models.Course
        fields = "__all__"


class CourseSerializer2(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    student_course = serializers.SerializerMethodField()

    class Meta:
        model = models.Course
        fields = "__all__"

    def get_student_course(self, instance):
        userId = self.context["request"].user.id
        logger.info(instance.id)

        qs = models.StudentCourse.objects.get(student=userId, course=instance.id)
        return StudentCourseSerializer2(instance=qs).data


class StudentCourseSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = models.StudentCourse
        fields = "__all__"


class StudentCourseSerializer2(serializers.ModelSerializer):
    class Meta:
        model = models.StudentCourse
        fields = "__all__"


class CourseScheduleSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = models.CourseSchedule
        fields = "__all__"


class ElectiveSubjectSerializer(serializers.ModelSerializer):
    teacher = TeacherSerializer(read_only=True)
    courseId = serializers.CharField(write_only=True, allow_blank=True, required=False)

    class Meta:
        model = models.Course
        fields = "__all__"

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]
        user = request.user
        courseId = validated_data.pop("courseId", -1)

        student = models.Student.objects.get(user=user.id)
        course = models.Course.objects.get(pk=courseId)

        studentCourse = models.StudentCourse.objects.create(
            student=student,
            course=course,
        )
        studentCourse.save()
        return course
