from django.contrib import admin
from .models import GoogleClassroomAssignmentGrade, ProgressReportPeriod, GradingAverage, GradingPeriod, Student, GradeCategory, Grade, Course, StudentReport

admin.site.register(GoogleClassroomAssignmentGrade)
admin.site.register(ProgressReportPeriod)
admin.site.register(GradingPeriod)
admin.site.register(Student)
admin.site.register(GradingAverage)
admin.site.register(GradeCategory)
admin.site.register(StudentReport)
admin.site.register(Course)
admin.site.register(Grade)