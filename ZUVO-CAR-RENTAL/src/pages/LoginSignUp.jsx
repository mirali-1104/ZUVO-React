import React, { useState } from "react";
import Login from "../components/LoginSignup/Login";
import SignUp from "../components/LoginSignup/SignUp";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="loginbg.png" alt="Car" className="car-image" />
      </div>
      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <SignUp toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default LoginSignup;
