import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {Link} from "react-router-dom";

const payments = [
  {
    id: 1,
    name: "Miraliba Jadeja",
    phone: "123-456-7890",
    date: "2024-04-01",
    status: "Completed",
    amount: "Rs. 2000",
  },
  {
    id: 2,
    name: "Rahul Verma",
    phone: "987-654-3210",
    date: "2024-04-02",
    status: "Awaiting",
    amount: "Rs. 1500",
  },
  {
    id: 3,
    name: "Nirali Shah",
    phone: "111-222-3333",
    date: "2024-03-28",
    status: "Overdue",
    amount: "Rs. 1200",
  },
];
const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];

const Payment = () => {
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
          color: "#2f2f2f",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>PAYMENTS</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to="/admin-profiel">
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

        {/* Status Cards */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          <div
            style={{
              flex: 1,
              background: "#e4d8c4",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Completed Payments</h3>
            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Rs. 10,000
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#e4d8c4",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Awaiting Payments</h3>
            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Rs. 3,000
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "#e4d8c4",
              padding: "20px",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Overdue</h3>
            <p
              style={{
                marginTop: "10px",
                fontWeight: "bold",
                fontSize: "18px",
              }}
            >
              Rs. 1,200
            </p>
          </div>
        </div>

        {/* Payments List */}
        <div
          style={{
            background: "#f0e8d9",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <input
              type="text"
              placeholder="Search Name"
              style={{
                padding: "6px",
                borderRadius: "4px",
                border: "1px solid #ccc",
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
              Add Payment
            </button>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#ded2ba",
            }}
          >
            <thead style={{ backgroundColor: "#9a8a71", color: "white" }}>
              <tr>
                <th style={{ padding: "10px" }}>Client</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  style={{
                    textAlign: "center",
                    borderTop: "1px solid #cbbf9f",
                  }}
                >
                  <td style={{ padding: "10px" }}>{payment.name}</td>
                  <td>{payment.phone}</td>
                  <td>{payment.date}</td>
                  <td>{payment.status}</td>
                  <td style={{ fontWeight: "bold" }}>{payment.amount}</td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                      }}
                    >
                      <FiEdit2 style={{ cursor: "pointer" }} />
                      <FiTrash2 style={{ cursor: "pointer" }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payment;
