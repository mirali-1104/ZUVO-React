// src/HeroSection.jsx
import React from "react";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/HeroSection.css";

const HeroSection = () => {
  return (
    <div className="hero-section">
      <div className="hero-content">
        <h2>Plan your trip now</h2>
        <h1>
          Save <span className="brownc">big</span> with our{" "}
        </h1>
        <h1>
          <span className="brownc">ZUVO</span>
        </h1>
        <p>
          Rent the car of your dreams. Unbeatable prices, unlimited miles,
          flexible pick-up options and much more.
        </p>
        <div className="hero-buttons">
          <button className="book-ride">Book Ride</button>
          <button className="learn-more">Learn More</button>
        </div>
      </div>
      <div className="hero-image">
        <img src="HomeCar1.png" alt="Car" />
      </div>
    </div>
  );
};

export default HeroSection;
