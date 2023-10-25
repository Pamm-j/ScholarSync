import React, {FC} from "react";
import FetchButton from "./FetchButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DataTableProps } from "../types/types.js";

const DataTable: FC<DataTableProps> = ({
  students,
  showGrades,
  getLetterGrade,
  setSelectedStudent,
}) => {
  const navigate = useNavigate();

  const handleFetchStudentDetails = async (googleId: string) => {
    try {
      const response = await axios.get(`/api/student/${googleId}`);
      console.log(response.data);
      setSelectedStudent(response.data);
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
            <th className="w-1/4 p-2"></th>
            <th className="w-1/4 p-2">Name</th>
            {showGrades && <th className="w-1/4 p-2">Major Avg</th>}
            {showGrades && <th className="w-1/4 p-2">Minor Avg</th>}
            {showGrades && <th className="w-1/4 p-2">Total Avg</th>}
            {showGrades && <th className="w-1/4 p-2">Grade</th>}
            {showGrades && <th className="w-1/4 p-2">Email</th>}
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.name} className="hover:bg-gray-100">
              <td className="p-2 border-t">
                {
                  <FetchButton
                    onClick={() => handleFetchStudentDetails(student.google_id)}
                    // onClick={() => console.log("hihihi")}
                    text={"detials"}
                  />
                }
              </td>
              <td className="p-2 border-t">{student.name}</td>
              {showGrades && (
                <>
                  <td className="p-2 border-t">
                    {student.major_average.toFixed(1)}%
                  </td>
                  <td className="p-2 border-t">
                    {student.minor_average.toFixed(1)}%
                  </td>
                  <td className="p-2 border-t">
                    {student.total_average.toFixed(1)}%
                  </td>
                  <td className="p-2 border-t">
                    {getLetterGrade(student.total_average)}
                  </td>
                  <td className="p-2 border-t">{student.email}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
