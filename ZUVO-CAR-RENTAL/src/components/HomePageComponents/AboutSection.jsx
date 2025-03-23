import React from "react";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/AboutSection.css";

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <h2>About us</h2>
      <h1>Welcome to ZUVO</h1>
      <p>Reliable cars, remarkable journeys.</p>
      <p>
        Your trusted partner for reliable and affordable car rental services.{" "}
        <br />
        Whether you're planning a business trip, a weekend getaway,
        <br /> or simply need a vehicle for your daily commute, we are here to
        make your journey seamless and enjoyable.
      </p>
      <div className="car-images">
        <img src="AboutCar.png" alt="Car 1" />
      </div>
    </section>
  );
};

export default AboutSection;
