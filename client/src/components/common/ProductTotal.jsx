// crud-admin/client/src/components/common/ProductTotal.jsx

import React, { useEffect, useState } from "react";
import { fetchTotalProducts } from "../../services/productService";

const ProductTotal = ({ onTotalProductsFetched }) => {
  useEffect(() => {
    fetchTotalProducts()
      .then((totalProducts) => onTotalProductsFetched(totalProducts))
      .catch((error) => console.error("Error fetching total products:", error));
  }, [onTotalProductsFetched]);

  return null; // This component doesn't render anything
};

export default ProductTotal;
