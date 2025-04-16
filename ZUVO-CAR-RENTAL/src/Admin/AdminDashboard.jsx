import React from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  Legend,
} from "recharts";

const bookingData = [
  { name: "Jan", value: 800 },
  { name: "Feb", value: 650 },
  { name: "Mar", value: 700 },
  { name: "Apr", value: 600 },
  { name: "May", value: 400 },
  { name: "Jun", value: 600 },
  { name: "Jul", value: 950 },
  { name: "Aug", value: 1200 },
  { name: "Sep", value: 850 },
  { name: "Oct", value: 900 },
  { name: "Nov", value: 700 },
  { name: "Dec", value: 680 },
];

const pieData = [
  { name: "Hired", value: 52 },
  { name: "Pending", value: 27 },
  { name: "Cancelled", value: 21 },
];

const COLORS = ["#58A06E", "#D3A048", "#DA524E"];

const carTypes = [
  { name: "Baleno", percent: 30, img: "/Model1.png" },
  { name: "Ertiga", percent: 25, img: "/Model2.png" },
  { name: "Swift", percent: 50, img: "/Model3.png" },
  { name: "Breeza", percent: 35, img: "/Model4.png" },
  { name: "S-Presso", percent: 45, img: "/Model5.png" },
  { name: "S-Presso", percent: 46, img: "/Model6.png" },
];

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];
const AdminDashboard = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        overflow: "hidden",
        background: "41372D",
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
          boxShadow: "2px 0 10px #41372D",
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
          background: "linear-gradient(to bottom right, #41372D, #41372D)",
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
            DASHBOARD
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

        {/* Revenue Cards */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
                padding: "16px",
                flex: 1,
                color: "#41372D",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ fontSize: "14px" }}>Total Revenue</h3>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>₹ 2,60,829</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 2,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Booking Overview</h3>
            <BarChart width={600} height={200} data={bookingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#332f2b" />
            </BarChart>
            <h3 style={{ marginTop: "20px" }}>Booking Trends</h3>
            <LineChart width={600} height={200} data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3
              style={{
                color: "#41372D",
                borderRadius: "10px",
              }}
            >
              Rent Status
            </h3>
            <PieChart
              width={300}
              height={300}
              style={{
                justifyContent: "center",
              }}
            >
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <ul
              style={{ fontSize: "14px", marginTop: "10px", color: "#41372D" }}
            >
              <li>🟢 Hired - 52%</li>
              <li>🟡 Pending - 27%</li>
              <li>🔴 Cancelled - 21%</li>
            </ul>
          </div>
        </div>

        {/* Reminders and Activities */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>
              Reminders <button style={{ float: "right" }}>+</button>
            </h3>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#dcd6c8",
                  marginTop: "8px",
                  padding: "8px",
                  border: "1px solid #41372D",
                  borderRadius: "10px",
                }}
              >
                Inspect and service the fleet vehicles.
                <br />
                2025-10-10
              </div>
            ))}
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 2,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Recent Activities</h3>
            <div style={{ fontSize: "14px", padding: "10px" }}>
              <p>
                <strong>Today</strong>
              </p>
              <p>
                ✅ Alice Johnson completed a booking for Toyota Corolla (TX1234)
                - 10:15AM
              </p>
              <p>
                🕒 Rob Smith's booking for Honda Civic (RX5678) is pending
                payment - 10:45PM
              </p>
              <p>
                <br />
                <strong>Yesterday</strong>
              </p>
              <p>
                ✅ Alice Johnson completed a booking for Toyota Corolla (TX1234)
                - 10:15AM
              </p>
              <p>
                🕒 Rob Smith's booking for Honda Civic (RX5678) is pending
                payment - 10:45PM
              </p>
            </div>
          </div>
        </div>

        {/* Car Availability & Car Types */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Car Availability</h3>
            <select
              style={{
                width: "100%",
                marginTop: "20px",
                marginBottom: "15px",
                background: "#41372d",
              }}
            >
              <option>Car Type</option>
            </select>
            <input
              type="date"
              style={{
                width: "100%",
                marginBottom: "8px",
                height: "35px",
                padding: "7px",
              }}
            />
            <input
              type="date"
              style={{
                width: "100%",
                marginBottom: "16px",
                height: "35px",
                padding: "7px",
              }}
            />
            <button
              style={{
                width: "100%",
                backgroundColor: "red",
                color: "white",
                padding: "8px",
              }}
            >
              Check
            </button>
          </div>

          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 3,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Car Types</h3>
            {carTypes.map((car, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={car.img}
                  alt={car.name}
                  style={{
                    width: "60px",
                    height: "40px",
                    objectFit: "fill",
                    marginRight: "10px",
                  }}
                />
                <span style={{ width: "80px" }}>{car.name}</span>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#dcd6c8",
                    height: "10px",
                    borderRadius: "10px",
                    margin: "0 10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "red",
                      height: "100%",
                      width: `${car.percent}%`,
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
                <span>{car.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
