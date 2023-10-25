import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AllGradesView from "./components/AllGradesView.tsx";
import SplashPage from "./components/SplashPage.tsx";
import DetailedStudentView from "./components/DetailedStudentView.tsx";

function App() {
  const [selectedStudent, setSelectedStudent] = useState(null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/student/:google_id" element={<DetailedStudentView selectedStudent={selectedStudent}/>} />
        <Route path="/all" element={<AllGradesView setSelectedStudent={setSelectedStudent}/>} />
        <Route path="/" element={<SplashPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
