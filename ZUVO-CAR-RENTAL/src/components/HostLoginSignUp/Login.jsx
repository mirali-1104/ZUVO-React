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
  timeout: 10000, // 10 second timeout
  // Add retry logic
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Only reject if server error
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
        // Debug the host info we're getting from the server
        console.log("Host data from server:", response.data.host);

        // Make sure the host object has the necessary fields
        const hostData = {
          id: response.data.host.id,
          name: response.data.host.name,
          email: response.data.host.email,
        };

        console.log("Formatted host data for storage:", hostData);
        const token = response.data.token;

        // Clear any existing data first
        localStorage.removeItem("host");
        localStorage.removeItem("hostData");
        localStorage.removeItem("authToken");

        // Then set the new data
        localStorage.setItem("authToken", token);
        localStorage.setItem("hostData", JSON.stringify(hostData));

        // Verify the token before redirecting
        try {
          // Need to format token with Bearer prefix for authentication to work
          const authHeader = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
          console.log("Verifying token before redirect");

          // Add a small delay to ensure token is properly stored
          await new Promise((resolve) => setTimeout(resolve, 500));

          const verifyResponse = await axios.get(
            "http://localhost:5000/api/host/debug-token",
            {
              headers: {
                Authorization: authHeader,
              },
            }
          );

          console.log("Token verification result:", verifyResponse.data);

          if (verifyResponse.data.verified) {
            // Show success message
            toast.success("Login successful!", {
              position: "top-center",
            });

            // Redirect to host dashboard
            navigate("/host-page");
          } else {
            console.error("Token verification failed:", verifyResponse.data);
            toast.error("Authentication error. Please try again.", {
              position: "top-center",
            });
          }
        } catch (verifyError) {
          console.error("Token verification error:", verifyError);
          toast.error("Could not verify your login. Please try again.", {
            position: "top-center",
          });
        }
      } else {
        toast.error(response.data.error || "Login failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error cases
      if (error.response) {
        if (
          error.response.status === 403 &&
          error.response.data.isVerified === false
        ) {
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
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Network error details:", error.request);
        toast.error(
          "Cannot connect to server. Please check if the backend is running.",
          {
            position: "top-center",
          }
        );
      } else {
        toast.error(
          `Network error: ${error.message}. Please try again later.`,
          {
            position: "top-center",
          }
        );
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
