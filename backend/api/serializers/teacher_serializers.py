from django.core.exceptions import ValidationError
from django.db.models import fields
from django.db import transaction
from rest_framework.fields import ReadOnlyField
from django.db.models import Q

from .. import models
from rest_framework import serializers
import logging, datetime

logger = logging.getLogger(__name__)


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Teacher
        fields = "__all__"


class ClassInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClassInfo
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    class_info = ClassInfoSerializer()

    class Meta:
        model = models.Course
        fields = "__all__"


class CourseEditSerializer(serializers.ModelSerializer):
    # classeIds = serializers.ListField()
    classeIds = serializers.CharField(write_only=True, allow_blank=True, required=False)
    # deadline = serializers.DateTimeField(write_only=True, required=False)

    class Meta:
        model = models.Course
        # fields = "__all__"
        exclude = ["teacher", "class_info", "students"]

    def validate(self, attrs):
        logger.info("########## validate")
        logger.info(attrs)
        request = self.context.get("request")
        errors = {}
        if request.method == "PUT" or request.method == "DELETE":
            user = request.user
            id = request.parser_context.get("kwargs").get("pk", -1)
            course = models.Course.objects.get(pk=id)
            if course.teacher.user.id != user.id:
                errors["detail"] = "没权操作该课程"

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        logger.info("########## create")
        request = self.context.get("request")
        user = request.user
        validated_data["teacher"] = models.Teacher.objects.get(pk=user.id)

        logger.info(validated_data)

        if validated_data["is_compulsory"]:
            instance = []
            classeIds = validated_data.pop("classeIds", "").split(",")
            classInfoList = models.ClassInfo.objects.filter(id__in=classeIds)
            for classInfo in classInfoList:
                course = super().create(validated_data)
                course.class_info = classInfo
                course.save()
                instance.append(course)
            return instance

        else:
            # deadline = validated_data.pop("deadline")
            # logger.info(deadline)
            # validated_data["deadline"] = deadline
            course = super().create(validated_data)

            return course
        # return super().create(validated_data)

    @transaction.atomic
    def update(self, instance, validated_data):
        return super().update(instance, validated_data)


class CourseScheduleSerializer(serializers.ModelSerializer):
    teacher = serializers.SerializerMethodField("_teacher")
    course = CourseSerializer(read_only=True)
    course_id = serializers.IntegerField(required=False)

    class Meta:
        model = models.CourseSchedule
        fields = "__all__"

    def _teacher(self, obj):
        request = self.context.get("request", None)
        if request:
            teacher = models.Teacher.objects.get(pk=request.user.id)
            return TeacherSerializer(instance=teacher).data

    def validate(self, attrs):
        logger.info("##### attrs")
        logger.info(attrs)

        request = self.context.get("request")
        user = request.user

        attrs["teacher"] = models.Teacher.objects.get(pk=user.id)
        errors = {}
        if request.method == "PUT" or request.method == "DELETE":
            id = request.parser_context.get("kwargs").get("pk", -1)
            course = models.CourseSchedule.objects.get(pk=id)
            if course.teacher.user.id != user.id:
                errors["detail"] = "没权操作该课程"
        elif request.method == "POST":

            count = models.CourseSchedule.objects.filter(
                # ~Q(teacher=user.id),
                teacher=user.id,
                week=attrs["week"],
                time_span=attrs["time_span"],
            ).count()
            if count > 0:
                errors["detail"] = "请勿重叠安排授课"
            else:
                # 检查必修课班级是否已被安排其他课程
                course = models.Course.objects.get(pk=attrs["course_id"])
                if course.is_compulsory:
                    class_info = models.Course.objects.get(pk=course.id).class_info

                    count = models.CourseSchedule.objects.filter(
                        week=attrs["week"],
                        time_span=attrs["time_span"],
                        course__class_info__id=class_info.id,
                    ).count()
                    if count > 0:
                        errors["detail"] = "该班级已被其他教师占用授课"
        logger.info(errors)

        if errors:
            raise serializers.ValidationError(errors)

        return super().validate(attrs)
