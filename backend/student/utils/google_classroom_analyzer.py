import json
import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow

# # from django.core.exceptions import ObjectDoesNotExist
# from student.models import Course, Student, Grade, GradeCategory, ProgressReportPeriod
from datetime import datetime, date
from student.models import Course, Student, Grade, GradeCategory, ProgressReportPeriod


# Set up your client_secrets.json path (downloaded from Google Cloud Console)
CLIENT_SECRETS_FILE = "client_secret.json"

DETAILS = {"byClass": True, "period": 1, "student": "name", "grade_period": 2}

# Define the necessary scopes
SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.student-submissions.students.readonly",
    "https://www.googleapis.com/auth/classroom.rosters",
    "https://www.googleapis.com/auth/classroom.profile.emails",
]


class GoogleClassroomAnalyzer:
    def __init__(self):
        self.service = build("classroom", "v1", credentials=self.get_credentials())

    @staticmethod
    def get_credentials():
        # Check if credentials already exist
        if os.path.exists("token.json"):
            with open("token.json", "r") as token:
                return Credentials.from_authorized_user_file("token.json")

        # If not, we authenticate and store the token
        flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS_FILE, SCOPES)
        credentials = flow.run_local_server(port=0)
        with open("token.json", "w") as token:
            token.write(credentials.to_json())
        return credentials

    def get_courses(self):
        try:
            results = self.service.courses().list(pageSize=10).execute()
            courses = results.get("courses", [])
            return courses
        except Exception as e:
            # Here you can log the error or print it for debugging
            print(f"Error fetching courses")

    def get_assignments(self, course_id):
        try:
            assignments = (
                self.service.courses()
                .courseWork()
                .list(courseId=course_id)
                .execute()
                .get("courseWork", [])
            )
        except Exception as e:
            print(f"Failed fetching assignments: {e}")
            return

        return assignments

    def get_students(self, course_id):
        try:
            students = (
                self.service.courses()
                .students()
                .list(courseId=course_id)
                .execute()
                .get("students", [])
            )
        except Exception as e:
            print(f"Failed fetching students: {e}")
            return
        return students

    def get_assignment_scores(self, course_id, assignment_id):
        try:
            assignment_scores = (
                self.service.courses()
                .courseWork()
                .studentSubmissions()
                .list(
                    courseId=course_id,
                    courseWorkId=assignment_id,
                )
                .execute()
                .get("studentSubmissions", [])
            )
        except Exception as e:
            print(f"Failed fetching students: {e}")
            return
        return assignment_scores

    def get_data_from_courses(self):
        courses = self.get_courses()
        data = {}
        for course in courses[0:1]:
            data[course.get("id")] = Course(
                course.get("section"), self.get_student_data(course["id"])
            )
        return data

    def get_student_data(self, course_id):
        try:
            assignments = self.get_assignments(course_id)
            students = self.get_students(course_id)

            # Use a dictionary for faster lookups.
            student_profiles = {}

            for student in students:
                student_name = student["profile"]["name"]["fullName"]
                student_email = student["profile"].get("emailAddress", "no email")
                id = student["profile"].get("id")

                student_report, created = Student.objects.get_or_create(
                    name=student_name,
                    email=student_email,
                    id=id,
                )
                student_profiles[id] = student_report

            for assignment in assignments:
                max_points = assignment.get("maxPoints", None)
                if not max_points:
                    continue

                grade_category = assignment.get("gradeCategory", None)
                if grade_category is None:
                    continue

                title = assignment.get("title", "no title")

                submissions = self.get_assignment_scores(
                    course_id, assignment.get("id")
                )

                for submission in submissions:
                    score = submission.get("assignedGrade")
                    submitter_id = submission.get("userId")
                    student_report = student_profiles.get(submitter_id)

                    # Using unique attributes to get or create the Grade (for example title, student_report)
                    grade, created = Grade.objects.get_or_create(
                        assignment_name=title,
                        student_report=student_report,
                        defaults={"score": score, "possible_points": max_points},
                    )

                    if (
                        not created
                    ):  # If the grade already exists, update it with new data
                        grade.score = score
                        grade.possible_points = max_points
                        grade.save()

                    if grade_category and grade_category.get("name") == "Major":
                        student_report.major_grades.add(grade)
                    elif grade_category and grade_category.get("name") == "Minor":
                        student_report.minor_grades.add(grade)

            return student_profiles

        except Exception as e:
            print("Error:", e)

    # Function to determine the correct grading period for a given due date
    def get_grading_period(self, due_date_obj, periods):
        for period in periods:
            if period.start_date <= due_date_obj <= period.end_date:
                return period
        return None  # Return None or a default period if no match is found

    def sync_student_data(self, course_id, course_record):
        try:
            # Create or get the GradeCategory objects outside the loop
            major_category, _ = GradeCategory.objects.get_or_create(
                name="Major", defaults={"weight": 60.00}
            )
            minor_category, _ = GradeCategory.objects.get_or_create(
                name="Minor", defaults={"weight": 40.00}
            )
            not_categorized, _ = GradeCategory.objects.get_or_create(
                name="Not Categorized", defaults={"weight": 100.00}
            )

            assignments = self.get_assignments(course_id)
            students = self.get_students(course_id)

            student_profiles = {}
            for student in students:
                student_name = student["profile"]["name"]["givenName"]
                student_email = student["profile"].get("emailAddress", "no email")
                google_id = student["profile"].get("id")

                # Attempt to retrieve the student using the unique google_id
                student_obj, created = Student.objects.get_or_create(
                    google_id=google_id
                )

                # Update (or set for the first time) the other fields
                student_obj.name = student_name
                student_obj.email = student_email
                # Assuming google_id doesn't change; otherwise, also update it here

                # Save changes to the database
                student_obj.save()

                # Associate the student with the course
                student_obj.courses.add(course_record)

                student_profiles[google_id] = student_obj

            grading_periods = ProgressReportPeriod.objects.all()
            for assignment in assignments:
                max_points = assignment.get("maxPoints", None)
                if not max_points:
                    continue

                grade_category_name = assignment.get("gradeCategory", {}).get("name")
                due_date = assignment.get("dueDate")
                if due_date is None:
                    due_date = assignment.get("creationTime")
                due_date_obj = date(
                    due_date["year"], due_date["month"], due_date["day"]
                )
                progress_period = self.get_grading_period(due_date_obj, grading_periods)

                if grade_category_name == "Major":
                    grade_category_obj = major_category
                elif grade_category_name == "Minor":
                    grade_category_obj = minor_category
                else:
                    grade_category_obj = not_categorized

                title = assignment.get("title", "no title")
                submissions = self.get_assignment_scores(
                    course_id, assignment.get("id")
                )

                for submission in submissions:
                    score = submission.get("assignedGrade")
                    submitter_id = submission.get("userId")
                    student_obj = student_profiles.get(submitter_id)

                    grade, created = Grade.objects.get_or_create(
                        assignment_name=title,
                        student=student_obj,
                        defaults={"score": score, "possible_points": max_points},
                    )
                    if grade.progress_report_period != progress_period:
                        grade.progress_report_period = progress_period
                    if grade.grade_category != grade_category_obj:
                        grade.grade_category = grade_category_obj

                    if not created:
                        grade.score = score
                        grade.possible_points = max_points
                        grade.save()

            return student_profiles

        except Exception as e:
            print("Error:", e)

    def clean_duplicate_assignments(self):
        all_students = Student.objects.all()  # Get all student records

        for student in all_students:
            # Fetch all grades/assignments associated with the student
            student_grades = Grade.objects.filter(student=student)

            seen_titles = set()  # A set to keep track of unique titles
            for grade in student_grades:
                if grade.assignment_name in seen_titles:
                    # If the assignment title has been seen, this is a duplicate, so delete it
                    grade.delete()
                else:
                    # Otherwise, add this title to the set of seen titles
                    seen_titles.add(grade.assignment_name)

        print("Duplicate assignments have been cleaned up.")
