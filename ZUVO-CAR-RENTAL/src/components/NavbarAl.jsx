import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const NavbarAl = () => {
  const [userName, setUserName] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      if (user.name) {
        setUserName(user.name);
      } else {
        setShowNameModal(true);
      }
    }

    // Fetch user profile data
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await api.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.profilePicture) {
          setProfilePicture(response.data.profilePicture);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("authToken");
    console.log("Token:", token); // Debug log
    if (!token) {
      toast.error("Please log in first");
      return;
    }

    if (!newName.trim()) {
      toast.error("Please enter a valid name");
      return;
    }

    setIsLoading(true);
    try {
      console.log("Attempting to update name..."); // Debug log
      const response = await api.put(
        "/users/update-name",
        { name: newName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Update successful:", response.data); // Debug log

      // Update local storage and state
      const userData = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...userData, name: newName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUserName(newName);
      setShowNameModal(false);
      toast.success("Name updated successfully!");
    } catch (error) {
      console.error("Update name error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });

      toast.error(
        error.response?.data?.message ||
          "Failed to update name. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUserName(""); // Clear username from state
    toast.success("Logged out successfully!");
    window.location.href = "/login"; // Or use navigate() if you're using React Router v6+
  };
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    api
      .get("/users/test") // Test if backend is reachable
      .then((res) => console.log("✅ Backend connected!", res.data))
      .catch((err) => console.error("❌ Backend connection failed:", err));
  }, []);

  return (
    <>
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
              href="#booking"
              onClick={() => scrollToSection("booking")}
              style={{
                textDecoration: "none",
                color: "black",
                fontSize: "14px",
              }}
            >
              Booking
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
            <Link to="/support">
              <a
                onClick={() => scrollToSection("contact")}
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "14px",
                }}
              >
                Contact
              </a>
            </Link>
          </li>
        </ul>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            onMouseEnter={() => setShowLogout(true)}
            onMouseLeave={() => setShowLogout(false)}
            style={{ position: "relative" }}
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
              Hi, {userName || "User"}
            </button>
            {showLogout && (
              <button
                onClick={handleLogout}
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "0",
                  backgroundColor: "#fff",
                  color: "#3e3027",
                  border: "1px solid #3e3027",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  marginTop: "4px",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  zIndex: 100,
                }}
              >
                Logout
              </button>
            )}
          </div>
          <Link
            to="/profile"
            style={{ textDecoration: "none", color: "black" }}
          >
            {profilePicture ? (
              <img
                src={`http://localhost:5000${profilePicture}`}
                alt="Profile"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <FaUserCircle size={32} style={{ color: "#3e3027" }} />
            )}
          </Link>
        </div>
      </nav>

      {/* Name Input Modal */}
      {showNameModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
              maxWidth: "90%",
            }}
          >
            <h2 style={{ marginBottom: "20px" }}>Please Enter Your Name</h2>
            <form onSubmit={handleNameSubmit}>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "20px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                required
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    backgroundColor: "#3e3027",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default NavbarAl;
