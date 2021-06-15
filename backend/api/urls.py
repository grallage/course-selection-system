from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from .views import views, teacher_views


router = routers.DefaultRouter()
router.register(r"user", views.UserViewSet)
router.register(r"teacher", views.TeacherViewSet)
router.register(r"student", views.StudentViewSet)
router.register(r"major", views.MajorViewSet)
router.register(r"class", views.ClassInfoViewSet)
router.register(r"course", views.CourseViewSet)
router.register(r"course-schedule", views.CourseScheduleViewSet)
router.register(r"student-course", views.StudentCourseViewSet)

teacher_router = routers.DefaultRouter()
teacher_router.register(r"class", teacher_views.ClassInfoViewSet)
teacher_router.register(r"course", teacher_views.CourseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("t/", include(teacher_router.urls)),
    path("password/<int:pk>/", views.PasswordView.as_view(), name="change_password"),
    path("logout/", views.logout, name="logout"),
]
