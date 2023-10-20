import json
import os
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from django.core.exceptions import ObjectDoesNotExist
from student.models import Course, StudentReport, Grade


# Set up your client_secrets.json path (downloaded from Google Cloud Console)
CLIENT_SECRETS_FILE = "client_secret.json"

DETAILS = {"byClass": True, "period": 1, "student": "name"}

# Define the necessary scopes
SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.student-submissions.students.readonly",
    'https://www.googleapis.com/auth/classroom.rosters',
    'https://www.googleapis.com/auth/classroom.profile.emails'
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
            assignment_scores = self.service.courses().courseWork().studentSubmissions().list(
                    courseId=course_id,
                    courseWorkId=assignment_id,
                ).execute().get("studentSubmissions", [])
        except Exception as e:
            print(f"Failed fetching students: {e}")
            return
        return assignment_scores

   
    def get_data_from_courses(self):
        courses = self.get_courses()
        data = {}
        for course in courses[0:1]:
            data[course.get("id")] = Course(course.get("section"), self.get_student_data(course['id']))
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
                student_id = student['profile'].get("id")
                
                student_report, created = StudentReport.objects.get_or_create(
                    name=student_name,
                    email=student_email,
                    student_id=student_id,
                )
                student_profiles[student_id] = student_report
                
            for assignment in assignments:
                max_points = assignment.get("maxPoints", None)
                if not max_points:
                    continue

                grade_category = assignment.get("gradeCategory", None)
                if grade_category is None:
                    continue

                title = assignment.get('title', "no title")
                
                submissions = self.get_assignment_scores(course_id, assignment.get('id'))

                for submission in submissions:
                    score = submission.get("assignedGrade")
                    submitter_id = submission.get('userId')
                    student_report = student_profiles.get(submitter_id)

                    # Using unique attributes to get or create the Grade (for example title, student_report)
                    grade, created = Grade.objects.get_or_create(
                        title=title, 
                        student_report=student_report,
                        defaults={'score': score, 'possible_points': max_points}  
                    )

                    if not created:  # If the grade already exists, update it with new data
                        grade.score = score
                        grade.possible_points = max_points
                        grade.save()

                    if grade_category and grade_category.get('name') == "Major":
                        student_report.major_grades.add(grade)
                    elif grade_category and grade_category.get('name') == "Minor":
                        student_report.minor_grades.add(grade)

            return student_profiles

        except Exception as e:
            print("Error:", e)