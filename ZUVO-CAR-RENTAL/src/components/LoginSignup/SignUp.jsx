import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import axios from "axios";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignUp = ({ toggleForm }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/users/register", {
        email: formData.email,
        password: formData.password,
      });

      setSuccess(res.data.message);
      setFormData({ email: "", password: "", confirmPassword: "" });

      // Show success toast
      toast.success("✅ Registration successful! You can now login.", {
        position: "top-center",
        autoClose: 5000,
      });

      // Optionally toggle to login form after successful registration
      setTimeout(() => {
        toggleForm();
      }, 2000);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="right-section">
      <img src="logo.png" alt="Logo" className="logo" />
      <hr />
      <h2 className="welcome-text">Join Us 😃</h2>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password (min 6 characters)</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Enter your password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength="6"
            placeholder="Confirm your password"
          />
        </div>
        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "Registering..." : "Sign Up"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {success && <p className="success-text">{success}</p>}

      <div className="divider">
        <span>Or</span>
      </div>
      <button className="google-button">
        <FaGoogle /> Sign up with Google
      </button>
      <button className="facebook-button">
        <FaFacebook /> Sign up with Facebook
      </button>
      <p className="toggle-text">
        Already have an account?{" "}
        <span className="toggle-link" onClick={toggleForm}>
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUp;
