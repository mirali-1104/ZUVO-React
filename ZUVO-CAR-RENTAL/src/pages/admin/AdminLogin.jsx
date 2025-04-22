import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/admin/login", {
        email,
        password
      });

      // Store token in localStorage
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));

      // Redirect to admin dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error || "An error occurred during login"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#d8d0b2",
          padding: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid skyblue",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <img src="/logo.png" alt="Zuvo Logo" style={{ height: "40px" }} />
          <nav style={{ display: "flex", gap: "25px" }}>
            <Link to="/" style={navStyle}>
              Home
            </Link>
            <Link to="/admin/login" style={navStyle}>
              Admin Login
            </Link>
          </nav>
        </div>
        <Link to="/">
          <FaUserCircle size={40} color="#3d342a" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      {/* Login Form */}
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "30px",
          backgroundColor: "#d8d0b2",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "30px" }}>Admin Login</h2>
        
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "10px",
              borderRadius: "4px",
              marginBottom: "20px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
              required
            />
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#3d342a",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

const navStyle = {
  textDecoration: "none",
  color: "#2f2f2f",
  fontWeight: "bold",
};

export default AdminLogin; 