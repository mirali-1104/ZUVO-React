import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {Link} from "react-router-dom";

const clients = [
  {
    id: 1,
    name: "Miraliba Jadeja",
    phone: "123-456-7890",
    address: "Street ABC, Plot 23, City, State",
    earned: "Rs. 2000"
  },
  // Repeat as needed...
];
const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];
const Clients = () => {
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
              CLIENTS
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

          {/* Search and Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <input
              type="text"
              placeholder="Search Name"
              style={{
                padding: "8px",
                width: "250px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                color: "white",
              }}
            />
            <button
              style={{
                backgroundColor: "#5C4B3D",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              Add Client
            </button>
          </div>

          {/* Client Table */}
          <div
            style={{
              backgroundColor: "#e4dbc2",
              borderRadius: "8px",
              padding: "12px",
              overflowX: "auto",
            }}
          >
            {/* Table Header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr 1fr",
                fontWeight: "bold",
                padding: "8px 0",
                backgroundColor: "#9c8c74",
                color: "#fff",
                borderRadius: "6px",
              }}
            >
              <div style={{ paddingLeft: "8px" }}>Client</div>
              <div>Phone</div>
              <div>Address</div>
              <div>Document</div>
              <div>Earned</div>
              <div>Action</div>
            </div>

            {/* Client Rows */}
            {clients.map((client) => (
              <div
                key={client.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr 1fr",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid #c2b79e",
                  color: "black",
                }}
              >
                <div style={{ paddingLeft: "8px" }}>{client.name}</div>
                <div>{client.phone}</div>
                <div>{client.address}</div>
                <div>
                  <button
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#41372d",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    View
                  </button>
                </div>
                <div style={{ fontWeight: "bold" }}>{client.earned}</div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <FiEdit2 style={{ cursor: "pointer" }} />
                  <FiTrash2 style={{ cursor: "pointer" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
