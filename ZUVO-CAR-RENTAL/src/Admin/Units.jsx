import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {Link} from "react-router-dom";

const units = [
  {
    id: 1,
    name: "Baleno 2020",
    price: "238/hr",
    img: "/Model1.png",
  },
  {
    id: 2,
    name: "Baleno 2020",
    price: "238/hr",
    img: "/Model2.png",
  },
  {
    id: 3,
    name: "Baleno 2020",
    price: "238/hr",
    img: "/Model3.png",
  },
  {
    id: 4,
    name: "Baleno 2020",
    price: "238/hr",
    img: "/Model4.png",
  },
];
const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];
const Units = () => {
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
          background: "#f5f0e6",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1230px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}
            >
              UNITS
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to="admin-profile">
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
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    margin: 0,
                    color: "black",
                  }}
                >
                  Admin Name
                </p>
                <p style={{ fontSize: "12px", margin: 0, color: "black" }}>
                  Admin
                </p>
              </div>
            </div>
          </div>

          {/* Search Filters and Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="text"
                placeholder="Search Name"
                style={{ padding: "6px" }}
              />
              <select>
                <option>Car Type</option>
              </select>
              <select>
                <option>Status</option>
              </select>
            </div>
            <button
              style={{
                backgroundColor: "#5C4B3D",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              Add Unit
            </button>
          </div>

          {/* Units Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              width: "100%",
              color: "#41372D",
            }}
          >
            {units.map((unit) => (
              <div
                key={unit.id}
                style={{
                  borderRadius: "12px",
                  overflow: "hidden",
                  boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                  backgroundColor: "#fff",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#5C4B3D",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    color: "#41372D",
                  }}
                >
                  <img
                    src={unit.img}
                    alt={unit.name}
                    style={{ height: "100px", objectFit: "contain" }}
                  />
                </div>
                <div
                  style={{
                    padding: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h4 style={{ margin: 0 }}>{unit.name}</h4>
                    <p style={{ margin: 0 }}>{unit.price}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      color: "#5C4B3D",
                      fontSize: "18px",
                    }}
                  >
                    <FiEdit2 style={{ cursor: "pointer" }} />
                    <FiTrash2 style={{ cursor: "pointer" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Units;
