// crud-admin/client/src/components/common/ShortageTotal.jsx

import React, { useEffect, useState } from "react";
import { fetchTotalShortages } from "../../services/shortageService";

const ShortageTotal = ({ onTotalShortagesFetched }) => {
  useEffect(() => {
    fetchTotalShortages()
      .then((totalShortages) => onTotalShortagesFetched(totalShortages))
      .catch((error) =>
        console.error("Error fetching total shortages:", error)
      );
  }, [onTotalShortagesFetched]);

  return null; // This component doesn't render anything
};

export default ShortageTotal;
