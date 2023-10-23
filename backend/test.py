data = [(0.0, 'W9 Quiz Notebook Check', 9.0), (None, 'W9 Do Now', 9.0), (None, 'W9D3 Growth and Decay Word Problems Practice', 9.0), (None, 'W9D2: Writing and Estimating Exponential Functions', 9.0), (0.0, 'W7 Do Now', 9.0), (2.0, 'W8 Do Now', 6.0), (0.0, 'W6D3: Domain and Range', 9.0), (0.0, 'W7D1: Domain and Range Practice', 9.0), (0.0, 'W7D2: Growth vs Decay', 9.0), (0.0, 'W7D3: Exponential Growth and Decay Vocabulary', 9.0), (0.0, 'W8D1: Fractions Review', 9.0), (0.0, 'W5D1: The Quotient Property of Exponents', 10.0), (0.0, 'W6D2: Domain and Range in Exponential Functions', 10.0), (10.0, 'The Power Property of Exponents', 10.0), (0.0, ' Applying the Properties of Exponents\n', 10.0), (0.0, 'W6D1 7.1 Graphing Exponents', 10.0)]
# Sorting the data based on the assignment title
data = sorted(data, key=lambda x: x[1])

print("+------+------------------------------------------------------------+")
print("|Grade | Possible Points | Assignment                                                 ")
print("+------+------------------------------------------------------------+")
for grade, assignment, points in data:
    grade_str = str(grade) if grade is not None else "-"
    points_str = str(points) if points is not None else "-"

    print(f"|{grade_str.center(6)} | {points_str.center(6)}| {assignment[:58].ljust(58)}")
print("+------+------------------------------------------------------------+")

