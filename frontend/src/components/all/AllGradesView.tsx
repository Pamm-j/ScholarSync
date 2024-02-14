import React, { useState, FC, useEffect } from "react";
import axios from "axios";
import FetchButton from "../FetchButton";
import GradeFilter from "./Filter";
import DataTable from "./DataTable";
import { AllGradesViewProps, StudentType } from "../../types/types.js";
import { addAllStudents } from "./allStudentsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import Filter from "./Filter";
import ListFailingStudents from "../buttons/ListFailingStudents";


const AllGradesView: FC<AllGradesViewProps> = ({ setSelectedStudent }) => {
  const students = useSelector((state: RootState) => state.students);

  const [showGrades, setShowGrades] = useState(true);
  const [filters, setFilters] = useState<{ [key: string]: string | null }>({
    grade: null,
    section: null,
    // Add other filters here as needed
  });  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      fetchAllStudents()
    };
  
    fetchData();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get("/api/student_grades");
      console.log(response.data);
      
      // Dispatch the entire list of students to the Redux store
      dispatch(addAllStudents(response.data));
  
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

  const handleFilter = (criteria: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [criteria]: value }));
  };
  

  const filteredStudents = students.filter(student => {
    for (const criteria in filters) {
      if (filters[criteria]) {
        switch(criteria) {
          case "grade":
            if (getLetterGrade(student.total_average) !== filters[criteria]) {
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
    <div className="h-screen w-full bg-teal-500 flex flex-col items-center justify-center p-4">
      <div className="mb-2 flex">
        {/* <FetchButton onClick={fetchAllStudents} text={"Fetch Student Data"} /> */}
        <Filter
          filter={filters.grade}
          onFilter={(value) => handleFilter('grade', value)}
          criteria={["A", "B", "C", "D", "F"]}
          title={'By Grade'}
        />
        <Filter // You might want to rename this to something more generic
          filter={filters.section} 
          onFilter={(value) => handleFilter('section', value)}
          criteria={["1°", "2°", "3°", "4°"]} 
          title={'By Section'}
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
      <ListFailingStudents students={students}/>
    </div>
  );
}

export default AllGradesView