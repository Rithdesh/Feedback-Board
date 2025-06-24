import "./App.css";

import React from "react";

function App() {
  return (
    <div
      className="min-h-screen bg-gray-100 flex items-center justify
center"
    >
      <div className="p-6 max-w-sm bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">
          Hello, Tailwind!
        </h1>
        <p className="text-gray-700 mb-4">
          If you see this page styled, Tailwind CSS is working!
        </p>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg 
hover:bg-indigo-700"
        >
          Click Me
        </button>
      </div>
    </div>
  );
}

export default App;
