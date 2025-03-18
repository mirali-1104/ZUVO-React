import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo.png" alt="logo" height="60px" />
      </div>
      <ul className="nav-links">
        <li>
          <a href="#home" onClick={() => scrollToSection("home")}>
            Home
          </a>
        </li>
        <li>
          <a href="#booking" onClick={() => scrollToSection("booking")}>
            Booking
          </a>
        </li>
        <li>
          <a href="#about" onClick={() => scrollToSection("about")}>
            About
          </a>
        </li>
        <li>
          <a
            href="#vehicle-models"
            onClick={() => scrollToSection("vehicle-models")}
          >
            Vehicle Models
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => scrollToSection("contact")}>
            Contact
          </a>
        </li>
      </ul>
      <div className="cta-buttons">
        <button className="become-host">Become a Host</button>
        <Link to="/login" className="sign-in-link">
          <button className="sign-in">Sign In</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
