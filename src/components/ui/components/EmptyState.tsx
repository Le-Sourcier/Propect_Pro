import React from "react";

interface EmptyStateProps {
  message?: string;
}

const _EmptyState: React.FC<EmptyStateProps> = ({
  message = "No data available",
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <svg
        className="w-16 h-16 text-gray-300 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        ></path>
      </svg>
      <p className="text-gray-500 text-sm font-medium">{message}</p>
    </div>
  );
};

export default _EmptyState;
