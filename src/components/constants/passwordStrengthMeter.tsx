import React from "react";
import { getPasswordStrength } from "../utils/validator";

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const strength = getPasswordStrength(password);

  const getStrengthLabel = (strength: number): string => {
    if (strength === 0) return "None";
    if (strength <= 25) return "Weak";
    if (strength <= 50) return "Fair";
    if (strength <= 75) return "Good";
    return "Strong";
  };

  const getStrengthColor = (strength: number): string => {
    if (strength === 0) return "bg-gray-200";
    if (strength <= 25) return "bg-red-500";
    if (strength <= 50) return "bg-yellow-500";
    if (strength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const label = getStrengthLabel(strength);
  const color = getStrengthColor(strength);

  if (!password) return null;

  return (
    <div className="mt-1 mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-500">Password strength</span>
        <span
          className={`text-xs font-medium ${
            strength <= 25
              ? "text-red-500"
              : strength <= 50
              ? "text-yellow-500"
              : strength <= 75
              ? "text-blue-500"
              : "text-green-500"
          } transition-colors duration-300`}
        >
          {label}
        </span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-full ${
              index * 25 < strength ? color : "bg-gray-200"
            } transition-all duration-500 ease-out`}
            style={{
              width: "25%",
              marginRight: index < 3 ? "1px" : 0,
              transform: index * 25 < strength ? "scaleY(1)" : "scaleY(0.5)",
              transformOrigin: "bottom",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
