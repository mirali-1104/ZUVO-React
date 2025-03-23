import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/LoginSignup/Login";
import SignUp from "../components/LoginSignup/SignUp";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/LoginSignUp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const goBack = () => {
    navigate("/"); // Assuming "/" is your home page route
  };

  return (
    <div className="container">
      <div className="left-section">
        <img src="loginbg.png" alt="Car" className="car-image" />
      </div>
      <FontAwesomeIcon
        icon={faArrowLeft}
        onClick={goBack}
        className="back-icon"
      />
      {isLogin ? (
        <Login toggleForm={toggleForm} />
      ) : (
        <SignUp toggleForm={toggleForm} />
      )}
    </div>
  );
};

export default LoginSignup;
