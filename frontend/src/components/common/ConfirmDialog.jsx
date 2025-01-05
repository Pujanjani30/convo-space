import React from "react";

const ConfirmDialog = ({
  isOpen,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  onConfirm,
  confirmBtnStyle,
  onCancel,
}) => {
  if (!isOpen) return null; // Do not render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-90 p-6">
        <h2 className="text-xl font-bold mb-4 text-black">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            className={`px-4 py-2 rounded text-white 
              ${confirmBtnStyle || "bg-blue-600 hover:bg-blue-700"}`
            }
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-800"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
