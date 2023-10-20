# myapp/management/commands/sync_google_classroom.py
from django.core.management.base import BaseCommand
from student.utils.google_classroom_analyzer import GoogleClassroomAnalyzer
from student.models import Course, StudentReport, Grade

DETAILS = {"byClass": True, "period": 1, "student": "name"}

class Command(BaseCommand):
    help = 'Synchronize data from Google Classroom'

    def handle(self, *args, **kwargs):
        classroom_analyzer = GoogleClassroomAnalyzer()
        courses = classroom_analyzer.get_courses()
        
        # The logic from your main() function
        if DETAILS.get("byClass", True) is True:
            course = courses[4 - DETAILS.get("period", 0)]
            course_id = course["id"]
            student_data = classroom_analyzer.get_student_data(course_id)
            # for student_profile in student_data.values():
                # # Create or update records in the database
                # # Example:
                # student_report_obj, created = StudentReport.objects.get_or_create(
                #     name=student_profile.name,
                #     email=student_profile.email,
                #     id=student_profile.id,
                # )
                # # Add any other required logic to sync with the database
        else:
            course_data = classroom_analyzer.get_data_from_courses()
            for course_obj in course_data.values():
                # Create or update Course in the database
                # Example:
                course_record, created = Course.objects.get_or_create(
                    section=course_obj.section,
                    # any other fields...
                )
                # Further logic to sync student reports for this course...

        self.stdout.write(self.style.SUCCESS('Successfully synchronized data from Google Classroom'))