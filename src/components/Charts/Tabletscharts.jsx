import React from "react";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import TabletTracker from "./TabletTracker";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const Tabletscharts = () => {
  // Data for bar and doughnut charts
  const regions = ["Eastern", "Northern", "Central", "Western"];
  const tabletCounts = [26, 27, 32, 21];

  const barData = {
    labels: regions,
    datasets: [
      {
        label: "Tablets",
        data: tabletCounts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: regions,
    datasets: [
      {
        label: "Number of Tablets",
        data: tabletCounts,
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#526d82", // Change x-axis text color
        },
        title: {
          display: true,
          text: "Regions",
          color: "#526d82", // Change x-axis title color
          font: {
            size: 14, // Increase font size for x-axis title
          },
        },
      },
      y: {
        ticks: {
          color: "#526d82",
        },
        title: {
          display: true,
          text: "No. of Tablets",
          color: "#526d82",
          font: {
            size: 16,
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          // Default color, no customization
        },
      },
      tooltip: {
        // Default color, no customization
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          // Default color, no customization
        },
      },
      tooltip: {
        // Default color, no customization
      },
    },
  };

  const lineData = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Preparation",
        data: [null, 0, 0, 0, 5, 15, 14, 20, 22, 18, 25, 20],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
      },
      {
        label: "Conducting Lessons",
        data: [null, 0, 0, 0, 6, 12, 16, 18, 24, 20, 27, 19],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          color: "#526d82", // Change x-axis text color
          font: {
            size: 14, // Increase font size for x-axis labels
          },
        },
        title: {
          display: true,
          text: "Months",
          color: "#526d82", // Change x-axis title color
          font: {
            size: 16, // Increase font size for x-axis title
          },
        },
      },
      y: {
        ticks: {
          color: "#526d82", // Change y-axis text color
          font: {
            size: 14, // Increase font size for y-axis labels
          },
        },
        title: {
          display: true,
          text: "Tablet Usage",
          color: "#526d82", // Change y-axis title color
          font: {
            size: 16, // Increase font size for y-axis title
          },
        },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        labels: {
          // Default color, no customization
        },
      },
      tooltip: {
        // Default color, no customization
      },
    },
  };

  return (
    <div className="container mt-4">
      {/* <h4 className="mb-4 text-center">Tablets Distribution</h4> */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header no-border">
              <h4 className="mb-4 text-center">
                Tablets Distribution Per Region
              </h4>
            </div>
            <div className="card-body">
              <div
                style={{
                  height: "400px",
                  width: "auto",
                  border: "1px solid #fff",
                  borderRadius: "6px",
                  padding: "2px",
                }}
              >
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-header no-border">
              <h4 className="mb-4 text-center">
                Tablets Distribution Per Region
              </h4>
            </div>
            <div className="card-body">
              <div
                style={{
                  height: "400px",
                  border: "1px solid #fff",
                  borderRadius: "6px",
                  padding: "2px",
                }}
              >
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabletTracker />

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header no-border">
              <h4 className="mb-4 text-center">Tablet Usage Chart - 2024</h4>
            </div>
            <div className="card-body">
              <div style={{ height: "500px" }}>
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tabletscharts;
