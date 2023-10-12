from django.shortcuts import render
from .models import Student


# Create your views here.
def student_list(request):
    students = Student.objects.all()

    return render(request, "student/student_list.html", {"student_list": students})
