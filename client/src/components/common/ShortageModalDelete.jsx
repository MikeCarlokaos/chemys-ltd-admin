// ShortageModalDelete.jsx

import React from "react";

const ShortageModalDelete = ({
  isDeleteOpen,
  onDeleteCancel,
  onDeleteConfirm,
}) => {
  return (
    isDeleteOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
          <p className="text-xl font-semibold mb-4">Confirm Deletion</p>
          <p className="mb-4">Are you sure you want to delete this shortage?</p>
          <div className="flex justify-center">
            <button
              onClick={onDeleteConfirm}
              className="bg-red-500 text-white px-4 py-2 mr-2 rounded-md hover:bg-red-600"
            >
              Confirm
            </button>
            <button
              onClick={onDeleteCancel}
              className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ShortageModalDelete;
