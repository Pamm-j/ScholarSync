from django.urls import path
from .views import (
    StudentListCreateView,
    StudentScoreView,
    StudentRetrieveUpdateDestroyView,
    DetailedStudentView,
)
from . import views

urlpatterns = [
    path("student_list/", StudentListCreateView.as_view(), name="student-list-create"),
    path(
        "students/<int:pk>/",
        StudentRetrieveUpdateDestroyView.as_view(),
        name="student-retrieve-update-destroy",
    ),
    path("student_scores/", StudentScoreView.as_view(), name="student-scores"),
    path(
        "student/<str:google_id>/",
        DetailedStudentView.as_view(),
        name="student-details",
    ),
]
