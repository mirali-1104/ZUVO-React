import React, { useState } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/LoginSignUp.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="loginbg.png" alt="Car" className="car-image" />
      </div>
      <div className="right-section">
        <img src="logo.png" alt="Logo" className="logo" />
        <hr></hr>
        <h2 className="welcome-text">
          {isLogin ? "Welcome Back 😃" : "Join Us 😃"}
        </h2>
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
          {isLogin && (
            <div className="form-group forgot-password">
              <a href="#" onClick={handleForgotPassword}>
                Forgot Password?
              </a>
            </div>
          )}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirm-password">Confirm Password</label>
              <input
                type="password"
                id="confirm-password"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}
          <button type="submit" className="auth-button">
            {isLogin ? "Sign In" : "Sign Up"}
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
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="toggle-link" onClick={toggleForm}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
