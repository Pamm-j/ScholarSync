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
    last_fetch_date = models.DateTimeField(default=timezone.now)  # Last time the data was fetched
    
    def __str__(self):
        return f"{self.assignment_title} - {self.grade}/{self.max_points}"
