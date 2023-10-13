# from django.shortcuts import render
# from .models import Student


# # Create your views here.
# def student_list(request):
#     students = Student.objects.all()

#     return render(request, "student/student_list.html", {"student_list": students})
from django.shortcuts import render
from rest_framework import viewsets
from .serializers import StudentSerializer
from .models import Student

# Create your views here.

class StudentView(viewsets.ModelViewSet):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()