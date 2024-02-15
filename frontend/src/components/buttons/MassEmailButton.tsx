import React from 'react';
import axios from 'axios';
import { StudentType } from '../../types/types';

interface MassEmailButtonProps {
  students: StudentType[];
}

const MassEmailButton: React.FC<MassEmailButtonProps> = ({ students }) => {
  const handleButtonClick = async () => {
    try {
      // Here, we assume there's an endpoint set up at `/api/send-emails`
      // which handles the email sending logic on the backend.
      await axios.post('/api/send-emails', { students });

      alert('Emails are being sent!');
    } catch (error) {
      console.error('Failed to send emails:', error);
      alert('There was an issue sending the emails.');
    }
  };

  return <button onClick={handleButtonClick}>Email All Students</button>;
};

export default MassEmailButton;
