from django.urls import path
from .views import StudentListCreateView, StudentRetrieveUpdateDestroyView, StudentGradeView

urlpatterns = [
    path('student_list/', StudentListCreateView.as_view(), name='student-list-create'),
    path('students/<int:pk>/', StudentRetrieveUpdateDestroyView.as_view(), name='student-retrieve-update-destroy'),
    path('student_grades/', StudentGradeView.as_view(), name='student-grades'),
]
