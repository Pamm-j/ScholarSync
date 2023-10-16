import React from "react";

function GradeDistribution({ grades }) {
  const totalGrades = grades.length;

  // Initialize counters for each grade
  const counts = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
  };

  grades.forEach((grade) => {
    if (grade >= 90) counts.A += 1;
    else if (grade >= 80) counts.B += 1;
    else if (grade >= 70) counts.C += 1;
    else counts.D += 1;
  });

  return (
    <div className="p-4 rounded shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4">Grade Distribution</h2>
      {Object.entries(counts).map(([grade, count]) => (
        <div key={grade}>
          <span className="font-medium">{grade}:</span> {count} students (
          {((count / totalGrades) * 100).toFixed(2)}%)
        </div>
      ))}
    </div>
  );
}

export default GradeDistribution;
