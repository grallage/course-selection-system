from django.db.models import fields
from . import models
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = "__all__"

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    def update(self, instance, validated_data):
        user = super().update(instance, validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user


class TeacherSerializer(serializers.ModelSerializer):
    # user = UserSerializer()

    class Meta:
        model = models.Teacher
        fields = "__all__"
        # exclude = ["user"]

        # def create(self, validated_data):
        #     print(validated_data)
        #     print(validated_data)
        #     print(validated_data)
        #     # user = UserSerializer.create(validated_data.pop("userSerializer"))
        #     user = UserSerializer.create(UserSerializer, validated_data)
        #     teacher = super().create(validated_data)
        #     # user = super().create(validated_data)
        #     user.set_password(validated_data["password"])
        #     user.save()
        #     teacher.user = user
        #     teacher.save()
        # return teacher


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Major
        fields = "__all__"


class ClassInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.ClassInfo
        fields = "__all__"


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Student
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = "__all__"


class CourseScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Course
        fields = "__all__"


class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.StudentCourse
        fields = "__all__"
