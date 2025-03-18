import React from "react";
import { FaYoutube, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/SocialNetworkSection.css";

const SocialNetworkSection = () => {
  return (
    <div className="social-network-section">
      <p>Get connected with us on Social Network</p>
      <div className="social-icons">
        <a
          href="https://www.youtube.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaYoutube size={30} color="#FF0000" />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter size={30} color="#1DA1F2" />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook size={30} color="#1877F2" />
        </a>
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram size={30} color="#E1306C" />
        </a>
      </div>
      <p>
        For Help and Support <a href="/support">Click Here</a>
      </p>
    </div>
  );
};

export default SocialNetworkSection;
