from django.core.exceptions import ValidationError
from django.db.models import fields
from rest_framework.fields import ReadOnlyField
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

    def validate(self, attrs):
        request = self.context.get("request")
        if request.method != "PUT":
            return super().validate(attrs)

        validated_attrs = super().validate(attrs)
        old_email = (
            self.instance.user.email
            if self.instance and self.instance.user.email
            else ""
        )
        new_email = (
            validated_attrs["user"]["email"]
            if "user" in validated_attrs and "email" in validated_attrs["user"]
            else ""
        )
        user_id = self.instance.user.id
        errors = {}
        if old_email != new_email:
            if models.User.objects.filter(email=new_email).exclude(id=user_id).exists():
                errors["user"] = {}
                errors["user"]["email"] = "该邮箱地址已被使用，请使用其他邮箱地址。"

        if errors:
            raise serializers.ValidationError(errors)
        return validated_attrs

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
    user = UserSerializer()
    code = serializers.ReadOnlyField()
    class_info = ClassInfoSerializer(read_only=True)
    classId = serializers.CharField(write_only=True, source="class_info__id")

    class Meta:
        model = models.Student
        fields = "__all__"

    def create(self, validated_data):
        # user
        user_params = validated_data.pop("user")
        user = models.User.objects.create(**user_params)
        user.is_student = True
        user.set_password(user.password)
        user.save()

        # student
        classId = validated_data.pop("class_info__id")
        class_info = models.ClassInfo.objects.get(pk=int(classId))
        class_student_count = str(class_info.students.count() + 1)
        code = (
            str(user.created_at.year)
            + str(class_info.id).zfill(4)
            + class_student_count.zfill(3)
        )

        student = models.Student.objects.create(
            user=user, code=code, class_info=class_info, **validated_data
        )
        student.save()
        return student


class StudentEditSerializer(serializers.ModelSerializer):
    user = UserEditSerializer()
    code = serializers.ReadOnlyField()
    class_info = ClassInfoSerializer(read_only=True)
    classId = serializers.CharField(write_only=True, source="class_info__id")

    class Meta:
        model = models.Student
        fields = "__all__"

    def validate(self, attrs):
        request = self.context.get("request")
        if request.method != "PUT":
            return super().validate(attrs)

        validated_attrs = super().validate(attrs)
        old_email = (
            self.instance.user.email
            if self.instance and self.instance.user.email
            else ""
        )
        new_email = (
            validated_attrs["user"]["email"]
            if "user" in validated_attrs and "email" in validated_attrs["user"]
            else ""
        )
        user_id = self.instance.user.id
        errors = {}
        if old_email != new_email:
            if models.User.objects.filter(email=new_email).exclude(id=user_id).exists():
                errors["user"] = {}
                errors["user"]["email"] = "该邮箱地址已被使用，请使用其他邮箱地址。"

        if errors:
            raise serializers.ValidationError(errors)
        return validated_attrs

    def update(self, instance, validated_data):
        # user
        user_params = validated_data.pop("user")
        userSerializer = UserEditSerializer(
            models.User.objects.get(pk=instance.user.id), user_params
        )
        userSerializer.is_valid(raise_exception=True)
        userSerializer.save()

        # student
        classId = validated_data.pop("class_info__id")
        class_info = models.ClassInfo.objects.get(pk=int(classId))

        instance.class_info = class_info
        instance.save()
        return instance


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


class PasswordSerializer(serializers.ModelSerializer):
    new_password1 = serializers.CharField(required=True, write_only=True)
    new_password2 = serializers.CharField(required=True, write_only=True)
    id = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = models.User
        fields = ("password", "new_password1", "new_password2", "id")

    def validate(self, attrs):
        request = self.context.get("request")
        id = int(attrs["id"])
        user = models.User.objects.get(pk=id)
        if not request.user.is_admin and id != request.user.id:
            raise serializers.ValidationError({"invalid": "无权更改其他用户密码"})

        if attrs["new_password1"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password2": "新密码不一致。"})

        if not user.check_password(attrs["password"]):
            raise serializers.ValidationError({"password": "密码错误。"})

        return attrs

    def update(self, instance, validated_data):
        id = int(validated_data["id"])
        user = models.User.objects.get(pk=id)
        user.set_password(validated_data["new_password1"])
        user.save()

        return instance
