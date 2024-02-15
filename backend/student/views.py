from rest_framework import generics
from .models import Student
from .serializers import StudentSerializer, StudentScoreSerializer, DetailedStudentSerializer

# List and Create view for Student
class StudentListCreateView(generics.ListCreateAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

# Retrieve, Update, and Destroy view for Student
class StudentRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer

# List view for Student Grades
class StudentScoreView(generics.ListAPIView):
    queryset = Student.objects.all()
    serializer_class = StudentScoreSerializer

class DetailedStudentView(generics.RetrieveAPIView):
    queryset = Student.objects.all()
    serializer_class = DetailedStudentSerializer
    lookup_field = 'google_id'