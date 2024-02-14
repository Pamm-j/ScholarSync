import React from "react";
import { StudentType } from "../../types/types";

type ListFailingStudentsProps = {
  students: StudentType[];
};

const ListFailingStudents: React.FC<ListFailingStudentsProps> = ({
  students,
}) => {
  const constructEmailContent = (students: StudentType[]): string => {
    // Build the email body with the student information
    let emailContent = ""; // Column headers
    students.forEach((student) => {
      if (student.total_average < 70)
        emailContent += `Section: ${student.section}, Score: ${student.total_average.toFixed(2)}%, Name: ${student.name}\n`;
    });

    return encodeURIComponent(emailContent);
  };

  const handleButtonClick = () => {
    const emailBody = constructEmailContent(students);
    const subject = encodeURIComponent("Student Grades List");
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&subject=${subject}&body=${emailBody}`;
    window.open(mailtoLink, "_blank");
  };

  return (
    <button onClick={handleButtonClick}>
      Generate Email with Failing Student Grades
    </button>
  );
};

export default ListFailingStudents;
