import React from 'react';
import { DetailedStudentType, GmailButtonProps } from '../../types/types';


const GmailButton: React.FC<GmailButtonProps> = ({ student }) => {

  const constructEmailBody = (student: DetailedStudentType) => {
    const zeroScoreAssignments = student.grades
    .filter(grade => grade.score === 0 && grade.progress_report_period_name === "P2")
    .sort((a, b) => {
      // Extract the numeric parts from the "Wx" prefixes.
      const weekA = parseInt(a.assignment_name.match(/W(\d+)/)?.[1] || '0', 10);
      const weekB = parseInt(b.assignment_name.match(/W(\d+)/)?.[1] || '0', 10);
  
      // Compare the "Wx" parts in descending order.
      if (weekA !== weekB) return weekB - weekA;
  
      // If "Wx" parts are equal, extract and compare the numeric parts from the "Dx" prefixes.
      const dayA = parseInt(a.assignment_name.match(/D(\d+)/)?.[1] || '0', 10);
      const dayB = parseInt(b.assignment_name.match(/D(\d+)/)?.[1] || '0', 10);
  
      // Compare the "Dx" parts in descending order.
      if (dayA !== dayB) return dayB - dayA;
  
      // If both "Wx" and "Dx" parts are equal, compare the entire assignment names in ascending order.
      return a.assignment_name.localeCompare(b.assignment_name);
    });
  
    let emailBody = "Hello,\n\nBelow are the assignments with a score of 0:\n\n";
    
    zeroScoreAssignments.forEach(assignment => {
      emailBody += `- ${assignment.assignment_name}\n`;
    });
    
    return encodeURIComponent(emailBody);
  };

  const handleButtonClick = () => {
    const emailBody = constructEmailBody(student);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${student.email}&body=${emailBody}`;
    window.open(mailtoLink, '_blank');
  };

  return <button onClick={handleButtonClick}>Email Student</button>;
};

export default GmailButton;
