import React, { FC } from "react";
import { Link } from "react-router-dom";
import "./animations.css";

const SplashPage: FC = () => {
  return (
    <div className="h-screen w-full bg-teal-500 flex flex-col items-center justify-center p-4">
      <div className="text-9xl animate-talk">😀</div>
      <h1 className="text-3xl mt-8 text-white font-bold">
        Welcome to GradeView!
      </h1>
      <Link to="/all">
        <button className="bg-pink-500 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-pink-600 active:bg-pink-700 mt-5">
          Check Grades
        </button>
      </Link>
    </div>
  );
};

export default SplashPage;
