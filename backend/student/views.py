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


    # views.py
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .utils.google_classroom_analyzer import GoogleClassroomAnalyzer
from .serializers import StudentReportSerializer

@api_view(['GET'])
def get_student_data(request):
    classroom_analyzer = GoogleClassroomAnalyzer()
    courses = classroom_analyzer.get_courses()
    # data = {}
    # for course in courses:
    data = classroom_analyzer.get_student_data(courses[0]['id'])

    serialized_data = StudentReportSerializer(data.values(), many=True).data
    
    return Response(serialized_data)