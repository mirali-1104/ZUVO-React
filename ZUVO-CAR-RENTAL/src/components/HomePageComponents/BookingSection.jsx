import React from "react";
import "F:/RP - ZUVO/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/BookingSection.css";

const BookingSection = () => {
  return (
     <section id="booking" className="booking-section">
    <div className="booking-section">
      <h2>Book a car</h2>
      <div className="booking-form">
        <div className="form-row">
          <select className="input-field" placeholder="State">
            <option value="">Select State</option>
            <option value="state1">Gujarat</option>
            <option value="state2">Maharashtra</option>
          </select>
          <input type="text" placeholder="Location" className="input-field" />
          <input
            type="date"
            placeholder="Rent Up"
            className="input-field date-picker"
          />
          <input
            type="date"
            placeholder="Pick Up"
            className="input-field date-picker"
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Vehicle Type"
            className="input-field vtype"
          />
          <div className="checkbox-option">
            <input type="checkbox" id="home-delivery" />
            <label htmlFor="home-delivery">Home Delivery and Pick Up</label>
          </div>
          <button className="search-button">Search</button>
        </div>
      </div>
    </div>
    </section>
  );
};

export default BookingSection;
