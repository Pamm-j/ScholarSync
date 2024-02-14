import React, { FC, useState } from "react";
import FetchButton from "../FetchButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SemesterDataTableProps, StudentType } from "../../types/types.js";
import { useDispatch } from "react-redux";
import { setStudent } from "../individual/detailedStudentSlice";

const SemesterDataTable: FC<SemesterDataTableProps> = ({
  showGrades,
  getLetterGrade,
  students,
  calcDisplayLetterGrade,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [view, setView] = useState(["p4 Avg", "p4 Grade"]);
  // ['p1 Avg', 'p2 Avg', 'p3 Avg', 'S1', 'p4 Avg', 'p5 Avg', 'p6 Avg', "S2" ]

  const handleFetchStudentDetails = async (googleId: string) => {
    try {
      const response = await axios.get(`/api/student/${googleId}`);
      const detailedStudent = response.data;
      console.log(detailedStudent);
      dispatch(setStudent(detailedStudent));
      navigate(`/student/${googleId}`);
    } catch (error) {
      console.error("Error fetching student details:", error);
    }
  };

  const displayGradeItem = (gradePeriod: string, student: StudentType) => {
    let returnValue;

    switch (gradePeriod) {
      case "p1 Avg":
        returnValue = student.p1score.toFixed(1);
        break;
      case "p2 Avg":
        returnValue = student.p2score.toFixed(1);
        break;
      case "p3 Avg":
        returnValue = student.p3score.toFixed(1);
        break;
      case "S1":
        returnValue = calcDisplayLetterGrade(student, "S1").toFixed(1);
        break;
      case "p4 Avg":
        returnValue = student.p4score.toFixed(1);
        break;
      case "p5 Avg":
        returnValue = student.p5score.toFixed(1);
        break;
      case "p6 Avg":
        returnValue = student.p6score.toFixed(1);
        break;
      case "S2":
        returnValue = calcDisplayLetterGrade(student, "S2").toFixed(1);
        break;
      case "p4 Grade":
        returnValue = getLetterGrade(student.p4score);
        break;
      default:
        returnValue = "error";
    }

    return returnValue;
  };

  return (
    <div className="overflow-auto">
      <table className="table-fixed w-full text-sm bg-white rounded-lg text-left">
        <thead className="bg-gray-300">
          <tr>
            <th className="w-1/6 p-1"></th>
            <th className="w-1/4 p-1">Name</th>
            {view.map((gradePeriod) => (
              <th className="w-1/5 p-1">{gradePeriod}</th>
            ))}
            {showGrades && <th className="w-1/6 p-1">Email</th>}
          </tr>
        </thead>
        <tbody>
          {students
            .sort((a, b) => {
              let nameA = a.name.toLowerCase(); // convert to lowercase for consistent comparison
              let nameB = b.name.toLowerCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0; // names must be equal
            })
            .map((student) => (
              <tr key={student.name} className="hover:bg-gray-100">
                <td className="p-1 border-t">
                  {
                    <FetchButton
                      onClick={() =>
                        handleFetchStudentDetails(student.google_id)
                      }
                      text={"detials"}
                    />
                  }
                </td>
                <td className="p-1 border-t">{student.name}</td>
                {showGrades && (
                  <>
                    {view.map((gradePeriod) => (
                      <td className="p-1 border-t">
                        {displayGradeItem(gradePeriod, student)}
                      </td>
                    ))}
                    <td className="p-1 border-t">{student.email}</td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SemesterDataTable;
