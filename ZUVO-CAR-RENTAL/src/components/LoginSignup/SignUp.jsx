import React from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";

const SignUp = ({ toggleForm }) => {
  return (
    <div className="right-section">
      <img src="logo.png" alt="Logo" className="logo" />
      <hr></hr>
      <h2 className="welcome-text">Join Us 😃</h2>
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
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Sign Up
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
        Already have an account?{" "}
        <span className="toggle-link" onClick={toggleForm}>
          Sign In
        </span>
      </p>
    </div>
  );
};

export default SignUp;
