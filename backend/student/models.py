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




class Course(models.Model):
    section = models.CharField(max_length=255)

    def average_of_student_category_averages(self):
        """Prints the average of all student category averages."""
        total_major_averages = 0
        total_minor_averages = 0
        total_students = 0

        # Since student_reports is not a field in Course, we can assume that there's a related ForeignKey field in StudentReport.
        for student_report in self.studentreport_set.all():
            major_avg = student_report.get_average_major_grade()
            minor_avg = student_report.get_average_minor_grade()

            if major_avg is not None:
                total_major_averages += major_avg
            if minor_avg is not None:
                total_minor_averages += minor_avg

            total_students += 1

        average_major = total_major_averages / total_students if total_students != 0 else 0
        average_minor = total_minor_averages / total_students if total_students != 0 else 0

        # Convert the averages to percentages and round to 1 decimal
        average_major_percent = round(average_major * 100, 1)
        average_minor_percent = round(average_minor * 100, 1)

        print(f"Overall Average Major Grade: {average_major_percent}%")
        print(f"Overall Average Minor Grade: {average_minor_percent}%")


class Grade(models.Model):
    score = models.FloatField(null=True, blank=True)  # Assuming score can be a floating point number.
    possible_points = models.FloatField(null=True, blank=True)
    assignment_name = models.CharField(max_length=255)

    @property
    def letter_grade(self):
        if not self.score or not self.possible_points:
            return None
        percent = self.score / self.possible_points
        if percent >= 0.9:
            return 'A'
        if percent >= 0.8:
            return 'B'
        if percent >= 0.7:
            return 'C'
        if percent >= 0.6:
            return 'D'
        return 'F'
    
    def __str__(self):
        return self.letter_grade or ''


class StudentReport(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    id = models.AutoField(primary_key=True)  # Django by default uses id as primary key, but added for clarity.
    major_grades = models.ManyToManyField(Grade, related_name='major_students')
    minor_grades = models.ManyToManyField(Grade, related_name='minor_students')

    def get_average_for_grades(self, grades):
        valid_grades = [(grade.score, grade.possible_points) for grade in grades 
                        if grade.score is not None and grade.possible_points is not None]

        if not valid_grades:
            return None

        total_score = sum([score for score, _ in valid_grades])
        total_possible = sum([points for _, points in valid_grades])

        return total_score / total_possible

    def get_average_major_grade(self):
        return self.get_average_for_grades(self.major_grades.all())

    def get_average_minor_grade(self):
        return self.get_average_for_grades(self.minor_grades.all())

    def print_grade_averages(self):
        major_avg = self.get_average_major_grade()
        minor_avg = self.get_average_minor_grade()

        major_avg_percent = round(major_avg * 100, 1) if major_avg is not None else "N/A"
        minor_avg_percent = round(minor_avg * 100, 1) if minor_avg is not None else "N/A"

        print(f"Avg Major Grade {major_avg_percent}% | Avg Minor Grade {minor_avg_percent}% for {self.name}")

    def __str__(self):
        return self.name
