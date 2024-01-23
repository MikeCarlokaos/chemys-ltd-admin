// crud-admin/client/src/services/shortageService.js

const API_BASE_URL = import.meta.env.VITE_API_SHORTAGE;

export const fetchShortages = async ({
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
      shortages: data.shortages,
      totalItems: data.totalItems,
    };
  } catch (error) {
    console.error("Error fetching shortages:", error);
    throw error;
  }
};

export const fetchTotalShortages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/total-items`);
    const { totalItems } = await response.json();
    console.log("Total shortages response:", totalItems); // Log the total items
    return totalItems;
  } catch (error) {
    console.error("Error fetching total shortages:", error);
    throw error;
  }
};
export const fetchNameData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/name-data`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching name data:", error);
    throw error;
  }
};

export const createShortage = async (formData) => {
  try {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const newShortage = await response.json();
    return newShortage;
  } catch (error) {
    console.error("Error creating shortage:", error);
    throw error;
  }
};

export const updateShortage = async (shortageId, formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${shortageId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const updatedShortage = await response.json();
    return updatedShortage;
  } catch (error) {
    console.error("Error updating shortage:", error);
    throw error;
  }
};

export const deleteShortage = async (shortageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${shortageId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      return true;
    } else {
      throw new Error(`Error deleting shortage with ID ${shortageId}`);
    }
  } catch (error) {
    console.error("Error deleting shortage:", error);
    throw error;
  }
};
