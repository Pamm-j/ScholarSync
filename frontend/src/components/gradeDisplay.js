import React, { useState, useEffect } from "react";
import GradeDistribution from "./gradeDistribution";

import axios from "axios";

function getLetterGrade(percentage) {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

function GradeDisplay() {
  // Determine the maximum number of grading periods for any student
  const [students, setStudents] = useState([]);
  const maxGradingPeriods = 3;

  useEffect(() => {
    // Assuming your backend endpoint is '/api/students'
    axios
      .get("/api/student")
      .then((response) => {
        setStudents(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching student data:", error);
      });
  }, []); // The empty dependency array ensures this useEffect runs only once when the component mounts.

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-4xl w-full">
        <h1 className="text-xl mb-4 font-semibold text-gray-700">
          Students' Grades
        </h1>
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              {[...Array(maxGradingPeriods)].map((_, i) => (
                <th
                  key={i}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  P{i + 1}
                </th>
              ))}
              <th className="border border-gray-300 px-4 py-2 text-left">
                Semester Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td className="border border-gray-300 px-4 py-2">
                  {student.preferred_name} {student.last_two_initials}
                </td>
                {[...Array(maxGradingPeriods)].map((_, i) => (
                  <td key={i} className="border border-gray-300 px-4 py-2">
                    {student.grades[i]
                      ? `${student.grades[i]} (${getLetterGrade(
                          student.grades[i]
                        )})`
                      : "-"}
                  </td>
                ))}
                <td className="border border-gray-300 px-4 py-2">
                  {student.semester_grade} (
                  {getLetterGrade(student.semester_grade)})
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
