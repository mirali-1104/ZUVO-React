import React from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Import the profile icon from react-icons
import "../styles/Navbar.css";

const NavbarP = () => {

  return (
    <nav className="navbar">
      <div className="logo">
        <img src="logo.png" alt="logo" height="60px" />
      </div>
      <div className="cta-buttons">
        <Link to="/profile" className="profile-link">
          <button className="userName">Logout</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavbarP;
