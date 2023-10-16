from rest_framework import serializers
from .models import Student, ProgressReportPeriod, GradingPeriod

class StudentSerializer(serializers.ModelSerializer):
    semester_grade = serializers.SerializerMethodField()
    grades = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['preferred_name', 'last_two_initials', 'google_account_email', 'grades', 'semester_grade']

    def get_grades(self, obj):
        # This will fetch grades for all the available progress report periods for a student.
        grades = []
        for period in ProgressReportPeriod.objects.all():
            grade_for_period = obj.get_grade_for_period(period)
            if grade_for_period is not None:
                grades.append(grade_for_period)
        return grades

    def get_semester_grade(self, obj):
        # Replace 'semester_name' with the desired semester name or find another way to get it
        semester = GradingPeriod.objects.get(name='Semester1')
        return obj.get_semester_grade(semester)
