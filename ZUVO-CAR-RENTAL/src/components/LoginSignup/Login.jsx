import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";

const Login = ({ toggleForm }) => {
  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
  };

  return (
    <div className="right-section">
      <img src="logo.png" alt="Logo" className="logo" />
      <hr></hr>
      <h2 className="welcome-text">Welcome Back 😃</h2>
      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="example@email.com"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="at least 8 characters"
            required
          />
        </div>
        <div className="form-group forgot-password">
          <a href="#" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
        <button type="submit" className="auth-button">
          Sign In
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

export default Login;
