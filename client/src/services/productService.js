// crud-admin/client/src/services/productService.js

const API_BASE_URL = "http://localhost:5000/api/auth/products";

export const fetchProducts = async ({
  page,
  limit,
  criteria,
  order,
  searchTerm,
}) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}?page=${page}&limit=${limit}&criteria=${criteria}&order=${order}&search=${searchTerm}`
    );

    const data = await response.json();
    return {
      products: data.products,
      totalItems: data.totalItems,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchTotalProducts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-items`);
    const { totalItems } = await response.json();
    console.log("Total products response:", totalItems); // Log the total items
    return totalItems;
  } catch (error) {
    console.error("Error fetching total products:", error);
    throw error;
  }
};

export const fetchIngredientsData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/ingredients-data`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ingredients data:", error);
    throw error;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const newProduct = await response.json();
    return newProduct;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (productId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const updatedProduct = await response.json();
    return updatedProduct;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${productId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error(`Error deleting product with ID ${productId}`);
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
