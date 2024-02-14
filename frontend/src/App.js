import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllGradesView from "./components/all/AllGradesView.tsx";
import SemesterGradesView from "./components/semester_scores/SemesterGradesView.tsx"
import SplashPage from "./components/SplashPage.tsx";
import DetailedStudentView from "./components/individual/DetailedStudentView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/:google_id" element={<DetailedStudentView />} />
        <Route path="/all" element={<AllGradesView />} />
        <Route path="/semester" element={<SemesterGradesView />} />
        <Route path="/" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
