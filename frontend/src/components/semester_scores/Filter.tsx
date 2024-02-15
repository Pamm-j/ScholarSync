import React, { FC } from 'react';
import { FilterProps } from '../../types/types';

const Filter: FC<FilterProps> = ({ filter, onFilter, criteria }) => {
  return (
    <div className="flex items-center">
      <span className="text-lg font-semibold mr-4">By Grade:</span>

      {criteria.map((grade) => (
        <button
          key={grade}
          onClick={() => onFilter(grade)}
          className={`bg-gray-200 text-black py-1 px-3 rounded-lg focus:outline-none hover:bg-gray-300 active:bg-gray-400 ${
            filter === grade ? 'bg-gray-400' : ''
          } mr-2`}
        >
          {grade}
        </button>
      ))}
    </div>
  );
};

export default Filter;
