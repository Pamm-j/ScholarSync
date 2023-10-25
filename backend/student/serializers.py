from rest_framework import serializers
from .models import Student, ProgressReportPeriod, Grade
from .utils.util import calculate_average


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'section', 'students']




class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    google_id = serializers.CharField()
    class Meta:
        model = Student
        fields = ['name', 'email', 'google_id']


class StudentGradeSerializer(serializers.ModelSerializer):
    major_average = serializers.SerializerMethodField()
    minor_average = serializers.SerializerMethodField()
    total_average = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    grade_period_p2 = ProgressReportPeriod.objects.get(name="P2")


    class Meta:
        model = Student
        fields = ('name', 'major_average', 'minor_average', 'total_average', 'section', 'email', 'section', 'google_id')  # Add other student fields if needed

    def get_major_average(self, obj):
        return calculate_average(obj, "Major", self.grade_period_p2)
        pass

    def get_minor_average(self, obj):
        return calculate_average(obj, "Minor", self.grade_period_p2)
        pass
    
    def get_total_average(self, obj):
        major_avg = self.get_major_average(obj)
        minor_avg = self.get_minor_average(obj)
        if major_avg is not None and minor_avg is not None:
            return (major_avg*0.6 + minor_avg*0.4)
        else:
            return 0
        
    def get_section(self, obj):
        """
        Returns the section of the first course associated with the student.
        """
        courses = obj.courses.all()
        if courses:
            return courses[0].section
        return None

class GradeSerializer(serializers.ModelSerializer):
    grade_category = serializers.CharField(source='grade_category.name')
    progress_report_period_name = serializers.SerializerMethodField()


    class Meta:
        model = Grade
        fields = ('assignment_name', 'score', 'possible_points', 'grade_category', 'progress_report_period_name')


    def get_progress_report_period_name(self, obj):
        if obj.progress_report_period:
            return obj.progress_report_period.name
        return None
class DetailedStudentSerializer(serializers.ModelSerializer):
    grades = GradeSerializer(many=True, read_only=True)
    
    class Meta:
        model = Student
        fields = ('name', 'email', 'google_id', 'grades')

    # def get_grades(self, obj):
    #     # This will fetch grades for all the available progress report periods for a student.
    #     grades = []
    #     for period in ProgressReportPeriod.objects.all():
    #         grade_for_period = obj.get_grade_for_period(period)
    #         if grade_for_period is not None:
    #             grades.append(grade_for_period)
    #     return grades

    # def get_semester_grade(self, obj):
    #     # Replace 'semester_name' with the desired semester name or find another way to get it
    #     semester = GradingPeriod.objects.get(name='Semester1')
    #     return obj.get_semester_grade(semester)

