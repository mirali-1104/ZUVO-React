
"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/CarBuy.css";
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react";
import NavbarP from "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/components/NavbarP.jsx";

export default function CarBookingPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  const carImages = [
    "/Model1.png",
    "/Model2.png",
    "/Model3.png",
    "/Model4.png",
  ];

  const reviews = [
    {
      id: 1,
      name: "MANOJ SINGH",
      rating: 5,
      text: "Car was extremely clean from inside as well as outside.Nice to be rented.",
    },
    {
      id: 2,
      name: "MANOJ SINGH",
      rating: 5,
      text: "Car was extremely clean from inside as well as outside.Nice to be rented.",
    },
    {
      id: 3,
      name: "MANOJ SINGH",
      rating: 5,
      text: "Car was extremely clean from inside as well as outside.Nice to be rented.",
    },
  ];

  const features = [
    { id: 1, name: "Pet Friendly", icon: "🐾" },
    { id: 2, name: "Reverse Camera", icon: "📷" },
    { id: 3, name: "Traction control", icon: "🔄" },
    { id: 4, name: "A/C Cable", icon: "❄️" },
    { id: 5, name: "Child seat", icon: "👶" },
    { id: 6, name: "Power steering", icon: "🔄" },
    { id: 7, name: "Spare Tyre", icon: "🛞" },
    { id: 8, name: "Electric OEM", icon: "⚡" },
    { id: 9, name: "Air Conditioning", icon: "❄️" },
    { id: 10, name: "Toolkit", icon: "🧰" },
    { id: 11, name: "Anti-lock Braking System", icon: "🛑" },
    { id: 12, name: "Full boot space", icon: "📦" },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    "How do I book a rental car?",
    "What documents do I need to rent a car?",
    "Can I rent without a credit card?",
    "What is the minimum age to rent a car?",
    "Can I cancel or modify my booking?",
    "Can I rent without a credit card?",
    "How do I book a rental car?",
    "Can I cancel or modify my booking?",
    "How do I book a rental car?",
  ];
  const handleImageClick = (index) => {
    setSelectedImage(index);
    setShowImageModal(true);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % carImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + carImages.length) % carImages.length
    );
  };
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <>
      <NavbarP />
      <header
        style={{
          backgroundColor: "#d9d0b2", // beige background
          padding: "10px 20px",
          borderBottom: "1px solid #999",
        }}
      >
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div
            style={{
              backgroundColor: "#8b8169", // brownish-grey background
              padding: "10px 12px",
              borderRadius: "8px",
              color: "#fff",
              flex: "1",
              minWidth: "200px",
              position: "fixed"
            }}
          >
            <span style={{ fontSize: "12px", color: "#ddd" }}>Location</span>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "14px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              A2500 University Center, 282 Champions Way...
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
              flex: "1",
              minWidth: "200px",
            }}
          >
            <div
              style={{
                backgroundColor: "#8b8169",
                padding: "10px 12px",
                borderRadius: "8px",
                color: "#fff",
                flex: "1",
                minWidth: "150px",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "12px", color: "#ddd" }}>Check-in</span>
              <p
                style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#fff" }}
              >
                4 Feb'25, 5PM
              </p>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#f9b233", // golden edit color
                  fontWeight: "bold",
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                Edit
              </button>
            </div>

            <div
              style={{
                backgroundColor: "#8b8169",
                padding: "10px 12px",
                borderRadius: "8px",
                color: "#fff",
                flex: "1",
                minWidth: "150px",
                position: "relative",
              }}
            >
              <span style={{ fontSize: "12px", color: "#ddd" }}>Check-out</span>
              <p
                style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#fff" }}
              >
                4 Feb'25, 10PM
              </p>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#f9b233",
                  fontWeight: "bold",
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="car-booking-container">
        <div className="car-booking-content">
          <div className="car-booking-left">
            <div className="back-button">
              <ArrowLeft size={20} />
              <span>Back</span>
            </div>

            <div className="car-gallery">
              <div className="main-image" onClick={() => handleImageClick(0)}>
                <img
                  src={carImages[0] || "/placeholder.svg"}
                  className="main-image1"
                  alt="Maruti Suzuki Fronx 2023"
                />
                <img
                  className="main-image2"
                  src={carImages[3] || "/placeholder.svg"}
                  alt="Maruti Suzuki Fronx 2023"
                />
              </div>
              <div className="thumbnail-container">
                {carImages.slice(1).map((img, index) => (
                  <div
                    key={index + 1}
                    className="thumbnail"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Car view ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="car-details">
              <div className="car-badge">Hosted by Niyati Agravat</div>
              <h1 className="car-title">Maruti Suzuki Fronx 2023</h1>
              <p className="car-subtitle">
                Manual transmission missing, aircon_unit#2029, 5 Seats
              </p>

              <div className="car-tabs">
                <span>Reviews</span>
                <span>Location</span>
                <span>Features</span>
                <span>Benefits</span>
                <span>Cancellation</span>
                <span>FAQ</span>
                <span>Agreement</span>
              </div>

              <div className="ratings-section">
                <h3>Ratings & Reviews</h3>
                <div className="rating-summary">
                  <div className="rating-number">4.9</div>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`star ${star <= 4.9 ? "filled" : ""}`}
                        size={16}
                      />
                    ))}
                  </div>
                  <div className="review-count">Reviews (8)</div>
                </div>

                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="reviewer">
                        <div className="reviewer-avatar">M</div>
                        <div className="reviewer-name">{review.name}</div>
                        <div className="review-rating">
                          {review.rating}{" "}
                          <Star className="star filled" size={14} />
                        </div>
                      </div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="location-section">
                <h3>Location</h3>
                <p className="location-address">
                  5 Hosur Main Rd, Roopena Agrahara, Anchepalya, Hosur,
                  Bommanahalli, Karnataka 560068, India
                </p>
                <div className="distance-info">
                  <span>15.1 Kms Away</span>
                </div>
                <button className="directions-btn">Get Directions</button>
              </div>

              <div className="features-section">
                <h3>Features</h3>
                <div className="features-grid">
                  {features.map((feature) => (
                    <div key={feature.id} className="feature-item">
                      <span className="feature-icon">{feature.icon}</span>
                      <span className="feature-name">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                fontFamily: "sans-serif",
                backgroundColor: "#f5f5f5",
                padding: "20px",
              }}
            >
              {/* Benefits */}
              <h3 style={{ marginBottom: "8px", color: "#41372d" }}>
                Benefits
              </h3>
              <p style={{ margin: "5px 0 15px", color: "#41372d" }}>
                Journey boldly and explore without limits.
                <br />
                Choose a plan & secure your trip
              </p>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "#8d5b17",
                  fontWeight: "bold",
                  float: "right",
                  marginTop: "-45px",
                }}
              >
                Learn More →
              </button>

              <div style={{ display: "flex", gap: "12px", margin: "15px 0" }}>
                {[
                  { title: "ULTIMATE", price: 499, limit: "₹500" },
                  { title: "ENHANCED", price: 299, limit: "₹600" },
                  { title: "STANDARD", price: 99, limit: "₹7500" },
                ].map((plan, i) => (
                  <div
                    key={i}
                    style={{
                      backgroundColor: "#6d6552",
                      borderRadius: "8px",
                      padding: "12px",
                      flex: 1,
                      color: "#fff",
                      minWidth: "100px",
                    }}
                  >
                    <strong>{plan.title}</strong>
                    <p style={{ margin: "6px 0" }}>₹ {plan.price}</p>
                    <small>Only pay {plan.limit} in case of accident</small>
                  </div>
                ))}
              </div>

              {/* Perks */}
              <h4 style={{ marginTop: "15px" , color : "#41372d"}}>
                Take advantage of these exclusive perks.
              </h4>
              <ul style={{ listStyle: "none", padding: 0, fontSize: "14px", color:"#41372d" }}>
                <li>
                  🚗 <strong>No Limits on Distance</strong> — Travel as far as
                  you want at no extra cost.
                </li>
                <li>
                  🔐 <strong>No Security Deposit</strong> — No upfront deposits,
                  just hassle-free bookings.
                </li>
              </ul>

              {/* Cancellation */}
              <div
                style={{
                  backgroundColor: "#e3d6b8",
                  border: "1px solid #c0b68f",
                  padding: "10px",
                  marginTop: "20px",
                  borderRadius: "6px",
                  color: "#41372D",

                }}
              >
                🚫 <strong>Cancellation Unavailable</strong>
                <br />
                The Booking is non-refundable
              </div>

              {/* FAQs */}
              <h4 style={{ margin: "20px 0 10px", color : "#41372D" }}>FAQs</h4>
              <div>
                {faqs.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 0",
                      cursor: "pointer",
                      color : "#41372d"
                    }}
                    onClick={() => toggleFAQ(i)}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>{q}</span>
                      <span style={{ color: "#7b361f" }}>
                        {openIndex === i ? "▾" : "▸"}
                      </span>
                    </div>
                    {openIndex === i && (
                      <p
                        style={{
                          marginTop: "8px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        This is a placeholder answer for: {q}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Policy Agreement */}
              <div
                style={{
                  backgroundColor: "#e3d6b8",
                  padding: "15px",
                  borderRadius: "6px",
                  marginTop: "20px",
                  fontSize: "14px",
                }}
              >
                <label>
                  <input type="checkbox" style={{ marginRight: "10px" }} />I
                  acknowledge and accept the terms and conditions of the Lease
                  Agreement with the Host.
                </label>
                <div
                  style={{
                    color: "#7b361f",
                    fontWeight: "bold",
                    marginTop: "5px",
                    cursor: "pointer",
                  }}
                >
                  VIEW DETAILS
                </div>
              </div>
            </div>
          </div>

          <div className="car-booking-right">
            <div className="payment-container">
              <h2 style={{ color: "black" }}>Exclusive Offers</h2>

              <div className="offers-carousel">
                <div className="offer-card">
                  <div className="offer-icon">🔥</div>
                  <div className="offer-content">
                    <h4 style={{ color: "black" }}>Explore Offers</h4>
                    <p>Exciting benefits here</p>
                  </div>
                  <button className="offer-nav">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="price-details">
                <div className="price-row">
                  <span>Trip Protection Fee</span>
                  <div className="price-action">
                    <span className="change-link">Change</span>
                    <span className="price">₹200</span>
                  </div>
                </div>

                <div className="total-price">
                  <div className="total-label">
                    <span>Total Price</span>
                    <span className="tax-note">Inclusive of taxes</span>
                  </div>
                  <div className="price-amount">
                    <span className="amount">₹1156</span>
                    <span className="view-details">View Details</span>
                  </div>
                </div>
                <Link to="/proceedToPay" className="profile-link">
                  <button className="pay-button">PROCEED TO PAY</button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {showImageModal && (
          <div className="image-modal">
            <div className="modal-content">
              <button
                className="close-modal"
                onClick={() => setShowImageModal(false)}
              >
                ×
              </button>
              <button className="prev-image" onClick={prevImage}>
                <ChevronLeft size={24} />
              </button>
              <div className="modal-image-container">
                <img
                  src={carImages[selectedImage] || "/placeholder.svg"}
                  alt={`Car view ${selectedImage}`}
                />
              </div>
              <button className="next-image" onClick={nextImage}>
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
