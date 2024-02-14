import React, { FC, useEffect } from 'react';
import GradesList from './GradeList';
import { useSelector } from 'react-redux';
import { DetailedStudentType } from '../../types/types'; 
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStudent } from './detailedStudentSlice';
import axios from 'axios';
import GmailButton from './GmailButton';


const DetailedStudentView: FC = () => {
  const { google_id } = useParams<{ google_id: string }>();
  console.log(google_id)

  const student: DetailedStudentType = useSelector((state: any) => state.detailedStudent);
  const dispatch = useDispatch();


  useEffect(() => {
    const fetchData = async () => {
      if ( student.google_id !== google_id) {
        try {
          const response = await axios.get(`/api/student/${google_id}`);
          console.log(response)
          dispatch(setStudent(response.data));  // Assuming `setStudent` is your action to set the detailed student and that you want to store response.data
        } catch (error) {
          console.log(error)
        }
      }
    };
  
    fetchData();
  }, [google_id, dispatch]);
  

  const majorGrades = (student.grades || []).filter(
    (grade) => grade.grade_category === "Major"
  );
  const minorGrades = (student.grades || []).filter(
    (grade) => grade.grade_category === "Minor"
  );
  const notCategorizedGrades = (student.grades || []).filter(
    (grade) => grade.grade_category === "Not Categorized"
  );

  return (
    <div className="bg-pink-200 p-6 rounded-lg shadow-xl">
      <h1 className="text-teal-800 font-bold text-xl mb-4">{student.name}</h1>
      <div className="text-sm mb-4">{student.email}</div>
      <GmailButton student={student}/>
      <GradesList
        grades={majorGrades}
        categoryName={"Major"}
        categoryDisplay={"Major"}
        gradePeriod={"P2"}
      />
      <GradesList
        grades={minorGrades}
        categoryName={"Minor"}
        categoryDisplay={"Minor"}
        gradePeriod={"P2"}
      />
      <GradesList
        grades={notCategorizedGrades}
        categoryName={"Not Categorized"}
        categoryDisplay={"P1"}
        gradePeriod={"P1"}
      />
    </div>
  );
}

export default DetailedStudentView;
