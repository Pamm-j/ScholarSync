import React, { FC } from 'react';
import { GradeType, GradesListProps } from '../types/types';
import Grade from './Grade';



const GradesList: FC<GradesListProps> = ({ grades, categoryName, categoryDisplay, gradePeriod }) => {
  function calculateAverage(grades: GradeType[], gradeCategoryName: string, gradePeriod: string): number {
    // Step 1: Filter grades by given category and grade period
    const filteredGrades = grades.filter(
      (grade) =>
        grade.grade_category === gradeCategoryName &&
        grade.progress_report_period_name === gradePeriod
    );

    if (filteredGrades.length === 0) {
      return 0;
    }

    // Step 2: Calculate the average score, excluding grades with null scores or possible points
    const gradesWithScores = filteredGrades.filter(
      (grade) => grade.score !== null && grade.possible_points !== null
    );

    const totalScore = gradesWithScores.reduce(
      (acc, grade) => acc + (grade.score ?? 0),
      0
    );
    const totalPossible = gradesWithScores.reduce(
      (acc, grade) => acc + (grade.possible_points ?? 0),
      0
    );
    

    if (totalPossible === 0) {
      return 0;
    }

    // Step 3: Return the average
    return (totalScore / totalPossible) * 100;
  }

  return (
    <div className="bg-pink-100 p-4 rounded-lg shadow-lg">
      <div className="flex justify-between bg-teal-500 p-2 text-white font-bold mt-2 rounded-lg">
        <div>{categoryDisplay} Average:</div>
        <div>
          {calculateAverage(grades, categoryName, gradePeriod).toFixed(1)}%
        </div>
      </div>
      {grades.map((grade) => (
        <Grade key={grade.assignment_name} data={grade} />
      ))}
    </div>
  );
}

export default GradesList;
