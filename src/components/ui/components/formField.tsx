import React from "react";

function _FormField({
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

export default _FormField;
