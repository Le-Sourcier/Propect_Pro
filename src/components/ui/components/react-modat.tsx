import React from "react";

interface ReactModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

function _ReactModal({ children, isOpen, onClose }: ReactModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">React Modal</h1>
          <button
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="mb-4">
          <p>This is a simple React component.</p>
        </div>
        <div>{children}</div>
        <div className="mt-4">
          <p>End of the component.</p>
        </div>
      </div>
    </div>
  );
}

export default _ReactModal;
