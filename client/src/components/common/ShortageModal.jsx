// crud-admin/client/src/components/common/ShortageModal.jsx

import React from "react";

function ShortageModal({
  isOpen,
  closeModal,
  formData,
  handleInputChange,
  handleCreateOrUpdateShortage,
  editingShortageId,
}) {
  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h3 className="text-xl mb-4 font-semibold">
            {editingShortageId ? "Edit Shortage" : "Create New Shortage"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Shortage:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter shortage name"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Alternative:
                <input
                  type="text"
                  name="alternatives"
                  value={formData.alternatives}
                  onChange={handleInputChange}
                  placeholder="Enter Alternatives"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Form:
                <input
                  type="text"
                  name="form"
                  value={formData.form}
                  onChange={handleInputChange}
                  placeholder="Enter Form"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                PackSize:
                <input
                  type="text"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleInputChange}
                  placeholder="Enter Pack Size"
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-500"
                />
              </label>
            </div>
          </div>
          <div className="flex items-center justify-end mt-4 space-x-2">
            <button
              onClick={handleCreateOrUpdateShortage}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            >
              {editingShortageId ? "Update" : "Create"}
            </button>
            <button
              onClick={closeModal}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring focus:border-blue-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default ShortageModal;
