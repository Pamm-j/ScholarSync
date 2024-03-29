from rest_framework import serializers
from .models import Student, ProgressReportPeriod, Grade, GradeCategory
from .utils.util import calculate_average
from datetime import date


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "section", "students"]


class StudentSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    google_id = serializers.CharField()

    class Meta:
        model = Student
        fields = ["name", "email", "google_id"]


class GradeSerializer(serializers.ModelSerializer):
    grade_category_name = serializers.SerializerMethodField()
    progress_report_period_name = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = (
            "assignment_name",
            "score",
            "possible_points",
            "grade_category_name",
            "progress_report_period_name",
        )

    def get_grade_category_name(self, obj):
        return obj.grade_category.name if obj.grade_category else None

    def get_progress_report_period_name(self, obj):
        if obj.progress_report_period:
            return obj.progress_report_period.name
        return None


class StudentScoreSerializer(serializers.ModelSerializer):
    p1score = serializers.SerializerMethodField()
    p2score = serializers.SerializerMethodField()
    p3score = serializers.SerializerMethodField()
    p4score = serializers.SerializerMethodField()
    p5score = serializers.SerializerMethodField()
    p6score = serializers.SerializerMethodField()
    s1 = serializers.SerializerMethodField()
    s2 = serializers.SerializerMethodField()
    section = serializers.SerializerMethodField()
    google_id = serializers.CharField()

    class Meta:
        model = Student
        fields = (
            "name",
            "email",
            "p1score",
            "p2score",
            "p3score",
            "p4score",
            "p5score",
            "p6score",
            "google_id",
            "section",
            "s1",
            "s2",
        )

    def get_score(self, obj, period):
        """
        Generic method to calculate scores for a given period.

        :param obj: The student object.
        :param period: The period for which to calculate the score.
        :return: The calculated score as a float.
        """

        # Calculate average for major grades
        major_average = calculate_average(obj, "Major", period)

        # Calculate average for minor grades
        minor_average = calculate_average(obj, "Minor", period)

        # Calculate weighted average
        if major_average is not None and minor_average is not None:
            return (major_average * 0.6) + (minor_average * 0.4)
        else:
            return 0

    def get_p1score(self, obj):
        # Implement the logic to calculate or fetch p1score
        return calculate_average(obj, "Not Categorized", "P1")

    def get_section(self, obj):
        """
        Returns the section of the first course associated with the student.
        """
        courses = obj.courses.all()
        if courses:
            return courses[0].section
        return None

    def get_p2score(self, obj):
        return self.get_score(obj, "P2")

    def get_p3score(self, obj):
        return self.get_score(obj, "P3")

    def get_p4score(self, obj):
        return self.get_score(obj, "P4")

    def get_p5score(self, obj):
        return self.get_score(obj, "P5")

    def get_p6score(self, obj):
        return self.get_score(obj, "P6")

    def get_s1(self, obj):
        """
        Calculate the p2score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p2score as a float.
        """
        return (
            self.get_p1score(obj) + self.get_p2score(obj) + self.get_p3score(obj)
        ) / 3

    def get_s2(self, obj):
        """
        Calculate the p2score for the student, considering major and minor grades within the P2 period dates.

        :param obj: The student object.
        :return: The p2score as a float.
        """
        return (
            self.get_p4score(obj) + self.get_p5score(obj) + self.get_p6score(obj)
        ) / 3


class DetailedStudentSerializer(StudentScoreSerializer):
    p1_grades = serializers.SerializerMethodField()
    p2_grades = serializers.SerializerMethodField()
    p3_grades = serializers.SerializerMethodField()
    p4_grades = serializers.SerializerMethodField()
    p5_grades = serializers.SerializerMethodField()
    p6_grades = serializers.SerializerMethodField()

    class Meta(StudentScoreSerializer.Meta):
        fields = StudentScoreSerializer.Meta.fields + (
            "p1_grades",
            "p2_grades",
            "p3_grades",
            "p4_grades",
            "p5_grades",
            "p6_grades",
        )

    def get_grades_for_period(self, obj, period_name):
        # Generalized method to filter grades for a given period
        filtered_grades = obj.grades.filter(progress_report_period__name=period_name)
        return GradeSerializer(filtered_grades, many=True).data

    def get_p1_grades(self, obj):
        return self.get_grades_for_period(obj, "P1")

    def get_p2_grades(self, obj):
        return self.get_grades_for_period(obj, "P2")

    def get_p3_grades(self, obj):
        return self.get_grades_for_period(obj, "P3")

    def get_p4_grades(self, obj):
        return self.get_grades_for_period(obj, "P4")

    def get_p5_grades(self, obj):
        return self.get_grades_for_period(obj, "P5")

    def get_p6_grades(self, obj):
        return self.get_grades_for_period(obj, "P6")
