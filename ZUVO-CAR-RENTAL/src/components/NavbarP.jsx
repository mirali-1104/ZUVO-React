import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavbarP = () => {
  return (
    <nav
      style={{
        backgroundColor: "#d9d0b2", // beige background
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "2px solid #1f1f1f",
        position: "fixed",
        width:"100%",
        zIndex:"1",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="logo.png" alt="logo" height="40px" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link to="/profile">
          <button
            style={{
              backgroundColor: "#3b2f23", // dark brown
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Name
          </button>
        </Link>
        <FaUserCircle size={32} color="#3b2f23" />
      </div>
    </nav>
  );
};

export default NavbarP;
