// crud-admin/client/src/App.jsx

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import { isAuthenticated } from "./services/authService";
import ShortageList from "./components/shortage/ShortageList";

function App() {
  const PrivateRoute = ({ element, redirectTo = "/" }) => {
    if (isAuthenticated()) {
      return element;
    } else {
      return <Navigate to={redirectTo} />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Dashboard />} />}
        />

        <Route
          path="/shortage"
          element={<PrivateRoute element={<ShortageList />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
