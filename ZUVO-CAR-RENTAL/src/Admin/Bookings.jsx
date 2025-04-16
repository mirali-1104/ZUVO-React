import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
const chartData = [
  { month: "Jan", done: 300, cancelled: 200 },
  { month: "Feb", done: 400, cancelled: 250 },
  { month: "Mar", done: 350, cancelled: 180 },
  { month: "Apr", done: 450, cancelled: 230 },
  { month: "May", done: 500, cancelled: 300 },
  { month: "Jun", done: 400, cancelled: 240 },
  { month: "Jul", done: 520, cancelled: 300 },
  { month: "Aug", done: 600, cancelled: 350 },
  { month: "Sep", done: 480, cancelled: 280 },
  { month: "Oct", done: 550, cancelled: 320 },
  { month: "Nov", done: 470, cancelled: 260 },
  { month: "Dec", done: 390, cancelled: 210 },
];
const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];
const Bookings = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "linear-gradient(to bottom, #e3ddcf, #c5bfb3)",
          padding: "30px 20px",
          flexShrink: 0,
          height: "100vh",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "50px",
            color: "#41372d",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          🛠 Admin
        </h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "20px" }}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "#2e2b25",
                  fontWeight: "500",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  transition: "background 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6cfb4";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span style={{ marginRight: "10px" }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "#41372D",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>
            BOOKINGS
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to="/admin-profile">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "gray",
                }}
              ></div>
            </Link>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>Admin Name</p>
              <p style={{ fontSize: "12px" }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Booking Stats */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            color: "#41372D",
            borderRadius: "10px",
          }}
        >
          {[
            { label: "Upcoming Bookings", value: 145 },
            { label: "Pending Bookings", value: 100 },
            { label: "Cancelled Bookings", value: 54 },
            { label: "Completed Bookings", value: 560 },
          ].map((stat, i) => (
            <div
              key={i}
              style={{ background: "#dcd3c3", padding: "16px", flex: 1 }}
            >
              <h4 style={{ fontSize: "14px" }}>{stat.label}</h4>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart and Filter */}
        <div style={{ display: "flex", gap: "16px", borderRadius: "10px" }}>
          <div
            style={{
              background: "#dcd3c3",
              padding: "16px",
              flex: 2,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h4>Booking Overview</h4>
              <select style={{ background: "#41372D", paddingRight: "10px" }}>
                <option>This Year</option>
              </select>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="done" fill="#d84a30" />
                <Bar dataKey="cancelled" fill="#3a3028" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Car Bookings Table */}
        <div
          style={{
            background: "#dcd3c3",
            padding: "16px",
            borderRadius: "10px",
          }}
        >
          <h4>Car Bookings</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "8px 0",
            }}
          >
            <input
              type="text"
              placeholder="Search Name"
              style={{ padding: "10px", width: "200px", height: "40px" }}
            />
            <select
              style={{
                padding: "10px",
                background: "#41372d",
                width: "300px",
                height: "40px",
                marginRight: "10px",
              }}
            >
              <option>Car Type</option>
            </select>
            <select
              style={{
                padding: "10px",
                background: "#41372d",
                width: "300px",
                height: "40px",
                marginRight: "10px",
              }}
            >
              <option>Status</option>
            </select>
            <button
              style={{
                backgroundColor: "#3a3028",
                color: "white",
                padding: "6px 12px",
                background: "#41372d",
                height: "40px",
                marginRight: "10px",
              }}
            >
              Add Booking
            </button>
          </div>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              borderRadius: "10px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#a99d8f",
                  color: "white",
                  borderRadius: "10px",
                }}
              >
                {[
                  "Booking Id",
                  "Booking Date",
                  "Client Name",
                  "Car Model",
                  "Plan",
                  "Date",
                  "Driver",
                  "Payment",
                  "Status",
                ].map((head, i) => (
                  <th key={i} style={{ padding: "8px", textAlign: "left" }}>
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(8)].map((_, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #ccc",
                    color: "black",
                    marginRight: "10px",
                    marginLeft: "10px",
                    fontSize: "15px",
                  }}
                >
                  <td>ABC101</td>
                  <td>26 Feb 2025</td>
                  <td>Miraliba Jadeja</td>
                  <td>Maruti Suzuki Ertiga</td>
                  <td>2 Days</td>
                  <td>26 Feb 25 - 2 Mar 25</td>
                  <td>No</td>
                  <td>{i % 2 === 0 ? "Paid" : "Pending"}</td>
                  <td>{["Returned", "Ongoing", "Cancelled"][i % 3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
