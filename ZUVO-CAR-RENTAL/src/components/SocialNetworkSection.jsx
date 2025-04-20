import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const SocialNetworkSection = () => {
  return (
    <div className="social-network-section">
      <h2>Connect With Us</h2>
      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          <FaLinkedin />
        </a>
      </div>
      <p>
        Have questions?{" "}
        <Link to="/query" className="query-link">
          Click here
        </Link>{" "}
        to submit your query.
      </p>
    </div>
  );
};

export default SocialNetworkSection; 