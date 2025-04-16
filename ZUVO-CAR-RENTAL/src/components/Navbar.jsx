import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#d8cfb3",
        padding: "10px 30px",
        fontFamily: "Arial, sans-serif",
        fontWeight: "600",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img src="logo.png" alt="logo" style={{ height: "40px" }} />
      </div>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          margin: 0,
          padding: 0,
          gap: "20px",
        }}
      >
        <li>
          <a
            href="#home"
            onClick={() => scrollToSection("home")}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "14px",
            }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={() => scrollToSection("about")}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "14px",
            }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#vehicle-models"
            onClick={() => scrollToSection("vehicle-models")}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "14px",
            }}
          >
            Vehicle Models
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={() => scrollToSection("contact")}
            style={{
              textDecoration: "none",
              color: "black",
              fontSize: "14px",
            }}
          >
            Contact
          </a>
        </li>
      </ul>
      <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
        <Link to="/becomeHost" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontSize: "14px",
              color: "black",
              fontWeight: "600",
            }}
          >
            Become a Host
          </span>
        </Link>
        <Link to="/login">
          <button
            style={{
              backgroundColor: "#3e3027",
              color: "white",
              padding: "6px 16px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Sign in
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
