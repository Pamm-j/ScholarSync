import React, {FC} from "react";
import FetchButton from "../FetchButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { SemesterDataTableProps } from "../../types/types.js";
import { useDispatch } from "react-redux";
import { setStudent } from "../individual/detailedStudentSlice";


const SemesterDataTable: FC<SemesterDataTableProps> = ({
  showGrades,
  getLetterGrade,
  students, 
  calcSemeseterAvg
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const handleFetchStudentDetails = async (googleId: string) => {
    try {
      const response = await axios.get(`/api/student/${googleId}`);
      const detailedStudent = response.data
      console.log(detailedStudent);
      dispatch(setStudent(detailedStudent))
      navigate(`/student/${googleId}`);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  return (
    <div className="overflow-auto">
      <table className="table-fixed w-full text-sm bg-white rounded-lg text-left">
        <thead className="bg-gray-300">
          <tr>
            <th className="w-1/6 p-1"></th>
            <th className="w-1/4 p-1">Name</th>
            {showGrades && <th className="w-1/5 p-1">p1 Avg</th>}
            {showGrades && <th className="w-1/5 p-1">p2 Avg</th>}
            {showGrades && <th className="w-1/5 p-1">p3 Avg</th>}
            {showGrades && <th className="w-1/5 p-1">S1</th>}
            {showGrades && <th className="w-1/6 p-1">Grade</th>}
            {showGrades && <th className="w-1/6 p-1">Email</th>}
          </tr>
        </thead>
        <tbody>
          {students.sort((a,b)=> {
                let nameA = a.name.toLowerCase(); // convert to lowercase for consistent comparison
    let nameB = b.name.toLowerCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0; // names must be equal
          }).map((student) => (
            <tr key={student.name} className="hover:bg-gray-100">
              <td className="p-1 border-t">
                {
                  <FetchButton
                    onClick={() => handleFetchStudentDetails(student.google_id)}
                    // onClick={() => console.log("hihihi")}
                    text={"detials"}
                  />
                }
              </td>
              <td className="p-1 border-t">{student.name}</td>
              {showGrades && (
                <>
                  <td className="p-1 border-t">
                    {student.p1score.toFixed(1)}%
                  </td>
                  <td className="p-1 border-t">
                  {student.p2score.toFixed(1)}%
                  </td>
                  <td className="p-1 border-t">
                  {student.p3score.toFixed(1)}%
                  </td>
                  <td className="p-1 border-t">
                  {calcSemeseterAvg(student).toFixed(1)}%
                  </td>
                  <td className="p-1 border-t">
                  {getLetterGrade(calcSemeseterAvg(student))}
                  </td>
                  <td className="p-1 border-t">{student.email}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SemesterDataTable;
