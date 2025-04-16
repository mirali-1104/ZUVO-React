import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const NavbarAl = () => {
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
            style={{ textDecoration: "none", color: "black", fontSize: "14px" }}
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#booking"
            onClick={() => scrollToSection("booking")}
            style={{ textDecoration: "none", color: "black", fontSize: "14px" }}
          >
            Booking
          </a>
        </li>
        <li>
          <a
            href="#about"
            onClick={() => scrollToSection("about")}
            style={{ textDecoration: "none", color: "black", fontSize: "14px" }}
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#vehicle-models"
            onClick={() => scrollToSection("vehicle-models")}
            style={{ textDecoration: "none", color: "black", fontSize: "14px" }}
          >
            Vehicle Models
          </a>
        </li>
        <li>
          <a
            href="#contact"
            onClick={() => scrollToSection("contact")}
            style={{ textDecoration: "none", color: "black", fontSize: "14px" }}
          >
            Contact
          </a>
        </li>
      </ul>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <button
          style={{
            backgroundColor: "#3e3027",
            color: "white",
            border: "none",
            padding: "6px 16px",
            borderRadius: "6px",
            fontWeight: "bold",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Hi, Mirali
        </button>
        <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>
          <FaUserCircle size={32} style={{ color: "#3e3027" }} />
        </Link>
      </div>
    </nav>
  );
};

export default NavbarAl;
