from django.db.models import fields
from . import models
from rest_framework import serializers
import logging

logger = logging.getLogger(__name__)


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
    user = UserSerializer()
    code = serializers.ReadOnlyField()

    class Meta:
        model = models.Teacher
        fields = "__all__"

    def create(self, validated_data):
        # user
        user_params = validated_data.pop("user")
        user = models.User.objects.create(**user_params)
        user.is_teacher = True
        user.set_password(user.password)
        user.save()

        # teacher
        code = (
            str(user.created_at.year)
            + "95"  # 標識為教師
            + str(models.Teacher.objects.all().count()).zfill(5)
        )

        teacher = models.Teacher.objects.create(user=user, code=code, **validated_data)
        teacher.save()
        return teacher


from django.core.validators import EmailValidator


class UserEditSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        #  validators=[
        #     UniqueValidator(
        #         queryset=GRUser.objects.all(),
        #         message="A user with that email already exists.",
        #     )]
    )

    class Meta:
        model = models.User
        fields = [
            "id",
            "full_name",
            "email",
            "sex",
            "address",
            "phone",
            "is_active",
        ]


class TeacherEditSerializer(serializers.ModelSerializer):
    user = UserEditSerializer()
    code = serializers.ReadOnlyField()

    class Meta:
        model = models.Teacher
        fields = "__all__"
        # exclude = ["code"]

    def update(self, instance, validated_data):
        # user
        user = validated_data.pop("user")
        userSerializer = UserEditSerializer(
            models.User.objects.get(pk=instance.user.id), user
        )
        userSerializer.is_valid(raise_exception=True)
        userSerializer.save()

        # teacher
        instance.office = validated_data.get("office", instance.office)
        instance.domain = validated_data.get("domain", instance.domain)
        instance.save()

        return instance


class MajorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Major
        fields = "__all__"


class ClassInfoSerializer(serializers.ModelSerializer):
    # major = serializers.ReadOnlyField(source="major.name")
    major = MajorSerializer(read_only=True)

    class Meta:
        model = models.ClassInfo
        fields = "__all__"


class ClassInfoCreateSerializer(serializers.Serializer):
    classCount = serializers.IntegerField()
    year = serializers.DateTimeField()
    majorId = serializers.IntegerField()


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
