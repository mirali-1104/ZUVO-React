import React, { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
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

const Login = ({ toggleForm }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [redirectPath, setRedirectPath] = useState("/home-after-login");

  // Check for redirect information when component mounts
  useEffect(() => {
    // If the location state has a returnTo path, use it for redirection after login
    if (location.state && location.state.returnTo) {
      // Store it for later but don't set as redirect path - we'll always go to home first
      console.log(
        "Found redirect path in location state:",
        location.state.returnTo
      );
      // Don't set redirectPath anymore, always use home-after-login
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Attempting login with:", formData.email);
      const response = await api.post("/users/login", {
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        // Store the token and user data in localStorage
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Store additional useful user info separately for easier access
        if (response.data.user) {
          const user = response.data.user;
          localStorage.setItem("userName", user.name || user.firstName || "");
          localStorage.setItem("userEmail", user.email || "");
          localStorage.setItem(
            "userPhone",
            user.phone || user.phoneNumber || ""
          );
        }

        // Show success message
        toast.success("Login successful!", {
          position: "top-center",
        });

        // Always redirect to home page after login, regardless of saved state
        console.log("Redirecting to home-after-login");
        navigate("/home-after-login");
      } else {
        toast.error(response.data.error || "Login failed", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Login error:", error);

      // Handle different error cases
      if (error.response) {
        const errorMessage = error.response.data.error || "Login failed";

        if (error.response.status === 403) {
          // Email not verified
          toast.error(
            <div>
              {errorMessage}
              <br />
              <button
                onClick={() => {
                  // Add resend verification logic here
                  console.log("Resend verification clicked");
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
        } else if (error.response.status === 401) {
          // Invalid credentials
          toast.error(errorMessage, {
            position: "top-center",
          });
        } else {
          toast.error(errorMessage, {
            position: "top-center",
          });
        }
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response from server. Please try again later.", {
          position: "top-center",
        });
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An error occurred. Please try again.", {
          position: "top-center",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    console.log("Forgot Password clicked");
    // Implement your forgot password logic here
  };

  return (
    <div className="right-section">
      <img src="logo.png" alt="Logo" className="logo" />
      <hr />
      <h2 className="welcome-text">Welcome Back 😃</h2>

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
          {isLoading ? "Logging in..." : "Sign In"}
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

export default Login;
