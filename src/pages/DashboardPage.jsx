import React, { useState, useEffect } from "react";
import Chart from "chart.js/auto";
import { emailService } from "../services/email.service.js";

export function DashboardPage() {
  const [emailStats, setEmailStats] = useState(null);

  useEffect(() => {
    async function fetchEmailStats() {
      try {
        const stats = await emailService.getEmailStats();
        setEmailStats(stats);
        renderChart(stats);
      } catch (error) {
        console.error("Error fetching email statistics:", error);
      }
    }

    fetchEmailStats();

    // Cleanup function to destroy the chart when component unmounts
    return () => {
      destroyChart();
    };
  }, []);

  const renderChart = (stats) => {
    const ctx = document.getElementById("emailStatsChart");

    if (ctx && stats) {
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: Object.keys(stats),
          datasets: [
            {
              label: "Emails",
              data: Object.values(stats),
              backgroundColor: [
                "rgba(66, 133, 244, 0.5)",
                "rgba(15, 157, 88, 0.5)",
                "rgba(255, 193, 7, 0.5)",
                "rgba(220, 53, 69, 0.5)",
              ],
              borderColor: [
                "rgba(66, 133, 244, 1)",
                "rgba(15, 157, 88, 1)",
                "rgba(255, 193, 7, 1)",
                "rgba(220, 53, 69, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  };

  const destroyChart = () => {
    const chartInstance = Chart.getChart("emailStatsChart");
    if (chartInstance) {
      chartInstance.destroy();
    }
  };

  return (
    <div className="dashboard-page">
      <h2>Email Statistics</h2>
      <div className="chart-container">
        <canvas id="emailStatsChart" width="400" height="200"></canvas>
      </div>
      <button className="return-btn" onClick={() => window.history.back()}>
        Return
      </button>
    </div>
  );
}
