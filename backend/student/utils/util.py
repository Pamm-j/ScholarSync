from ..models import Grade, GradeCategory, ProgressReportPeriod, Student

def calculate_average(student, grade_category_name, grade_period_name):
    # Fetch the GradeCategory object by name, or use "Not Categorized" as default
    grade_period = ProgressReportPeriod.objects.get(name=grade_period_name)
    grade_category_obj = GradeCategory.objects.filter(name=grade_category_name).first()
    if not grade_category_obj:
        grade_category_obj, _ = GradeCategory.objects.get_or_create(name="Not Categorized", defaults={'weight': 100.00})

    # Filter grades based on student, grade_category, and grade_period
    grades = Grade.objects.filter(student=student, grade_category=grade_category_obj, progress_report_period=grade_period)

    if not grades.exists():
        return None
    

    grades_with_scores = [grade for grade in grades if grade.score is not None and grade.possible_points is not None]
    total_score = sum([grade.score for grade in grades_with_scores])
    total_possible = sum([grade.possible_points for grade in grades_with_scores])

    if total_possible == 0:
        return 0

    return (total_score / total_possible) * 100


