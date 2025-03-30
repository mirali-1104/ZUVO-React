"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import "D:/RP-ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/CarBuy.css";

function App() {
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const handleProceedToPay = () => {
    // Initialize Razorpay payment
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || "YOUR_KEY_ID",
      amount: 115600, // Amount in smallest currency unit (paise for INR)
      currency: "INR",
      name: "ZUVO",
      description: "Car Booking Payment",
      image: "/zuvo-logo.png",
      handler: (response) => {
        alert(`Payment Success! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "User Name",
        email: "user@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#5a4d41",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <div className="car-booking-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo-container">
          <img src="/logo.png" alt="ZUVO Logo" className="logo" />
        </div>
        <div className="user-section">
          <span>Name</span>
          <User className="user-icon" />
        </div>
      </nav>

      {/* Location and Check-in/Check-out Section */}
      <div className="booking-details">
        <div className="location-box">
          <div className="detail-label">Location</div>
          <div>A2500 University Center, 282 Champions Way...</div>
        </div>
        <div className="checkin-box">
          <div>
            <div className="detail-label">Check-in</div>
            <div>4 Feb'25, 5PM</div>
          </div>
          <button className="edit-button">Edit</button>
        </div>
        <div className="checkout-box">
          <div>
            <div className="detail-label">Check-out</div>
            <div>4 Feb'25, 10PM</div>
          </div>
          <button className="edit-button">Edit</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Car Details Section */}
        <div className="car-details">
          <div className="back-button">
            <ChevronLeft />
            <span>Back</span>
          </div>

          <div className="car-images">
            <div className="main-image-container">
              <img
                src="/Model1.png"
                alt="Main Car Image"
                className="main-car-image"
                style={{
                  height: "300px",
                  width: "360px",
                  paddingBottom: "20px",
                }}
              />
            </div>
            <div className="thumbnail">
              <img
                src="/Model2.png"
                alt="Car Thumbnail 1"
                className="thumbnail-image"
                style={{
                  height: "390px",
                  width: "370px",
                  paddingBottom: "230px",
                  paddingTop: 0,
                }}
              />
            </div>
            <div className="thumbnail">
              <img
                src="/Model3.png"
                alt="Car Thumbnail 2"
                className="thumbnail-image"
                style={{
                  height: "390px",
                  width: "370px",
                  paddingBottom: "230px",
                  paddingTop: 0,
                }}
              />
            </div>
          </div>

          <div className="car-info">
            <div className="host-info">
              <User className="host-icon" />
              <span>Hosted by Niyati Agravat</span>
            </div>
            <h1 className="car-title">Maruti Suzuki Fronx 2023</h1>
            <p className="car-description">
              Manual translation missing: env5.fuel_variant.cng · 5 Seats
            </p>
          </div>

          <div className="secondary-nav">
            <button className="nav-item">Reviews</button>
            <button className="nav-item">Location</button>
            <button className="nav-item">Features</button>
            <button className="nav-item">Benefits</button>
            <button className="nav-item">Cancellation</button>
            <button className="nav-item">FAQs</button>
            <button className="nav-item">Agreement</button>
          </div>
        </div>

        {/* Payment Section */}
        <div className="payment-section">
          <h2 className="section-title">Exclusive Offers</h2>
          <div className="offers-box">
            <div className="offer-content">
              <div className="offer-icon">
                <span>%</span>
              </div>
              <div className="offer-text">
                <div className="offer-title">Explore Offers</div>
                <div className="offer-subtitle">Check Availability Here</div>
              </div>
            </div>
            <ChevronRight className="offer-arrow" />
          </div>

          <div className="payment-details">
            <div className="fee-row">
              <span>Trip Protection Fee</span>
              <div className="fee-amount">
                <span className="change-button">Change</span>
                <span>₹209</span>
              </div>
            </div>

            <div className="total-row">
              <span className="total-label">Total Price</span>
              <span className="total-amount">₹1,156</span>
            </div>
            <div className="tax-row">
              <span className="tax-info">Inclusive of taxes</span>
              <button
                className="view-details-button"
                onClick={() => setShowPaymentDetails(!showPaymentDetails)}
              >
                View Details
              </button>
            </div>

            {showPaymentDetails && (
              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Base fare</span>
                  <span>₹947</span>
                </div>
                <div className="breakdown-row">
                  <span>Trip Protection Fee</span>
                  <span>₹209</span>
                </div>
              </div>
            )}

            <button className="pay-button" onClick={handleProceedToPay}>
              PROCEED TO PAY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
  