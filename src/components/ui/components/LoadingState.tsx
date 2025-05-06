import React from "react";

const _LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse flex space-x-2">
        <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animation-delay-200"></div>
        <div className="h-2 w-2 bg-blue-500 rounded-full animation-delay-400"></div>
      </div>
      <span className="ml-2 text-sm text-gray-600">Loading job data...</span>
    </div>
  );
};

export default _LoadingState;
