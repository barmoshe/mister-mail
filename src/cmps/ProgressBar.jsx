import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export function ProgressBar({ value, max }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (ctx) {
      const newChartInstance = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["Progress", "Remaining"],
          datasets: [
            {
              data: [value, max - value],
              backgroundColor: ["#4CAF50", "#E0E0E0"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: true,
              position: "bottom",
            },
          },
        },
      });

      // Store the new chart instance in ref
      chartInstanceRef.current = newChartInstance;
    }

    // Cleanup function to destroy the chart instance when component unmounts or is updated
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [value, max]);

  return (
    <div className="progress-bar">
      <canvas ref={chartRef} width="200" height="200"></canvas>
      <p>
        {value} / {max}
      </p>
    </div>
  );
}
