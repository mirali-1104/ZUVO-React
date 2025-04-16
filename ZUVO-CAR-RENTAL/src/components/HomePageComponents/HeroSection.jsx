import React from "react";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/HeroSection.css";

const PromoBanner = () => {
  return (
    <div className="promo-banner">
      <div className="promo-content">
        <div className="promo-text">
          <p className="promo-subtitle">Plan your trip now</p>
          <h1 className="promo-title">
            Save big with our <span className="brand-name">ZUVO</span>
          </h1>
          <p className="promo-description">
            Rent the car of your dreams. Unbeatable prices, unlimited miles,
            flexible pick-up options and much more.
          </p>
          <div className="promo-buttons">
            <button className="btn btn-primary">Book Ride</button>
            <button className="btn btn-secondary">Learn More</button>
          </div>
        </div>
        <div className="promo-image">
          <img
            src="/HomeCar1.png"
            alt="Suzuki Fronx SUV"
            className="car-image1"
          />
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
