// crud-admin/client/src/services/authService.js

const apiUrl = import.meta.env.VITE_API_AUTH;

export const login = async (username, password) => {
  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Login successful");
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      return { success: true };
    } else {
      console.log("Login failed:", data.message);
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // Simplify by using double negation to convert to boolean
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
};

export const getUserInfo = async () => {
  try {
    const response = await fetch(`${apiUrl}/user-info`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user information:", error);
    throw error;
  }
};
