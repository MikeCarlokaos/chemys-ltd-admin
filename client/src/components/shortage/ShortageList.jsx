// crud-admin/client/src/components/shortage/ShortageList.jsx

import React, { useState, useEffect, useRef } from "react";
import * as shortageApi from "../../services/shortageService";
import Sidebar from "../nav/Sidebar";
import AddIcon from "../../assets/icons/AddIcon";
import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import PrevIcon from "../../assets/icons/PrevIcon";
import NextIcon from "../../assets/icons/NextIcon";
import ShortageModalDelete from "../common/ShortageModalDelete";
import ShortageModal from "../common/ShortageModal";

const ShortageList = () => {
  const [shortages, setShortages] = useState([]);
  const [modalFormData, setModalFormData] = useState({
    name: "",
    alternatives: "",
    form: "",
    packSize: "",
  });
  const [editingShortageId, setEditingShortageId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedShortageIdToDelete, setSelectedShortageIdToDelete] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchShortages();
  }, [currentPage, sortCriteria, sortOrder, search]);

  const sortShortages = (shortages, criteria, order) => {
    return shortages.slice().sort((a, b) => {
      const valueA = a[criteria];
      const valueB = b[criteria];
      return valueA.localeCompare(valueB) * (order === "desc" ? -1 : 1);
    });
  };

  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      // Set isMountedRef to false when the component is unmounted
      isMountedRef.current = false;
    };
  }, []);

  const fetchShortages = async (
    page = currentPage,
    criteria = sortCriteria,
    order = sortOrder,
    searchTerm = search
  ) => {
    console.log("Fetching shortages with search term:", searchTerm);

    try {
      const response = await shortageApi.fetchShortages({
        page,
        limit: itemsPerPage,
        criteria,
        order,
        searchTerm,
      });

      console.log("API response:", response);

      if (response && response.shortages && response.totalItems) {
        const sortedShortages = sortShortages(
          response.shortages,
          criteria,
          order
        );
        setShortages(sortedShortages);

        const calculatedTotalPages = Math.ceil(
          response.totalItems / itemsPerPage
        );
        setTotalPages(calculatedTotalPages);
      } else {
        console.error("Invalid data format received from the API:", response);
      }
    } catch (error) {
      console.error("Error fetching shortages:", error);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    await fetchShortages(newPage, sortCriteria, sortOrder, search);
  };

  const handleGotoPage = (selectedPage) => {
    handlePageChange(selectedPage);
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handleSortCriteriaChange = (e) => {
    const newSortCriteria = e.target.value;
    setSortCriteria(newSortCriteria);
    fetchShortages(currentPage, newSortCriteria, sortOrder, search);
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchShortages(currentPage, sortCriteria, newSortOrder, search);
  };

  const handleInputChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Add this line to reset to page 1
    fetchShortages(1, sortCriteria, sortOrder, newSearchTerm);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalFormData({ name: "", alternatives: "", form: "", packSize: "" });
    setEditingShortageId(null);
  };

  const handleCreateOrUpdateShortage = async () => {
    const { name, alternatives, form, packSize } = modalFormData;

    try {
      if (editingShortageId) {
        // Update the shortage
        const updatedShortage = await shortageApi.updateShortage(
          editingShortageId,
          modalFormData
        );

        // Fetch the updated list of shortages
        const response = await shortageApi.fetchShortages({
          page: currentPage,
          limit: itemsPerPage,
          criteria: sortCriteria,
          order: sortOrder,
          searchTerm: search,
        });

        // Update the shortages state with the new list
        setShortages(response.shortages);
      } else {
        // Create a new shortage
        const newShortage = await shortageApi.createShortage(modalFormData);

        // Fetch the updated list of shortages
        const response = await shortageApi.fetchShortages({
          page: 1,
          limit: itemsPerPage,
          criteria: sortCriteria,
          order: sortOrder,
          searchTerm: search,
        });

        // If the total items have increased, update the total pages
        const calculatedTotalPages = Math.ceil(
          response.totalItems / itemsPerPage
        );
        setTotalPages(calculatedTotalPages);

        // If the new shortage is not on the current page, adjust the current page
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }

        // Update the shortages state with the new list
        setShortages(response.shortages);
      }

      closeModal();
    } catch (error) {
      console.error(
        `Error ${editingShortageId ? "updating" : "creating"} shortage:`,
        error
      );
    }
  };

  const handleCreateShortage = async () => {
    try {
      // Create a new shortage
      const newShortage = await shortageApi.createShortage(formData);

      // Fetch the updated list of shortages
      const response = await shortageApi.fetchShortages({
        page: 1,
        limit: itemsPerPage,
        criteria: sortCriteria,
        order: sortOrder,
        searchTerm: search,
      });

      // If the total items have increased, update the total pages
      const calculatedTotalPages = Math.ceil(
        response.totalItems / itemsPerPage
      );
      setTotalPages(calculatedTotalPages);

      // If the new shortage is not on the current page, adjust the current page
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Update the shortages state with the new list (consider sorting here if needed)
      setShortages(response.shortages);
    } catch (error) {
      console.error("Error creating shortage:", error);
    }
  };

  const handleUpdateShortage = async () => {
    try {
      // Update the shortage
      const updatedShortage = await shortageApi.updateShortage(
        editingShortageId,
        formData
      );

      // Fetch the updated list of shortages
      const response = await shortageApi.fetchShortages({
        page: 1,
        limit: itemsPerPage,
        criteria: sortCriteria,
        order: sortOrder,
        searchTerm: search,
      });

      // If the total items have increased, update the total pages
      const calculatedTotalPages = Math.ceil(
        response.totalItems / itemsPerPage
      );
      setTotalPages(calculatedTotalPages);

      // If the updated shortage is not on the current page, adjust the current page
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Update the shortages state with the new list (consider sorting here if needed)
      setShortages(response.shortages);
    } catch (error) {
      console.error("Error updating shortage:", error);
    }
  };

  const handleEditShortage = (shortageId) => {
    const shortageToEdit = shortages.find(
      (shortage) => shortage._id === shortageId
    );
    setModalFormData({
      name: shortageToEdit.name,
      alternatives: shortageToEdit.alternatives,
      form: shortageToEdit.form,
      packSize: shortageToEdit.packSize,
    });
    setEditingShortageId(shortageId);
    openModal();
  };

  const handleDeleteShortage = (shortageId) => {
    setSelectedShortageIdToDelete(shortageId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);

    if (selectedShortageIdToDelete) {
      try {
        const isSuccess = await shortageApi.deleteShortage(
          selectedShortageIdToDelete
        );

        if (isSuccess) {
          // Remove the deleted shortage from the state
          setShortages((prevShortages) =>
            prevShortages.filter(
              (shortage) => shortage._id !== selectedShortageIdToDelete
            )
          );
        }
      } catch (error) {
        console.error("Error deleting shortage:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedShortageIdToDelete(null);
  };

  useEffect(() => {
    // Fetch data after successful deletion
    if (!isDeleteModalOpen) {
      fetchShortages(currentPage, sortCriteria, sortOrder, search);
    }
  }, [isDeleteModalOpen]);

  return (
    <div className=" w-full h-screen flex flex-col bg-gray-100 md:flex-row">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Upper Control */}
        <div className="flex flex-col items-center justify-between bg-slate-300 p-4 gap-2 md:flex-row md:gap-5">
          <div className="w-full flex">
            {/* Search Input */}
            <div className="flex-grow">
              <input
                type="text"
                value={search}
                onChange={handleSearchTermChange}
                placeholder="Search by shortage or alternatives"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              />
            </div>
          </div>
          <div className="w-full flex justify-between">
            {/* Create Shortage Button */}
            <div>
              <button
                onClick={openModal}
                className="bg-emerald-600 text-white p-2 rounded-md flex items-center whitespace-nowrap hover:bg-emerald-800 md:px-4 md:py-2"
              >
                <AddIcon className="w-4 h-4 mr-2" /> Add Shortage
              </button>
            </div>
            {/* Sort Criteria */}
            <div className="w-full flex items-center justify-end space-x-2 ml-4">
              <label className="text-gray-600 font-bold whitespace-nowrap">
                Sort By:
              </label>
              <select
                value={sortCriteria}
                onChange={handleSortCriteriaChange}
                className=" md:px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="name">Shortage Name</option>
                <option value="alternatives">Alternative</option>
              </select>
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="md:px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="w-full flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 space-y-10 md:p-4">
          <table className="w-full border-2 border-slate-800">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-2 border-b w-[20%]">Shortage</th>
                <th className="py-2 border-b w-[25%]">Alternative</th>
                <th className="py-2 border-b w-[25%]">Form</th>
                <th className="py-2 border-b w-[10%]">Pack Size</th>
                <th className="py-2 border-b w-[10%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }, (_, index) => {
                const shortage = shortages[index]; // Get the corresponding shortage if it exists
                return (
                  <tr key={index} className="text-center odd:bg-gray-200">
                    <td className="py-2">{shortage?.name || ""}</td>
                    <td className="py-2">{shortage?.alternatives || ""}</td>
                    <td className="py-2">{shortage?.form || ""}</td>
                    <td className="py-2">{shortage?.packSize || ""}</td>
                    <td className="py-2 flex justify-center ">
                      <div className="group">
                        <button
                          onClick={() => handleEditShortage(shortage?._id)}
                          className={`relative bg-yellow-500 p-px rounded-md mr-2 group-hover:bg-yellow-600 ${
                            !shortage ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <EditIcon />
                          <span className="hidden absolute bottom-0 -left-8 text-sm text-white bg-slate-400 p-0.5 rounded-sm group-hover:block">
                            Edit
                          </span>
                        </button>
                      </div>
                      <div className="group">
                        <button
                          onClick={() => handleDeleteShortage(shortage?._id)}
                          className={`relative bg-red-500 text-white p-px rounded-md group-hover:bg-red-600 ${
                            !shortage ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <DeleteIcon />
                          <span className="hidden absolute bottom-0 -right-10 text-sm text-white bg-slate-400 p-0.5 rounded-sm group-hover:block">
                            Delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center bg-slate-300 py-2 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 ml-2 bg-slate-700 rounded-md hover:bg-gray-500"
          >
            <PrevIcon className="w-4 h-4" />
          </button>

          <select
            value={currentPage}
            onChange={(e) => handleGotoPage(parseInt(e.target.value))}
            className="p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500 mx-2"
          >
            {pageNumbers.map((page) => (
              <option key={page} value={page}>
                {page}
              </option>
            ))}
          </select>

          <span className="text-black">of {totalPages}</span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 ml-2 bg-slate-700 rounded-md hover:bg-gray-500"
          >
            <NextIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Modals */}
        <ShortageModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          formData={modalFormData}
          handleInputChange={handleInputChange}
          handleCreateOrUpdateShortage={handleCreateOrUpdateShortage}
          editingShortageId={editingShortageId}
        />
        <ShortageModalDelete
          isDeleteOpen={isDeleteModalOpen}
          onDeleteCancel={handleCancelDelete}
          onDeleteConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default ShortageList;
