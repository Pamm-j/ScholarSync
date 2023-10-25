import React, { FC } from 'react';
import GradesList from './GradeList';
import { DetailedStudentViewProps } from '../types/types'; 

const DetailedStudentView: FC<DetailedStudentViewProps> = ({ selectedStudent }) => {
  const student = selectedStudent;
  const majorGrades = student.grades.filter(
    (grade) => grade.grade_category === "Major"
  );
  const minorGrades = student.grades.filter(
    (grade) => grade.grade_category === "Minor"
  );
  const notCategorizedGrades = student.grades.filter(
    (grade) => grade.grade_category === "Not Categorized"
  );
  return (
    <div className="bg-pink-200 p-6 rounded-lg shadow-xl">
      <h1 className="text-teal-800 font-bold text-xl mb-4">{student.name}</h1>
      <div className="text-sm mb-4">{student.email}</div>
      <GradesList
        grades={majorGrades}
        categoryName={"Major"}
        categoryDisplay={"Major"}
        gradePeriod={"P2"}
      />
      <GradesList
        grades={minorGrades}
        categoryName={"Minor"}
        categoryDisplay={"Minor"}
        gradePeriod={"P2"}
      />
      <GradesList
        grades={notCategorizedGrades}
        categoryName={"Not Categorized"}
        categoryDisplay={"P1"}
        gradePeriod={"P1"}
      />
    </div>
  );
}

export default DetailedStudentView;
