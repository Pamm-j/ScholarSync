import React, { FC, useState } from "react";
import { GradeType } from "../../types/types"; // Ensure this import is correct based on your project structure
import Grade from "./Grade"; // Ensure this import is correct based on your project structure

interface GradesListProps {
  grades: GradeType[];
  periods: string[];
}

const GradesList: FC<GradesListProps> = ({ grades, periods }) => {
  // State to manage collapsed sections
  const [collapsedSections, setCollapsedSections] = useState<string[]>(periods);

  const toggleSection = (period: string) => {
    const isCollapsed = collapsedSections.includes(period);
    setCollapsedSections(
      isCollapsed
        ? collapsedSections.filter((p) => p !== period)
        : [...collapsedSections, period],
    );
  };

  const calculateAverage = (grades: GradeType[], category: string) => {
    const relevantGrades = grades.filter(
      (grade) => grade.grade_category === category,
    );
    const total = relevantGrades.reduce(
      (acc, curr) => acc + (curr.score ?? 0),
      0,
    );
    const possible = relevantGrades.reduce(
      (acc, curr) => acc + (curr.possible_points ?? 0),
      0,
    );
    return possible > 0 ? (total / possible) * 100 : 0;
  };

  return (
    <div className="bg-pink-100 p-4 rounded-lg shadow-lg">
      {periods.map((period) => {
        const periodGrades = grades.filter(
          (grade) => grade.progress_report_period_name === period,
        );
        const isCollapsed = collapsedSections.includes(period);
        const majorAverage = calculateAverage(periodGrades, "Major");
        const minorAverage = calculateAverage(periodGrades, "Minor");
        const overallAverage = majorAverage * 0.6 + minorAverage * 0.4;

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
              <div className="text-sm">
                Overall Grade: {overallAverage.toFixed(1)}%
              </div>
              <button onClick={() => toggleSection(period)}>
                {isCollapsed ? "+" : "-"}
              </button>
            </div>
            {!isCollapsed && (
              <div>
                {periodGrades.map((grade) => (
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
