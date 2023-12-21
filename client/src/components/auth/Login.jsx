// crud-admin/client/src/components/auth/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    try {
      const data = await login(credentials.username, credentials.password);

      if (data.success) {
        console.log("Login successful");

        // Redirect to the dashboard after storing the username in localStorage
        localStorage.setItem("username", credentials.username);
        navigate("/dashboard");
      } else {
        console.log("Login failed:", data.message);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
          Login
        </h2>
        <form className="flex flex-col space-y-4">
          <label>
            <span className="block text-md font-medium text-gray-600">
              Username:
            </span>
            <input
              type="text"
              name="username"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
              value={credentials.username}
              onChange={handleChange}
            />
          </label>
          <label>
            <span className="block text-md font-medium text-gray-600">
              Password:
            </span>
            <input
              type="password"
              name="password"
              className="w-full border rounded-md p-2 focus:outline-none focus:ring focus:border-blue-500"
              value={credentials.password}
              onChange={handleChange}
            />
          </label>
          <button
            type="button"
            className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
