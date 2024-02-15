from rest_framework import serializers
from .models import Student, ProgressReportPeriod, Grade, GradeCategory
from .utils.util import calculate_average
from datetime import date


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

class StudentScoreSerializer(serializers.ModelSerializer):
    p1score = serializers.SerializerMethodField()
    p2score = serializers.SerializerMethodField()
    p3score = serializers.SerializerMethodField()
    p4score = serializers.SerializerMethodField()
    p5score = serializers.SerializerMethodField()
    p6score = serializers.SerializerMethodField()
    s1 = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    google_id = serializers.CharField()

    class Meta:
        model = Student
        fields = ('name', 'email', 'p1score', 'p2score', 'p3score','p4score','p5score','p6score', "google_id", "section", "s1")

    def get_p1score(self, obj):
        # Implement the logic to calculate or fetch p1score
        return calculate_average(obj, "Not Categorized", "P1")

    def get_p2score(self, obj):
        """
        Calculate the p2score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p2score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", "P2")

        # Calculate average for minor grades
        minor_average =  calculate_average(obj, "Minor", "P2")

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            # Assuming 60% weight for major and 40% for minor
            effort = (major_average * 0.6) + (minor_average * 0.4)
            mastery = (major_average * 0.8) + (minor_average * 0.2)
            if mastery > effort:
                return mastery
            else:
                return effort
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



    def get_p3score(self, obj):
        """
        Calculate the p2score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p2score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", "P3")

        # Calculate average for minor grades
        minor_average =  calculate_average(obj, "Minor", "P3")

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            # Assuming 60% weight for major and 40% for minor
            return (major_average * 0.6) + (minor_average * 0.4)
        else:
            return 0

    def get_p4score(self, obj):
        """
        Calculate the p4score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p4score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", "P4")

        # Calculate average for minor grades
        minor_average =  calculate_average(obj, "Minor", "P4")

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            # Assuming 60% weight for major and 40% for minor
            return (major_average * 0.6) + (minor_average * 0.4)
        else:
            return 0

    def get_p5score(self, obj):
        """
        Calculate the p5score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p4score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", "P5")

        # Calculate average for minor grades
        minor_average =  calculate_average(obj, "Minor", "P5")

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            # Assuming 60% weight for major and 40% for minor
            return (major_average * 0.6) + (minor_average * 0.4)
        else:
            return 0
    def get_p6score(self, obj):
        """
        Calculate the p6score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p4score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", "P6")

        # Calculate average for minor grades
        minor_average =  calculate_average(obj, "Minor", "P6")

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            # Assuming 60% weight for major and 40% for minor
            return (major_average * 0.6) + (minor_average * 0.4)
        else:
            return 0
        
    def get_s1(self, obj):
        """
        Calculate the p2score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p2score as a float.
        """
        return (self.get_p1score(obj) + self.get_p2score(obj) + self.get_p3score(obj))/3
