import json
import os
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

# Set up your client_secrets.json path (downloaded from Google Cloud Console)
CLIENT_SECRETS_FILE = "client_secret.json"

DETAILS = {"byClass": False, "period": 1, "student": "name"}

# Define the necessary scopes
SCOPES = [
    "https://www.googleapis.com/auth/classroom.courses.readonly",
    "https://www.googleapis.com/auth/classroom.rosters.readonly",
    "https://www.googleapis.com/auth/classroom.coursework.students",
    "https://www.googleapis.com/auth/classroom.student-submissions.students.readonly",
]


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


def get_student_average_by_category(service, course_id):
    try:
        # Fetch assignments (course work) for the specified course
        assignments = (
            service.courses()
            .courseWork()
            .list(courseId=course_id)
            .execute()
            .get("courseWork", [])
        )

        # Separate assignments into Major and Minor categories
        major_assignments = [
            a for a in assignments if a.get("gradeCategory", {}).get("name") == "Major"
        ]
        minor_assignments = [
            a for a in assignments if a.get("gradeCategory", {}).get("name") == "Minor"
        ]

        # Fetch students
        students = (
            service.courses()
            .students()
            .list(courseId=course_id)
            .execute()
            .get("students", [])
        )

        total_major_percent = 0
        total_minor_percent = 0

        for student in students:
            student_name = student["profile"]["name"]["fullName"]

            major_percents = []
            minor_percents = []

            for assignment in major_assignments:
                max_points = assignment.get(
                    "maxPoints", 100
                )  # Defaulting to 100 if maxPoints is not found

                submissions = (
                    service.courses()
                    .courseWork()
                    .studentSubmissions()
                    .list(
                        courseId=course_id,
                        courseWorkId=assignment["id"],
                        userId=student["userId"],
                    )
                    .execute()
                    .get("studentSubmissions", [])
                )

                for submission in submissions:
                    score = submission.get("assignedGrade")
                    if score is not None:
                        percent = (score / max_points) * 100
                        major_percents.append(percent)

            for assignment in minor_assignments:
                max_points = assignment.get(
                    "maxPoints", 100
                )  # Defaulting to 100 if maxPoints is not found

                submissions = (
                    service.courses()
                    .courseWork()
                    .studentSubmissions()
                    .list(
                        courseId=course_id,
                        courseWorkId=assignment["id"],
                        userId=student["userId"],
                    )
                    .execute()
                    .get("studentSubmissions", [])
                )

                for submission in submissions:
                    score = submission.get("assignedGrade")
                    if score is not None:
                        percent = (score / max_points) * 100
                        minor_percents.append(percent)

            major_average_percent = (
                sum(major_percents) / len(major_percents) if major_percents else 0
            )
            minor_average_percent = (
                sum(minor_percents) / len(minor_percents) if minor_percents else 0
            )

            total_major_percent += major_average_percent
            total_minor_percent += minor_average_percent

            if DETAILS.get("byClass", True) is True:
                print(f"{student_name}:")
                print(f"  - Major Average Percent: {major_average_percent:.2f}%")
                print(f"  - Minor Average Percent: {minor_average_percent:.2f}%")

        class_major_avg = total_major_percent / len(students) if students else 0
        class_minor_avg = total_minor_percent / len(students) if students else 0

        print("\nClass Averages:")
        print(f"  - Major Average Percent: {class_major_avg:.2f}%")
        print(f"  - Minor Average Percent: {class_minor_avg:.2f}%")

    except Exception as e:
        print("Error:", e)


def list_assignments(service, course_id):
    try:
        # Fetch assignments (course work) for the specified course
        assignments = (
            service.courses()
            .courseWork()
            .list(courseId=course_id)
            .execute()
            .get("courseWork", [])
        )
        for assignment in assignments:
            print(json.dumps(assignment, indent=4))
    except Exception as e:
        print(f"Error occurred: {e}")


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
        get_student_average_by_category(service, course_id)
    else:
        for course in courses:
            print("Course:", course["name"], course.get("section", "no Section Listed"))
            course_id = course["id"]
            get_student_average_by_category(service, course_id)
            print("-------------------")


if __name__ == "__main__":
    main()
