// crud-admin/client/src/components/dashboard/Dashboard.jsx

import React, { useState } from "react";
import Sidebar from "../nav/Sidebar";
import ShortageTotal from "../common/ShortageTotal";
import ShortageChart from "../common/ShortageChart";

function Dashboard() {
  const [totalShortages, setTotalShortages] = useState(0);

  const handleTotalShortagesFetched = (total) => {
    setTotalShortages(total);
  };

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 md:flex-row">
      <div>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between bg-slate-300 p-4">
          <h2 className="text-2xl font-semibold text-gray-800">
            Chemys Limited Shortage Inventory
          </h2>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 bg-gray-200 space-y-10">
          <div className="p-5 bg-slate-100 border-2 border-gray-500">
            <ShortageTotal
              onTotalShortagesFetched={handleTotalShortagesFetched}
            />
            <p className="text-gray-700">
              Total shortage in inventory: <strong>{totalShortages}</strong>
            </p>
            <ShortageChart />
          </div>
        </main>
        <footer className="bg-slate-300 p-4">
          <p>
            FREE DELIVERY FOR ORDERS OVER £100. DELIVERY CHARGE OF £10 + VAT FOR
            ORDERS BELOW £100{" "}
          </p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
