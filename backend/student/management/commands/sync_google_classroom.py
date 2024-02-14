from django.core.management.base import BaseCommand
from student.utils.google_classroom_analyzer import GoogleClassroomAnalyzer
from student.models import Course
from datetime import datetime

debug = False
class Command(BaseCommand):
    help = 'Synchronize data from Google Classroom'
    def add_arguments(self, parser):
        # Optional argument for section number
        parser.add_argument(
            '--section',
            type=str,
            help='Section number of the Google Classroom course to synchronize'
        )
    

    def handle(self, *args, **kwargs):
        classroom_analyzer = GoogleClassroomAnalyzer()
        if debug is True:
            classroom_analyzer.clean_duplicate_assignments()
            return
        self.stdout.write("Starting the synchronization process...")

        section = kwargs.get('section')
        try:
            if section:
                # Synchronize a specific section
                courses = [course for course in classroom_analyzer.get_courses() if course["section"] == section + "°"]
                if not courses:
                    self.stdout.write(self.style.WARNING(f"No courses found with section number: {section}"))
                    return
            else:
                courses = classroom_analyzer.get_courses()
            if not courses:
                self.stdout.write(self.style.WARNING("No courses found in Google Classroom."))
            else:
                self.stdout.write(f"Found {len(courses)} courses. Synchronizing...")

            for course_obj in courses:
                course_id = course_obj["id"]
                course_record, created = Course.objects.get_or_create(
                    section=course_obj["section"],
                    google_id=course_id
                )

                action = "Creating" if created else "Updating"
                self.stdout.write(f"{action} course in database: {course_obj['section']} (ID: {course_id})")

                classroom_analyzer.sync_student_data(course_id, course_record)
                self.stdout.write(f"Synchronized data for course: {course_obj['section']} (ID: {course_id})")
                
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            self.stdout.write(self.style.SUCCESS(f'Successfully synchronized data from Google Classroom {current_time}'))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"An error occurred: {e}"))
