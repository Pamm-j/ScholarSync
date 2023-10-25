import React, { FC } from 'react';
import { GradeFilterProps } from '../types/types';



const GradeFilter: FC<GradeFilterProps> = ({ gradeFilter, onGradeFilter }) => {
  return (
    <>
      {["A", "B", "C", "D", "F"].map((grade) => (
        <button
          key={grade}
          onClick={() => onGradeFilter(grade)}
          className={`bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300 active:bg-gray-400 ${
            gradeFilter === grade ? "bg-gray-400" : ""
          } mr-2`}
        >
          {grade}
        </button>
      ))}
    </>
  );
}

export default GradeFilter;
