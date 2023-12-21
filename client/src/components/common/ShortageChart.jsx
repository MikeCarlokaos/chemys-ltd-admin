// crud-admin/client/src/components/common/ShortageChart.jsx

import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { fetchNameData } from "../../services/shortageService";

const ShortageChart = () => {
  const chartRef = useRef(null);

  const updateChart = async () => {
    try {
      const data = await fetchNameData();

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      const chartData = {
        labels: data.map((item) => item.name),
        datasets: [
          {
            label: "Current Shortage",
            data: data.map((item) => item.count),
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      };

      const chartOptions = {
        scales: {
          x: {
            type: "category",
            title: {
              display: true,
              text: "Name",
            },
          },
          y: {
            type: "linear",
            title: {
              display: true,
              text: "Count",
            },
          },
        },
      };

      chartRef.current = new Chart(document.getElementById("shortage"), {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });
    } catch (error) {
      console.error("Error updating chart:", error);
    }
  };

  useEffect(() => {
    updateChart();
  }, []);

  return <canvas id="shortage" width="400" height="200"></canvas>;
};

export default ShortageChart;
