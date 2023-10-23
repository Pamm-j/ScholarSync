from django.db import models
from django.conf import settings
from django.utils import timezone


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


class SemesterGrade(models.Model):
    name = models.CharField(max_length=255)  # e.g., "Semester 1", "Semester 2"
    sections = models.ManyToManyField(
        ProgressReportPeriod
    )

    def __str__(self):
        return self.name
   

class Course(models.Model):
    section = models.CharField(max_length=255)
    students = models.ManyToManyField('Student', related_name='enrollments')
    google_id = models.CharField(max_length=255, primary_key=True, unique=True, db_index=True)

class Grade(models.Model):
    score = models.FloatField(null=True, blank=True)  # Assuming score can be a floating point number.
    possible_points = models.FloatField(null=True, blank=True)
    assignment_name = models.CharField(max_length=255)
    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name="grades")
    grade_category = models.ForeignKey('GradeCategory', on_delete=models.SET_NULL, null=True, related_name="grades")  # Associating Grade with GradeCategory
    progress_report_period = models.ForeignKey('ProgressReportPeriod', on_delete=models.SET_NULL, null=True, related_name="grades")
    

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

class Student(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    google_id = models.CharField(max_length=255, primary_key=True, unique=True, db_index=True)
    courses = models.ManyToManyField(Course, related_name='enrolled_students')

