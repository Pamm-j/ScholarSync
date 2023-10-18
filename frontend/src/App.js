import React from "react";
import axios from 'axios';


function App() {
  const handleButtonClick = async () => {
    try {
      const response = await axios.get("/api/student"); // Replace with your backend endpoint
      console.log(response.data);
      // Handle the response data as needed
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error as needed
    }
  };

  return (
    <div className="h-screen w-full bg-teal-500 flex items-center justify-center">
      <button
        onClick={handleButtonClick}
        className="bg-pink-500 text-white py-2 px-4 rounded-lg focus:outline-none hover:bg-pink-600 active:bg-pink-700"
      >
        Fetch Student Data
      </button>
    </div>
  );
}

export default App;
