from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import admin_views, teacher_views, views


router = routers.DefaultRouter()
router.register(r"user", admin_views.UserViewSet)
router.register(r"teacher", admin_views.TeacherViewSet)
router.register(r"student", admin_views.StudentViewSet)
router.register(r"major", admin_views.MajorViewSet)
router.register(r"class", admin_views.ClassInfoViewSet)
router.register(r"course", admin_views.CourseViewSet)
router.register(r"course-schedule", admin_views.CourseScheduleViewSet)
router.register(r"student-course", admin_views.StudentCourseViewSet)

teacher_router = routers.DefaultRouter()
teacher_router.register(r"class", teacher_views.ClassInfoViewSet)
teacher_router.register(r"course", teacher_views.CourseViewSet)
teacher_router.register(r"course-schedule", teacher_views.CourseScheduleViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("t/", include(teacher_router.urls)),
    path(
        "password/<int:pk>/", admin_views.PasswordView.as_view(), name="change_password"
    ),
    path(
        "setting/schedule/",
        views.ScheduleSettingView.as_view(),
        name="setting_schedule",
    ),
    path("logout/", admin_views.logout, name="logout"),
]
