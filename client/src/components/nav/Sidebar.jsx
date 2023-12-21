import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/authService";
import logo from "../../assets/logo/chemys-logo.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear local storage
    logout();

    // Redirect to login page
    navigate("/");
  };
  return (
    <div className="w-36 h-full flex flex-col items-center place-content-between bg-slate-800 p-4">
      <div className="flex flex-col gap-5">
        <div className="bg-slate-200 p-2 rounded-2xl">
          <img src={logo} alt="chemys limited" />
        </div>
        <nav>
          <ul className="flex flex-col items-center gap-5">
            <li>
              <Link
                to="/dashboard"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/product"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded whitespace-nowrap"
              >
                Core Portfolio
              </Link>
            </li>
            <li>
              <Link
                to="/shortage"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded whitespace-nowrap"
              >
                UK Shortage
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
