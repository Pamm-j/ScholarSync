import React, { useState, FC, useEffect } from "react";
import axios from "axios";
import { SemesterGradesViewProps, StudentType } from "../../types/types.js";
import { addAllStudents } from "./allStudentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Filter from "./Filter";
import SemesterDataTable from "./SemesterDataTable";
import MassEmailButton from "../buttons/MassEmailButton";

const SemesterGradesView: FC<SemesterGradesViewProps> = ({
  setSelectedStudent,
}) => {
  const students = useSelector((state: RootState) => state.students);

  const [showGrades, setShowGrades] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState<{ [key: string]: string | null }>({
    grade: null,
    section: null,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/student_scores");
        dispatch(addAllStudents(response.data)); // Dispatch the data to Redux store
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false); // Ensure loading is set to false even if there's an error
      }
    };

    fetchData();
  }, [dispatch]);

  const handleToggleGrades = () => {
    setShowGrades(!showGrades);
  };

  const calcDisplayLetterGrade = (
    student: StudentType,
    gradePeriod: string,
  ) => {
    if (gradePeriod === "S1") {
      if (student.p3score - student.p2score >= 10) {
        return (
          0.4 * student.p1score + 0.2 * student.p2score + 0.4 * student.p3score
        );
      } else {
        return (student.p1score + student.p2score + student.p3score) / 3;
      }
    } else if (gradePeriod === "S2") {
      return (student.p4score + student.p5score + student.p6score) / 3;
    } else if (gradePeriod === "p4") {
      return student.p4score;
    } else if (gradePeriod === "p5") {
      return student.p5score;
    } else if (gradePeriod === "p6") {
      return student.p6score;
    } else {
      return 0;
    }
  };

  const getLetterGrade = (percentage: number) => {
    if (percentage >= 90) return "A";
    else if (percentage >= 80) return "B";
    else if (percentage >= 70) return "C";
    else if (percentage >= 60) return "D";
    else return "F";
  };

  const handleFilter = (criteria: string, value: string | null) => {
    setFilters((prev) => ({ ...prev, [criteria]: value }));
  };

  const filteredStudents = students.filter((student) => {
    for (const criteria in filters) {
      if (filters[criteria]) {
        switch (criteria) {
          case "grade":
            if (
              getLetterGrade(calcDisplayLetterGrade(student, "p4")) !==
              filters[criteria]
            ) {
              return false;
            }
            break;
          case "section":
            if (student.section !== filters[criteria]) {
              return false;
            }
            break;
        }
      }
    }
    return true;
  });


  return (
    <div className="h-screen w-full bg-teal-500 flex flex-col items-center p-4">
      <div className="mb-2 flex">
        <Filter
          filter={filters.grade}
          onFilter={(value) => handleFilter("grade", value)}
          criteria={["A", "B", "C", "D", "F"]}
          title={"By Grade"}
        />
        <Filter 
          filter={filters.section}
          onFilter={(value) => handleFilter("section", value)}
          criteria={["1°", "2°", "3°", "4°"]}
          title={"By Section"}
        />
      </div>

      <SemesterDataTable
        students={filteredStudents}
        showGrades={showGrades}
        setSelectedStudent={setSelectedStudent}
        getLetterGrade={getLetterGrade}
        calcDisplayLetterGrade={calcDisplayLetterGrade}
      />
      {isLoading ? (
        <>
      <div className="spinner mt-8 mb-4"></div> 

      <button
        className="bg-blue-500 text-white mt-2 py-1 px-3 rounded-lg focus:outline-none hover:bg-blue-600 active:bg-blue-700"
        onClick={handleToggleGrades}
        >
        {showGrades ? "Hide Grades" : "Show Grades"}
      </button>
      <MassEmailButton students={filteredStudents} />
        </>
     ) : null}
    </div>
  );
};

export default SemesterGradesView;
