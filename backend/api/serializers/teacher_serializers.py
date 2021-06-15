from django.core.exceptions import ValidationError
from django.db.models import fields
from django.db import transaction
from rest_framework.fields import ReadOnlyField
from .. import models
from rest_framework import serializers
import logging, datetime

logger = logging.getLogger(__name__)


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
        # logger.info("########## create")
        # request = self.context.get("request")
        # user = request.user
        # validated_data["teacher"] = models.Teacher.objects.get(pk=user.id)
        return super().update(instance, validated_data)
