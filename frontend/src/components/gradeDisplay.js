import React, { useState, useEffect } from "react";
import GradeDistribution from "./gradeDistribution";

import axios from "axios";

const students = [
  {
    preferred_name: "Hermione",
    last_two_initials: "Gr",
    google_account_email: "herms@gmail.com",
    grades: {
      P1: { major: 88, minor: 99 },
      P2: { major: 99, minor: 100 },
      P3: { major: 99, minor: 100 },
    },
    semester_grade: 99,
  },
  {
    preferred_name: "Ron",
    last_two_initials: "We",
    google_account_email: "Ron@hogwarts.com",
    grades: {
      P1: { major: 82, minor: 15 },
      P2: { major: 88, minor: 56 },
      P3: { major: 60, minor: 89 },
    },
  },
  {
    preferred_name: "Harry",
    last_two_initials: "Po",
    google_account_email: "harry@hotdog.com",
    grades: {
      P1: { major: 85, minor: 99 },
      P2: { major: 88, minor: 89 },
      P3: { major: 90, minor: 79 },
    },
  },
];
function getLetterGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

function GradeDisplay() {
  // const [students, setStudents] = useState([]);
  const maxGradingPeriods = 3;
  function calculateSemesterGrade(grades) {
    let totalGrade = 0;
    let gradingPeriods = Object.keys(grades);

    gradingPeriods.forEach((period) => {
      const major = grades[period].major;
      const minor = grades[period].minor;

      totalGrade += major * 0.6 + minor * 0.4;
    });
    // Calculate average and round to one decimal
    const average = totalGrade / gradingPeriods.length;
    return Math.round(average * 10) / 10;
  }

  // useEffect(() => {
  //   axios
  //     .get("/api/student")
  //     .then((response) => {
  //       setStudents(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching student data:", error);
  //     });
  // }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-4xl w-full">
        <h1 className="text-xl mb-4 font-semibold text-gray-700">
          Students' Grades
        </h1>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th
                className="border border-gray-300 px-4 py-2 text-left"
                rowSpan="2"
              >
                Name
              </th>
              {[...Array(maxGradingPeriods)].map((_, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-4 py-2 text-left"
                  colSpan="2"
                >
                  P{i + 1}
                </th>
              ))}
              <th
                className="border border-gray-300 px-4 py-2 text-left"
                rowSpan="2"
              >
                Semester Grade
              </th>
            </tr>
            <tr>
              {[...Array(maxGradingPeriods)].map((_, i) => (
                <>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Major
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left">
                    Minor
                  </th>
                </>
              ))}
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {student.preferred_name} {student.last_two_initials}
                </td>
                {[...Array(maxGradingPeriods)].map((_, i) => {
                  const period = `P${i + 1}`;
                  const grades = student.grades[period];
                  return (
                    <>
                      <td
                        key={`major_${i}`}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {grades?.major
                          ? `${grades.major} (${getLetterGrade(grades.major)})`
                          : "-"}
                      </td>
                      <td
                        key={`minor_${i}`}
                        className="border border-gray-300 px-4 py-2"
                      >
                        {grades?.minor
                          ? `${grades.minor} (${getLetterGrade(grades.minor)})`
                          : "-"}
                      </td>
                    </>
                  );
                })}
                <td className="border border-gray-300 px-4 py-2">
                  {calculateSemesterGrade(student.grades)} (
                  {getLetterGrade(calculateSemesterGrade(student.grades))})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <GradeDistribution
        grades={students.map((student_data) => student_data["semester_grade"])}
      ></GradeDistribution>
    </div>
  );
}

export default GradeDisplay;
