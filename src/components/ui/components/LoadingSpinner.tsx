import React from "react";

type SpinnerSize = "small" | "medium" | "large";

interface LoadingSpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const _LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  className = "",
}) => {
  const sizeClasses = {
    small: "w-4 h-4 border-2",
    medium: "w-8 h-8 border-2",
    large: "w-12 h-12 border-3",
  };

  return (
    <div className={`${className} flex justify-center items-center`}>
      <div
        className={`${sizeClasses[size]} border-t-blue-600 border-r-blue-600 border-b-blue-200 border-l-blue-200 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default _LoadingSpinner;
