import React, { useState } from "react";
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

function Field({
  label,
  htmlFor,

  ...props
}: {
  label?: string;
  htmlFor?: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <div>
      {label && (
        <label
          htmlFor={htmlFor ?? props.type?.toLocaleLowerCase()}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="mt-1">
        <input
          {...props}
          className={`${props.className} appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
        />
      </div>
    </div>
  );
}

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  touched?: boolean;
  autoComplete?: string;
}

const Field2: React.FC<FormFieldProps> = ({
  id,
  label,
  type: initialType,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  touched = false,
  autoComplete,
}) => {
  const [type, setType] = useState(initialType);
  const [isFocused, setIsFocused] = useState(false);
  const isPassword = initialType === "password";
  const showToggle = isPassword && value.length > 0;
  const hasError = touched && error;
  const isValid = touched && value && !error;

  const togglePasswordVisibility = () => {
    setType(type === "password" ? "text" : "password");
  };

  return (
    <div className="group">
      <label
        htmlFor={id}
        className={`
          block text-sm font-medium transition-colors duration-200
          ${isFocused ? "text-blue-600" : "text-gray-700"}
          group-hover:text-blue-600
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required={required}
          className={`
            appearance-none block w-full px-3 py-2 border rounded-lg
            shadow-sm placeholder-gray-400 
            transition-all duration-300 ease-in-out
            ${
              hasError
                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                : isValid
                ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-50
            ${showToggle ? "pr-10" : ""}
            transform hover:scale-[1] focus:scale-[1]
          `}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {showToggle && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
              tabIndex={-1}
            >
              {type === "password" ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          )}

          {hasError && !showToggle && (
            <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
          )}

          {isValid && !showToggle && (
            <CheckCircle className="h-5 w-5 text-green-500 animate-appear" />
          )}
        </div>
      </div>

      {hasError && (
        <p className="mt-2 text-sm text-red-600 animate-slideDown">{error}</p>
      )}
    </div>
  );
};

const _Form = {
  Field,
  Field2,
};
export default _Form;
