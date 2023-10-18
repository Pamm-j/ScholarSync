import json
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

from concurrent.futures import ThreadPoolExecutor
from googleapiclient.errors import HttpError


# Set up your client_secrets.json path (downloaded from Google Cloud Console)
CLIENT_SECRETS_FILE = "client_secret.json"

DETAILS = {"byClass": True, "period": 4, "student": "name"}

# Define the necessary scopes
SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.student-submissions.students.readonly",
]

class Grade:
    """Student grades used to represent a google classroom grade"""
    def __init__(self, score, possible_points):
        self.score = score
        self.possible_points = possible_points

    def get_letter_grade(self):
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
        return self.get_letter_grade()
    


class StudentReport:
    def __init__(self, name, email):
        self.name = name
        self.email = email
        self.major_grades = []
        self.minor_grades = []

    def add_major_grade(self, grade):
        self.major_grades.append(grade)

    def add_minor_grade(self, grade):
        self.minor_grades.append(grade)

    def to_dict(self):
        return {
            "student_name": self.name,
            "student_email": self.email,
            "major_grades": [str(grade) for grade in self.major_grades],
            "minor_grades": [str(grade) for grade in self.minor_grades]
        }


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


def fetch_submissions_for_assignment(service, course_id, assignment, student_report):
    try:
        max_points = assignment.get("maxPoints", 100)
        submissions = (
            service.courses()
            .courseWork()
            .studentSubmissions()
            .list(courseId=course_id, courseWorkId=assignment["id"], userId=student_report.email)
            .execute()
            .get("studentSubmissions", [])
        )

        for submission in submissions:
            score = submission.get("assignedGrade")
            if score is not None:
                grade = Grade(score, max_points)
                if assignment.get("gradeCategory", {}).get("name") == "Major":
                    student_report.add_major_grade(grade)
                else:
                    student_report.add_minor_grade(grade)
    except Exception as e:
        # Here you can log the error or print it for debugging
        print(f"Error fetching submissions for assignment {assignment['id']}: {str(e)}")

def get_student_average_by_category(service, course_id):
    # ... [fetching assignments and separating them] ...
    try: 
        assignments = (
            service.courses()
            .courseWork()
            .list(courseId=course_id)
            .execute()
            .get("courseWork", [])
        )
        
        students = (
            service.courses()
            .students()
            .list(courseId=course_id)
            .execute()
            .get("students", [])
        )

        reports = []

        with ThreadPoolExecutor() as executor:
            for student in students:
                student_name = student["profile"]["name"]["fullName"]
                student_email = student["profile"].get("emailAddress", "none")

                student_report = StudentReport(student_name, student_email)
                
                futures = [
                    executor.submit(fetch_submissions_for_assignment, service, course_id, assignment, student_report)
                    for assignment in assignments
                ]

                # Ensure all threads for the current student are completed
                for future in futures:
                    future.result()

                reports.append(student_report.to_dict())

        return reports
    except Exception as e:
        print(f"We failed somewhere")

def main():
    credentials = get_credentials()

    # Build the Classroom API service object
    service = build("classroom", "v1", credentials=credentials)

    # Get the list of courses
    results = service.courses().list(pageSize=10).execute()
    courses = results.get("courses", [])

    if not courses:
        print("No courses found.")
        return

    if DETAILS.get("byClass", True) is True:
        # To test 1 course
        course = courses[4 - DETAILS.get("period", 0)]
        course_id = course["id"]
        print(get_student_average_by_category(service, course_id))
    else:
        for course in courses:
            print("Course:", course["name"], course.get("section", "no Section Listed"))
            course_id = course["id"]
            print(get_student_average_by_category(service, course_id))
            print("-------------------")


if __name__ == "__main__":
    main()
