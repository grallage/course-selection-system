from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.utils.translation import gettext_lazy as _
from .utils import (
    SEX_CHOICES,
    STATUS_CHOICES,
    TIME_CHOICES,
    WEEK_CHOICES,
    CREDIT_CHOICES,
)


class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError(_("用户需要设置电子邮箱地址"))
        user = self.model(email=self.normalize_email(email), name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        if not email:
            raise ValueError(_("用户需要设置电子邮箱地址"))
        user = self.create_user(email, name, password)
        user.is_active = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    full_name = models.CharField(_("名称"), max_length=16)
    password = models.CharField(_("密码"), max_length=128)
    email = models.EmailField(_("邮箱地址"), unique=True)
    sex = models.CharField(
        _("性别"), max_length=10, choices=SEX_CHOICES, default=SEX_CHOICES[0][0]
    )
    address = models.CharField(_("住址"), max_length=128, blank=True, default="")
    phone = models.CharField(_("電話號碼"), blank=True, max_length=20, default="")
    is_student = models.BooleanField(_("是否学生"), default=False)
    is_teacher = models.BooleanField(_("是否教师"), default=False)
    is_admin = models.BooleanField(_("是否管理员"), default=False)
    is_active = models.BooleanField(_("账号是否激活"), default=False)
    created_at = models.DateTimeField(_("创建时间"), auto_now_add=True)
    modified_at = models.DateTimeField(_("修改时间"), auto_now=True)

    USERNAME_FIELD = "email"
    EMAIL_FIELD = "email"
    REQUIRED_FIELDS = [
        "full_name",
        "sex",
        "address",
        "phone",
        "is_student",
        "is_teacher",
        "is_admin",
    ]

    objects = UserManager()

    def __str__(self):
        return self.full_name

    class Meta:
        ordering = ["-created_at"]
        db_table = "user"


class Major(models.Model):
    name = models.CharField(_("主修专业"), default="", max_length=32)
    description = models.TextField(_("主修专业描述"), blank=True, default="")
    is_active = models.BooleanField(_("是否激活"), default=True)
    created_at = models.DateTimeField(_("创建时间"), auto_now_add=True)
    modified_at = models.DateTimeField(_("修改时间"), auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        db_table = "major"
        ordering = ["name"]


class ClassInfo(models.Model):
    year = models.DateField(_("班级创建年份"))
    major = models.ForeignKey(Major, on_delete=models.CASCADE)
    name = models.CharField(_("班级名称"), default="", max_length=64)
    created_at = models.DateTimeField(_("創建時間"), auto_now_add=True)
    modified_at = models.DateTimeField(_("修改時間"), auto_now=True)

    def __str__(self):
        return "{name}".format(name=self.name)

    class Meta:
        db_table = "class_info"
        ordering = ["-year", "-major"]


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    code = models.CharField(_("学号"), unique=True, max_length=16)
    class_info = models.ForeignKey(ClassInfo, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.full_name

    class Meta:
        ordering = ["-code"]
        verbose_name = "學生"
        verbose_name_plural = verbose_name
        # get_latest_by = "user_id"
        db_table = "student"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    code = models.CharField(_("教师号码"), unique=True, max_length=16)
    domain = models.TextField(_("擅长领域"), blank=True, default="")
    # class_location = models.CharField(
    #     _("上課大樓地址"), max_length=256, default="", blank=True
    # )
    # class_room = models.CharField(_("上課課室號碼"), max_length=256, default="", blank=True)
    office = models.CharField(_("办公室"), blank=True, default="", max_length=100)

    def __str__(self):
        return self.user.full_name

    class Meta:
        ordering = ["-code"]
        verbose_name = "教师"
        verbose_name_plural = verbose_name
        # get_latest_by = "id"
        db_table = "teacher"


class Course(models.Model):

    student = models.ManyToManyField(
        Student, related_name="courses", through="StudentCourse"
    )
    class_info = models.ForeignKey(
        ClassInfo,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name="courses",
    )

    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    title = models.CharField(_("课程标题"), max_length=32, default="")
    is_compulsory = models.BooleanField(_("是否必修课"), default=True)
    credit = models.DecimalField(_("学分数"), max_digits=5, decimal_places=2, default=0)

    student_limit = models.IntegerField(_("选修课学生人数上限"), blank=True, default=0)
    deadline = models.DateTimeField(_("选修课选课限期"), blank=True, null=True)
    endtime = models.DateTimeField(_("课程结束时间"), blank=True, null=True)

    outline = models.TextField(_("课程大纲"), default="")
    evaluation_standard = models.TextField(_("评分标准"), default="")
    book = models.TextField(_("使用书籍"), default="")

    # status = models.CharField(
    #     _("狀態"), choices=STATUS_CHOICES, default=STATUS_CHOICES[0][0], max_length=10
    # )
    # is_finish = models.BooleanField(_("是否完成课程"), default=False)
    created_at = models.DateTimeField(_("创建时间"), auto_now_add=True)
    modified_at = models.DateTimeField(_("修改时间"), auto_now=True)

    class Meta:
        db_table = "course"
        ordering = ["id"]


class CourseSchedule(models.Model):
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    course = models.ForeignKey(
        Course, on_delete=models.CASCADE, related_name="course_schedules"
    )
    week = models.CharField(_("上课周期"), max_length=16, choices=WEEK_CHOICES)
    is_separation = models.BooleanField(_("是否隔周上课"), default=False)
    address = models.CharField(_("上课地点"), max_length=256, default="")
    time_span = models.CharField(_("上课时段"), max_length=16, choices=TIME_CHOICES)

    def __str__(self):
        return "{class_location}({class_room})".format(
            class_location=self.teacher.class_location,
            class_room=self.teacher.class_room,
        )

    class Meta:
        # ordering = ["id", "week", "time_span"]
        ordering = ["id"]
        db_table = "course_schedule"


class StudentCourse(models.Model):

    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    student_grade1 = models.DecimalField(
        _("平时成绩"), max_digits=5, decimal_places=2, default=0
    )
    student_grade2 = models.DecimalField(
        _("期中成绩"), max_digits=5, decimal_places=2, default=0
    )
    student_grade3 = models.DecimalField(
        _("期末成绩"), max_digits=5, decimal_places=2, default=0
    )
    grade = models.DecimalField(_("总成绩"), max_digits=5, decimal_places=2, default=0)
    credit = models.DecimalField(_("获得学分数"), max_digits=5, decimal_places=2, default=0)
    comment = models.TextField(_("教师评语"), default="")
    student_comment = models.TextField(_("学生评语"), default="")

    grade_result = models.CharField(
        _("成绩结果"),
        max_length=10,
        choices=CREDIT_CHOICES,
        default=CREDIT_CHOICES[0][0],
    )

    class Meta:
        unique_together = ("student", "course")
        db_table = "student_course"
        ordering = ["course__id"]
