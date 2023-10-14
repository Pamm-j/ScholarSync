import React from 'react';

const students = [
  {
    "preferred_name": "Hermione",
    "last_two_initials": "Gr",
    "google_account_email": "herms@gmail.com"
  },
  {
    "preferred_name": "Ron",
    "last_two_initials": "We",
    "google_account_email": "Ron@hogwarts.com"
  },
  {
    "preferred_name": "Harry",
    "last_two_initials": "Po",
    "google_account_email": "harry@hotdog.com"
  }
]

function App() {
  return (
    <div className="min-h-screen bg-pink-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-lg w-full">
        <h1 className="text-xl mb-4 font-semibold text-gray-700">Students</h1>
        <ul>
          {students.map((student, index) => (
            <li key={index} className="flex items-center justify-between py-2 border-b">
              <div className="flex items-center">
                <div className="text-lg font-medium text-gray-800">{student.preferred_name}</div>
                <span className="ml-2 text-sm text-gray-500">{student.last_two_initials}</span>
              </div>
              <a href={`mailto:${student.google_account_email}`} className="text-blue-500 hover:underline">Email</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
