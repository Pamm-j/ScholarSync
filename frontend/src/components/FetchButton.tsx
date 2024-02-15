import React, { FC, MouseEventHandler } from 'react';

interface FetchButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  text: string;
}

const FetchButton: FC<FetchButtonProps> = ({ onClick, text }) => {
  return (
    <button
      onClick={onClick}
      className="bg-pink-500 text-white py-1 px-3 rounded-lg focus:outline-none hover:bg-pink-600 active:bg-pink-700 mr-2"
    >
      {text}
    </button>
  );
};

export default FetchButton;
