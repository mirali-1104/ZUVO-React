import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/NavbarP.css"; // Import the CSS file

const NavbarP = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setIsLoading(false);
        return;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    logout();
    setUserData(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="logo.png" alt="logo" height="40px" />
        </Link>
      </div>

      <div className="navbar-actions">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : userData ? (
          <>
            <div className="dropdown">
              <button className="profile-button">
                {userData.name || "Profile"}
              </button>
              <div className="dropdown-content">
                <Link to="/profile">My Profile</Link>
                <Link to="/bookings">My Bookings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
            <div onClick={handleProfileClick} className="profile-icon">
              {userData.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${
                    userData.profilePicture
                  }`}
                  alt="Profile"
                  className="profile-picture"
                  height="1px"
                  width="1px"
                />
              ) : (
                <FaUserCircle size={6} color="#3b2f23" />
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="auth-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="auth-button">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavbarP;
