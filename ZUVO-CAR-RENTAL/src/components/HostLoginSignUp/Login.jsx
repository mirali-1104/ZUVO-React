import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";

// Create axios instance with default config
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

const HostLogin = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", formData.email);
      const response = await api.post("/host/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("host", JSON.stringify(response.data.host));

        // Show success message
        toast.success("Login successful!", {
          position: "top-center",
        });

        // Redirect to host dashboard
        navigate("/host-page");
      } else {
        toast.error(response.data.error || "Login failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error cases
      if (error.response) {
        if (error.response.status === 403 && error.response.data.isVerified === false) {
          toast.error(
            <div>
              Please verify your email before logging in
              <br />
              <button
                onClick={async () => {
                  try {
                    await api.post("/host/resend-verification", {
                      email: formData.email,
                    });
                    toast.success("Verification email resent!", {
                      position: "top-center",
                    });
                  } catch (err) {
                    toast.error("Failed to resend verification email", {
                      position: "top-center",
                    });
                  }
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  padding: 0,
                  marginTop: "5px",
                }}
              >
                Resend verification email
              </button>
            </div>,
            {
              position: "top-center",
            }
          );
        } else {
          toast.error(error.response.data.error || "Login failed", {
            position: "top-center",
          });
        }
      } else {
        toast.error("Network error. Please try again later.", {
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    // Implement forgot password functionality
    toast.info("Forgot password functionality coming soon!", {
      position: "top-center",
    });
  };

  return (
    <div className="right-section">
      <img src="logo.png" alt="Logo" className="logo" />
      <hr />
      <h2 className="welcome-text">Welcome Back Host 😃</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
            minLength="6"
          />
        </div>
        <div className="form-group forgot-password">
          <a href="#" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Sign In as Host"}
        </button>
      </form>

      <div className="divider">
        <span>Or</span>
      </div>
      <button className="google-button">
        <FaGoogle /> Sign in with Google
      </button>
      <button className="facebook-button">
        <FaFacebook /> Sign in with Facebook
      </button>
      <p className="toggle-text">
        Don't have an account?{" "}
        <span className="toggle-link" onClick={toggleForm}>
          Sign Up
        </span>
      </p>
    </div>
  );
};

export default HostLogin;
