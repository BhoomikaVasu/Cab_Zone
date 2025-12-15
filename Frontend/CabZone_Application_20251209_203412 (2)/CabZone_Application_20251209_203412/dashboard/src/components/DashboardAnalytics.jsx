import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const DashboardAnalytics = () => {
  // Dummy data - Replace later with live API
  const kpis = {
    totalDrivers: 32,
    totalVehicles: 25,
    verifiedDocs: 140,
    expiringDocs: 6,
  };

  const tripsData = [
    { name: "Mon", trips: 20 },
    { name: "Tue", trips: 35 },
    { name: "Wed", trips: 28 },
    { name: "Thu", trips: 48 },
    { name: "Fri", trips: 52 },
    { name: "Sat", trips: 30 },
    { name: "Sun", trips: 22 },
  ];

  const driverStatusData = [
    { name: "Active", value: 20 },
    { name: "Idle", value: 7 },
    { name: "On Leave", value: 5 },
  ];

  const COLORS = ["#0088FE", "#FF8042", "#FFBB28"];

  return (
    <div style={{ padding: "1rem" }}>

      {/* KPI CARDS */}
      <div style={{ display: "flex", gap: "20px" }}>
        <div className="kpi-card">🚘 Vehicles: {kpis.totalVehicles}</div>
        <div className="kpi-card">👨‍✈️ Drivers: {kpis.totalDrivers}</div>
        <div className="kpi-card">✅ Verified Docs: {kpis.verifiedDocs}</div>
        <div className="kpi-card urgent">⚠️ Expiring Docs: {kpis.expiringDocs}</div>
      </div>

      {/* 2 CHARTS SECTION */}
      <div style={{ display: "flex", marginTop: "25px", gap: "30px" }}>

        {/* Line Chart - Trips Trend */}
        <div style={{ width: "50%", height: 300, background: "#0e1726", padding: "15px", borderRadius: "10px" }}>
          <h3 style={{ color: "white" }}>Weekly Trips Trend</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tripsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line dataKey="trips" stroke="lightblue" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart - Driver Status */}
        <div style={{ width: "50%", height: 300, background: "#0e1726", padding: "15px", borderRadius: "10px" }}>
          <h3 style={{ color: "white" }}>Driver Status</h3>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={driverStatusData} dataKey="value" outerRadius={100}>
                {driverStatusData.map((_entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* KPI Card styles */}
      <style>
        {`
        .kpi-card {
          padding: 15px;
          background: #0e1726;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
          width: 200px;
          text-align: center;
        }
        .urgent {
          background: #ff5b5b;
          color: white;
        }
        `}
      </style>

    </div>
  );
};

export default DashboardAnalytics;
