import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../../services/authService";
import logo from "../../assets/logo/chemys-logo.png";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/");
  };
  return (
    <div className="w-full h-28 flex items-center place-content-between bg-slate-800 px-2 md:w-36 md:h-full md:p-4 md:flex-col">
      <div className="w-full flex items-center justify-center md:flex-col md:gap-5">
        <div className="w-24 h-24 bg-slate-200 p-2 rounded-2xl md:w-full md:h-full">
          <img src={logo} alt="chemys limited" className="w-full h-full" />
        </div>
        <nav>
          <ul className="flex items-center gap-2 md:flex-col md:gap-5">
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
                to="/shortage"
                className="text-white hover:bg-gray-700 px-3 py-2 rounded whitespace-nowrap"
              >
                UK Shortage
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-full flex justify-end md:justify-center">
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
