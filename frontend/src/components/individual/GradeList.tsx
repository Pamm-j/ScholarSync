import React, { FC, useState } from 'react';
import { DetailedStudentType, GradeType } from '../../types/types'; // Ensure this import is correct based on your project structure
import Grade from './Grade'; // Ensure this import is correct based on your project structure

interface GradesListProps {
  periods: string[];
  student: DetailedStudentType;
}

const GradesList: FC<GradesListProps> = ({ periods, student }) => {
  // State to manage collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<string[]>(periods);
  const toggleSection = (period: string) => {
    const isCollapsed = collapsedSections.includes(period);
    setCollapsedSections(
      isCollapsed
        ? collapsedSections.filter((p) => p !== period)
        : [...collapsedSections, period]
    );
  };

  const getPeriodData = (gradePeriod: string, student: DetailedStudentType) => {
    const data: { grade: string; grades: GradeType[] } = {
      grade: '',
      grades: []
    };
    let grade = '';
    let grades: GradeType[] = [];
    switch (gradePeriod) {
      case 'P1':
        grade = student.p1score.toFixed(1);
        grades = student.p1_grades;
        break;
      case 'P2':
        grade = student.p2score.toFixed(1);
        grades = student.p2_grades;
        break;
      case 'P3':
        grade = student.p3score.toFixed(1);
        grades = student.p3_grades;
        break;
      case 'S1':
        grade = student.s1.toFixed(1);
        break;
      case 'P4':
        grade = student.p4score.toFixed(1);
        grades = student.p4_grades;
        break;
      case 'P5':
        grade = student.p5score.toFixed(1);
        grades = student.p5_grades;
        break;
      case 'P6':
        grade = student.p6score.toFixed(1);
        grades = student.p6_grades;
        break;
      case 'S2':
        grade = student.s1.toFixed(1);
        break;
      default:
        grade = 'error';
    }
    data.grade = grade;
    data.grades = grades;

    return data;
  };

  const calculateAverage = (grades: GradeType[], category: string) => {
    console.log(grades, category);
    const relevantGrades = grades.filter(
      (grade) => grade.grade_category_name === category
    );
    const total = relevantGrades.reduce(
      (acc, curr) => acc + (curr.score ?? 0),
      0
    );
    const possible = relevantGrades.reduce(
      (acc, curr) => acc + (curr.possible_points ?? 0),
      0
    );
    return possible > 0 ? (total / possible) * 100 : 0;
  };
  return (
    <div className="bg-pink-100 p-4 rounded-lg shadow-lg">
      {periods.map((period) => {
        const isCollapsed = collapsedSections.includes(period);
        const periodData = getPeriodData(period, student);
        const majorAverage = calculateAverage(periodData.grades, 'Major');
        const minorAverage = calculateAverage(periodData.grades, 'Minor');
        return (
          <div key={period}>
            <div className="flex justify-between bg-teal-500 p-2 text-white font-bold mt-2 rounded-lg">
              <h3>{`${period}`}</h3>
              <div className="text-sm">
                Major Average: {majorAverage.toFixed(1)}%
              </div>
              <div className="text-sm">
                Minor Average: {minorAverage.toFixed(1)}%
              </div>
              <div className="text-sm">Overall Grade: {periodData.grade}%</div>
              <button onClick={() => toggleSection(period)}>
                {isCollapsed ? '+' : '-'}
              </button>
            </div>
            {!isCollapsed && (
              <div>
                {periodData.grades.map((grade) => (
                  <Grade key={grade.assignment_name} data={grade} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GradesList;
