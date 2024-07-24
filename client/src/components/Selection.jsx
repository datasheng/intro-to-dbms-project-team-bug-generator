import React from 'react';

const SelectionPage = () => {
  return (
    <div className="flex h-screen">
      <button className="w-1/2 bg-red-400 text-white text-2xl font-bold">
        Instructor
      </button>
      <button className="w-1/2 bg-indigo-400 text-white text-2xl font-bold">
        Student
      </button>
    </div>
  );
};

export default SelectionPage;
