// crud-admin/client/src/components/auth/Login.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import loginBg from "../../assets/images/admin-login-bg.png";

function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
      setLoading(true);
      setError(null);

      const data = await login(credentials.username, credentials.password);

      if (data.success) {
        console.log("Login successful");
        localStorage.setItem("username", credentials.username);
        navigate("/dashboard");
      } else {
        console.log("Login failed:", data.message);
        setError("Login failed. Please check your username and password.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${loginBg})` }}
      className="min-h-screen flex items-center justify-center bg-center"
    >
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
            className={`bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-500 ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                Logging in
                <span className="h-1 w-1 mx-1.5 bg-white rounded-full animate-ping"></span>
                <span className="h-1 w-1 mx-1.5 bg-white rounded-full animate-ping [animation-delay:0.3s]"></span>
                <span className="h-1 w-1 mx-1.5 bg-white rounded-full animate-ping [animation-delay:0.7s]"></span>
              </div>
            ) : (
              "Log in"
            )}
          </button>
          {error && (
            <div className="text-red-500 text-sm font-medium mt-2">{error}</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
