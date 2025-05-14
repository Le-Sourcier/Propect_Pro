import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFieldProps {
  id?: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  id = "password",
  placeholder = "Enter your password",
  value,
  onChange,
  disabled,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full bg-white bg-opacity-70 backdrop-blur-md rounded-xl px-4 py-3 border outline-none transition-all duration-300 focus: border-neutral-400 focus:ring-2 focus:ring-neutral-100 pr-12"
      />
      <motion.button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500
                 hover:text-neutral-700 focus:outline-none"
        whileTap={{ scale: 0.9 }}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </motion.button>
    </div>
  );
};

export default PasswordField;
