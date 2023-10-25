import React, { useState, FC } from "react";
import axios from "axios";
import FetchButton from "./FetchButton";
import GradeFilter from "./GradeFilter";
import DataTable from "./DataTable";
import { AllGradesViewProps, DetailedStudentType } from "../types/types.js";


const AllGradesView: FC<AllGradesViewProps> = ({ setSelectedStudent }) => {
  const [students, setStudents] = useState<DetailedStudentType[]>([]);
  const [showGrades, setShowGrades] = useState(true);
  const [gradeFilter, setGradeFilter] = useState<string | null>(null);

  const handleButtonClick = async () => {
    try {
      const response = await axios.get("/api/student_grades");
      setStudents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleToggleGrades = () => {
    setShowGrades(!showGrades);
  };

  const getLetterGrade = (percentage:number) => {
    if (percentage >= 90) return "A";
    else if (percentage >= 80) return "B";
    else if (percentage >= 70) return "C";
    else if (percentage >= 60) return "D";
    else return "F";
  };

  const handleGradeFilter = (grade: string | null) => {
    if (grade === gradeFilter) {
      setGradeFilter(null);
    } else {
      setGradeFilter(grade);
    }
  };

  const filteredStudents = gradeFilter
    ? students.filter(
        (student) => getLetterGrade(student.total_average) === gradeFilter
      )
    : students;

  return (
    <div className="h-screen w-full bg-teal-500 flex flex-col items-center justify-center p-4">
      <div className="mb-2 flex">
        <FetchButton onClick={handleButtonClick} text={"Fetch Student Data"} />
        <GradeFilter
          gradeFilter={gradeFilter}
          onGradeFilter={handleGradeFilter}
        />
      </div>

      <DataTable
        students={filteredStudents}
        showGrades={showGrades}
        setSelectedStudent={setSelectedStudent}
        getLetterGrade={getLetterGrade}
      />

      <button
        className="bg-blue-500 text-white mt-2 py-1 px-3 rounded-lg focus:outline-none hover:bg-blue-600 active:bg-blue-700"
        onClick={handleToggleGrades}
      >
        {showGrades ? "Hide Grades" : "Show Grades"}
      </button>
    </div>
  );
}

export default AllGradesView