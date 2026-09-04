import React from 'react';
import { Settings } from 'lucide-react';

const Placeholder = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Settings className="w-12 h-12 text-gray-400 animate-[spin_3s_linear_infinite]" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
      <p className="text-gray-500 max-w-md">
        This page is currently being built by another teammate. It will be merged here soon.
      </p>
    </div>
  );
};

export default Placeholder;
