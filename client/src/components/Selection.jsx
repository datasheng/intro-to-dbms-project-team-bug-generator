import React from 'react';
import { Link } from 'react-router-dom';

const SelectionPage = () => {
  return (
    <div className="flex h-screen">
      <button className="w-1/2 bg-red-400 text-white text-2xl font-bold">
        Instructor
      </button>
      <Link to='/dashboard' className="w-1/2 bg-indigo-400 text-white text-2xl font-bold flex items-center justify-center">
        Student
      </Link>
    </div>
  );
};

export default SelectionPage;
