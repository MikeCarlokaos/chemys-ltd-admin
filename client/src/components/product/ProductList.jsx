// crud-admin/client/src/components/product/ProductList.jsx

import React, { useState, useEffect, useRef } from "react";
import Modal from "../common/Modal";
import * as productApi from "../../services/productService";
import Sidebar from "../nav/Sidebar";
import ModalDelete from "../common/ModalDelete";
import AddIcon from "../../assets/icons/AddIcon";
import EditIcon from "../../assets/icons/EditIcon";
import DeleteIcon from "../../assets/icons/DeleteIcon";
import PrevIcon from "../../assets/icons/PrevIcon";
import NextIcon from "../../assets/icons/NextIcon";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [modalFormData, setModalFormData] = useState({
    name: "",
    ingredients: "",
    packSize: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProductIdToDelete, setSelectedProductIdToDelete] =
    useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortCriteria, setSortCriteria] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearchTerm] = useState("");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortCriteria, sortOrder, search]);

  const sortProducts = (products, criteria, order) => {
    return products.slice().sort((a, b) => {
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

  const fetchProducts = async (
    page = currentPage,
    criteria = sortCriteria,
    order = sortOrder,
    searchTerm = search
  ) => {
    console.log("Fetching products with search term:", searchTerm);

    try {
      const response = await productApi.fetchProducts({
        page,
        limit: itemsPerPage,
        criteria,
        order,
        searchTerm,
      });

      console.log("API response:", response);

      if (response && response.products && response.totalItems) {
        const sortedProducts = sortProducts(response.products, criteria, order);
        setProducts(sortedProducts);

        const calculatedTotalPages = Math.ceil(
          response.totalItems / itemsPerPage
        );
        setTotalPages(calculatedTotalPages);
      } else {
        console.error("Invalid data format received from the API:", response);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    await fetchProducts(newPage, sortCriteria, sortOrder, search);
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
    fetchProducts(currentPage, newSortCriteria, sortOrder, search);
  };

  const handleSortOrderChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchProducts(currentPage, sortCriteria, newSortOrder, search);
  };

  const handleInputChange = (e) => {
    setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
  };

  const handleSearchTermChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    setCurrentPage(1); // Add this line to reset to page 1
    fetchProducts(1, sortCriteria, sortOrder, newSearchTerm);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalFormData({ name: "", ingredients: "", packSize: "" });
    setEditingProductId(null);
  };

  const handleCreateOrUpdateProduct = async () => {
    const { name, ingredients, packSize } = modalFormData;

    try {
      if (editingProductId) {
        // Update the product
        const updatedProduct = await productApi.updateProduct(
          editingProductId,
          modalFormData
        );

        // Fetch the updated list of products
        const response = await productApi.fetchProducts({
          page: currentPage,
          limit: itemsPerPage,
          criteria: sortCriteria,
          order: sortOrder,
          searchTerm: search,
        });

        // Update the products state with the new list
        setProducts(response.products);
      } else {
        // Create a new product
        const newProduct = await productApi.createProduct(modalFormData);

        // Fetch the updated list of products
        const response = await productApi.fetchProducts({
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

        // If the new product is not on the current page, adjust the current page
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }

        // Update the products state with the new list
        setProducts(response.products);
      }

      closeModal();
    } catch (error) {
      console.error(
        `Error ${editingProductId ? "updating" : "creating"} product:`,
        error
      );
    }
  };

  const handleCreateProduct = async () => {
    try {
      // Create a new product
      const newProduct = await productApi.createProduct(formData);

      // Fetch the updated list of products
      const response = await productApi.fetchProducts({
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

      // If the new product is not on the current page, adjust the current page
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Update the products state with the new list (consider sorting here if needed)
      setProducts(response.products);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      // Update the product
      const updatedProduct = await productApi.updateProduct(
        editingProductId,
        formData
      );

      // Fetch the updated list of products
      const response = await productApi.fetchProducts({
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

      // If the updated product is not on the current page, adjust the current page
      if (currentPage > calculatedTotalPages) {
        setCurrentPage(calculatedTotalPages);
      }

      // Update the products state with the new list (consider sorting here if needed)
      setProducts(response.products);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleEditProduct = (productId) => {
    const productToEdit = products.find((product) => product._id === productId);
    setModalFormData({
      name: productToEdit.name,
      ingredients: productToEdit.ingredients,
      packSize: productToEdit.packSize,
    });
    setEditingProductId(productId);
    openModal();
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProductIdToDelete(productId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleteModalOpen(false);

    if (selectedProductIdToDelete) {
      try {
        const isSuccess = await productApi.deleteProduct(
          selectedProductIdToDelete
        );

        if (isSuccess) {
          // Remove the deleted product from the state
          setProducts((prevProducts) =>
            prevProducts.filter(
              (product) => product._id !== selectedProductIdToDelete
            )
          );
        }
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedProductIdToDelete(null);
  };

  useEffect(() => {
    // Fetch data after successful deletion
    if (!isDeleteModalOpen) {
      fetchProducts(currentPage, sortCriteria, sortOrder, search);
    }
  }, [isDeleteModalOpen]);

  return (
    <div className="w-full h-screen flex">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* upper controls */}
        <div className="flex items-center justify-between bg-slate-300 p-4">
          {/* create item */}
          <div className="flex items-center">
            <button
              onClick={openModal}
              className="bg-emerald-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-emerald-800"
            >
              <AddIcon className="w-4 h-4 mr-2" /> Add Product
            </button>
          </div>

          {/* search item */}
          <div className="flex-grow mx-4">
            <input
              type="text"
              value={search}
              onChange={handleSearchTermChange}
              placeholder="Search by product or ingredients"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          {/* sort item */}
          <div className="flex items-center space-x-2">
            <label className="text-gray-600">Sort By:</label>
            <select
              value={sortCriteria}
              onChange={handleSortCriteriaChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="name">Product Name</option>
              <option value="ingredients">Active Ingredients</option>
            </select>
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* table */}
        <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 bg-slate-50 space-y-10">
          <table className="w-full border-2 border-slate-800">
            <thead>
              <tr className="border-b-2 border-slate-800">
                <th className="py-2 border-b w-[40%]">Product</th>
                <th className="py-2 border-b w-[35%]">Active Ingredients</th>
                <th className="py-2 border-b w-[10%]">Pack Size</th>
                <th className="py-2 border-b w-[15%]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: itemsPerPage }, (_, index) => {
                const product = products[index]; // Get the corresponding product if it exists
                return (
                  <tr key={index} className="text-center odd:bg-gray-200">
                    <td className="py-2">{product?.name || ""}</td>
                    <td className="py-2">{product?.ingredients || ""}</td>
                    <td className="py-2">{product?.packSize || ""}</td>
                    <td className="py-2 flex justify-center">
                      <div className="group">
                        <button
                          onClick={() => handleEditProduct(product?._id)}
                          className={`relative bg-yellow-500 p-px rounded-md mr-2 group-hover:bg-yellow-600 ${
                            !product ? "opacity-50 cursor-not-allowed" : ""
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
                          onClick={() => handleDeleteProduct(product?._id)}
                          className={`relative bg-red-500 text-white p-px rounded-md group-hover:bg-red-600 ${
                            !product ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <DeleteIcon />
                          <span className="hidden absolute bottom-0 -right-12 text-sm text-white bg-slate-400 p-0.5 rounded-sm group-hover:block">
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
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-slate-700 rounded-md hover:bg-gray-500 mr-2"
          >
            <PrevIcon />
          </button>

          {/* Direct Page Navigation Dropdown */}
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

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-slate-700 rounded-md hover:bg-gray-500 ml-2"
          >
            <NextIcon />
          </button>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isModalOpen}
          closeModal={closeModal}
          formData={modalFormData}
          handleInputChange={handleInputChange}
          handleCreateOrUpdateProduct={handleCreateOrUpdateProduct}
          editingProductId={editingProductId}
        />
        <ModalDelete
          isDeleteOpen={isDeleteModalOpen}
          onDeleteCancel={handleCancelDelete}
          onDeleteConfirm={handleConfirmDelete}
        />
      </div>
    </div>
  );
};

export default ProductList;
