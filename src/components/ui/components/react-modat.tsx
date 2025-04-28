import React from "react";

interface ReactModalProps {
  children: React.ReactNode;
  label?: string | React.ReactNode;
  isOpen: boolean;
  className?: React.HTMLAttributes<HTMLDivElement> | string;
  onClose: () => void;
}

function _ReactModal({
  children,
  label,
  isOpen,
  className,
  onClose,
}: ReactModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded-lg shadow-lg md:w-[80%] lg:w-[65%] max-[1024px]:mx-6 max-h-[95%] flex flex-col ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1
            style={{ visibility: !!label ? "visible" : "hidden" }}
            className="text-xl font-semibold"
          >
            {label}
          </h1>
          <button
            className="text-white hover:text-opacity-90 bg-blue-600 bg-opacity-80 hover:bg-opacity-100 p-1 h-6 w-6 flex items-center justify-center rounded-full text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

export default _ReactModal;
