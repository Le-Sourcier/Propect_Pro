import React from "react";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "primary",
  size = "medium",
  children,
  disabled = false,
  onClick,
  className = "",
  fullWidth = false,
}) => {
  const baseClasses =
    "relative overflow-hidden rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500",
    secondary:
      "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 focus:ring-gray-500",
    outline:
      "border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 text-gray-700 focus:ring-gray-500",
    text: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
  };

  const sizeClasses = {
    small: "text-xs py-1.5 px-2.5",
    medium: "text-sm py-2 px-4",
    large: "text-base py-2.5 px-5",
  };

  const widthClass = fullWidth ? "w-full" : "";

  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed"
    : "transform hover:-translate-y-0.5 active:translate-y-0 hover:shadow-lg";

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${disabledClasses}
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center">
        {children}
      </span>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full hover:translate-x-full transition-transform duration-1000 ease-out" />
      </div>
    </button>
  );
};

export default Button;
