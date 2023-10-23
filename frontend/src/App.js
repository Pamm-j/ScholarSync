import React, { useState } from "react";
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [showGrades, setShowGrades] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeFilter, setGradeFilter] = useState(null);

  const handleButtonClick = async () => {
    try {
      const response = await axios.get("/api/student_grades");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleToggleGrades = () => {
    setShowGrades(!showGrades);
  };

  const handleNameClick = (name) => {
    setSelectedStudent(selectedStudent === name ? null : name);
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 90) return 'A';
    else if (percentage >= 80) return 'B';
    else if (percentage >= 70) return 'C';
    else if (percentage >= 60) return 'D';
    else return 'F';
  };

  const handleGradeFilter = (grade) => {
    if (grade === gradeFilter) {
      setGradeFilter(null);
    } else {
      setGradeFilter(grade);
    }
  };

  const filteredStudents = gradeFilter 
    ? students.filter(student => getLetterGrade(student.total_average) === gradeFilter)
    : students;

  return (
    <div className="h-screen w-full bg-teal-500 flex flex-col items-center justify-center p-4">
      <div className="mb-2 flex">
        <button
          onClick={handleButtonClick}
          className="bg-pink-500 text-white py-1 px-3 rounded-lg focus:outline-none hover:bg-pink-600 active:bg-pink-700 mr-2"
        >
          Fetch Student Data
        </button>
        {['A', 'B', 'C', 'D', 'F'].map(grade => (
          <button
            key={grade}
            onClick={() => handleGradeFilter(grade)}
            className={`bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300 active:bg-gray-400 ${gradeFilter === grade ? 'bg-gray-400' : ''} mr-2`}
          >
            {grade}
          </button>
        ))}
      </div>
      
      <div className="overflow-auto">
        <table className="table-fixed w-full text-sm bg-white rounded-lg">
          <thead className="bg-gray-300">
            <tr>
              <th className="w-1/4 p-2">Name</th>
              {showGrades && <th className="w-1/4 p-2">Major Avg</th>}
              {showGrades && <th className="w-1/4 p-2">Minor Avg</th>}
              {showGrades && <th className="w-1/4 p-2">Total Avg</th>}
              {showGrades && <th className="w-1/4 p-2">Grade</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.name} className="hover:bg-gray-100">
                <td className="p-2 border-t" onClick={() => handleNameClick(student.name)}>{student.name}</td>
                {showGrades && (selectedStudent === null || selectedStudent === student.name) && (
                  <>
                    <td className="p-2 border-t">{student.major_average.toFixed(1)}</td>
                    <td className="p-2 border-t">{student.minor_average.toFixed(1)}</td>
                    <td className="p-2 border-t">{student.total_average.toFixed(1)}%</td>
                    <td className="p-2 border-t">{getLetterGrade(student.total_average)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="bg-blue-500 text-white mt-2 py-1 px-3 rounded-lg focus:outline-none hover:bg-blue-600 active:bg-blue-700" onClick={handleToggleGrades}>
        {showGrades ? "Hide Grades" : "Show Grades"}
      </button>
      
    </div>
  );
}

export default App;
