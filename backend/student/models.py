from django.db import models
from django.conf import settings
from django.utils import timezone


class GoogleClassroomAssignmentGrade(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    # Course details for context
    course_id = models.CharField(max_length=200)
    course_name = models.CharField(max_length=200)

    # Assignment details
    assignment_id = models.CharField(max_length=200)  # Google Classroom's assignment ID
    assignment_title = models.CharField(max_length=200)
    assignment_description = models.TextField(blank=True, null=True)
    assignment_due_date = models.DateTimeField(blank=True, null=True)

    # Grade details
    grade = models.FloatField()  # For example, 85.5 for a grade of 85.5%
    max_points = models.FloatField()  # The max possible points for the assignment
    last_fetch_date = models.DateTimeField(
        default=timezone.now
    )  # Last time the data was fetched

    def __str__(self):
        return f"{self.assignment_title} - {self.grade}/{self.max_points}"


class GradeCategory(models.Model):
    name = models.CharField(max_length=255)  # e.g., "Major", "Minor"
    weight = models.DecimalField(max_digits=5, decimal_places=2)  # e.g., 60 for 60%

    def __str__(self):
        return f"{self.name} ({self.weight}%)"


class ProgressReportPeriod(models.Model):
    name = models.CharField(max_length=255)  # e.g., "P1", "P2"
    start_date = models.DateField()
    end_date = models.DateField()

    def __str__(self):
        return self.name


class GradingPeriod(models.Model):
    name = models.CharField(max_length=255)  # e.g., "Semester 1", "Semester 2"
    sections = models.ManyToManyField(
        ProgressReportPeriod
    )  # A grading period consists of multiple sections

    def __str__(self):
        return self.name


class Student(models.Model):
    preferred_name = models.CharField(max_length=255)
    last_two_initials = models.CharField(max_length=2)
    google_account_email = models.EmailField(unique=True)

    def __str__(self):
        return self.preferred_name

    def get_grade_for_period(self, period):
        categories = GradeCategory.objects.all()
        weighted_grades = 0
        total_weights = 0

        for category in categories:
            try:
                grade_obj = GradingAverage.objects.get(
                    student=self, section=period, category=category
                )
                weighted_grades += grade_obj.average_grade * category.weight
                total_weights += category.weight
            except GradingAverage.DoesNotExist:
                pass

        return weighted_grades / total_weights if total_weights != 0 else None

    def get_semester_grade(self, semester):
        # Fetch all the ProgressReportPeriods for the given semester
        periods = semester.sections.all()
        semester_grade = 0

        for period in periods:
            grade_for_period = self.get_grade_for_period(period)
            if grade_for_period:
                semester_grade += grade_for_period

        return semester_grade / len(periods) if periods else None


class GradingAverage(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    section = models.ForeignKey(ProgressReportPeriod, on_delete=models.CASCADE)
    category = models.ForeignKey(GradeCategory, on_delete=models.CASCADE)
    average_grade = models.DecimalField(max_digits=5, decimal_places=2)

    class Meta:
        unique_together = ["student", "section", "category"]

    def __str__(self):
        return f"{self.student.preferred_name} - {self.section.name} - {self.category.name} - {self.average_grade}%"
