import React, { FC, useEffect } from "react";

import { useSelector, useDispatch } from "react-redux";
import { DetailedStudentType } from "../../types/types";
import { useParams } from "react-router-dom";
import axios from "axios";
import GmailButton from "../buttons/GmailButton";
import { setStudent } from "./detailedStudentSlice"; // Ensure this import is correct based on your project structure
import GradesList from "./GradeList";

const DetailedStudentView: FC = () => {
  const { google_id } = useParams<{ google_id: string }>();
  const student: DetailedStudentType = useSelector(
    (state: any) => state.detailedStudent,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      if (student.google_id !== google_id) {
        try {
          const response = await axios.get(`/api/student/${google_id}`);
          console.log(response);
          dispatch(setStudent(response.data));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [google_id, dispatch, student.google_id]);

  const filterGradesByPeriod = (periods: string[]) => {
    return (student.grades || []).filter((grade) =>
      periods.includes(grade.progress_report_period_name),
    );
  };

  return (
    <div className="bg-pink-200 p-6 rounded-lg shadow-xl">
      <h1 className="text-teal-800 font-bold text-xl mb-4">{student.name}</h1>
      <div className="text-sm mb-4">{student.email}</div>
      <GmailButton student={student} />
      <div className="mb-4">
        S2: P4-P6
        <GradesList
          grades={filterGradesByPeriod(["P4", "P5", "P6"])}
          periods={["P4", "P5", "P6"]}
        />
      </div>
      <div>
        S1: P1-P3 {}
        <GradesList
          grades={filterGradesByPeriod(["P1", "P2", "P3"])}
          periods={["P1", "P2", "P3"]}
        />
      </div>
    </div>
  );
};

export default DetailedStudentView;
