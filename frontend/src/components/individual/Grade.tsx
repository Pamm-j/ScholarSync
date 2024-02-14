import React, { FC } from 'react';
import {  GradeProps } from '../../types/types';

const Grade: FC<GradeProps> = ({ data }) => {
  return (
    <div className="flex justify-between bg-white p-2 mt-1 rounded-lg shadow-sm">
      <div>{data.assignment_name}</div>
      <div>
        {data.score !== null && data.score !== undefined
          ? `${data.score}/${data.possible_points}`
          : "Not Graded"}
      </div>
    </div>
  );
}

export default Grade;
