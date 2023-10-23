from django.contrib import admin
from .models import ProgressReportPeriod, Student, GradeCategory, Grade, Course

admin.site.register(ProgressReportPeriod)
admin.site.register(Student)
admin.site.register(GradeCategory)
admin.site.register(Course)
admin.site.register(Grade)