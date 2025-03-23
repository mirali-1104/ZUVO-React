"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Check,
  ChevronDown,
} from "lucide-react";
import "../styles/CarBuy.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("reviews");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    if (expandedFaq === id) {
      setExpandedFaq(null);
    } else {
      setExpandedFaq(id);
    }
  };

  return (
    <div className="app-container">
      {/* Scrollable left panel */}
      <div className="left-panel">
        <header className="app-header">
          <div className="logo">ZUVO</div>
          <div className="user-profile">
            <div className="name">Name</div>
            <div className="avatar"></div>
          </div>
        </header>

        <div className="booking-details">
          <div className="location-box">
            <div className="label">Location</div>
            <div className="value">
              A3500 University Center, 282 Champions Way...
            </div>
          </div>

          <div className="check-box">
            <div className="check-in">
              <div className="label">Check-in</div>
              <div className="value">4 Feb'25, 5PM</div>
              <div className="edit">Edit</div>
            </div>
            <div className="check-out">
              <div className="label">Check-out</div>
              <div className="value">4 Feb'25, 10PM</div>
              <div className="edit">Edit</div>
            </div>
          </div>
        </div>

        <div className="back-button">
          <ChevronLeft size={16} />
          <span>Back</span>
        </div>

        <div className="car-gallery">
          <div className="main-image">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cnUsrDLR0BJYFv0xrlJKSoYVkMEsbp.png"
              alt="Maruti Suzuki Fronx"
              className="car-image"
            />
          </div>
          <div className="thumbnail-container">
            <div className="thumbnail">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cnUsrDLR0BJYFv0xrlJKSoYVkMEsbp.png"
                alt="Car side view"
                className="thumbnail-image"
              />
            </div>
            <div className="thumbnail">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cnUsrDLR0BJYFv0xrlJKSoYVkMEsbp.png"
                alt="Car front view"
                className="thumbnail-image"
              />
            </div>
          </div>
        </div>

        <div className="host-info">
          <div className="host-badge">Hosted by Niyati Agrawal</div>
        </div>

        <div className="car-title">
          <h1>Maruti Suzuki Fronx 2023</h1>
          <p className="car-subtitle">
            Manual transmission missing; env/fuel_variant.eng; 5 Seats
          </p>
        </div>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "reviews" ? "active" : ""}`}
            onClick={() => setActiveTab("reviews")}
          >
            Reviews
          </button>
          <button
            className={`tab ${activeTab === "location" ? "active" : ""}`}
            onClick={() => setActiveTab("location")}
          >
            Location
          </button>
          <button
            className={`tab ${activeTab === "features" ? "active" : ""}`}
            onClick={() => setActiveTab("features")}
          >
            Features
          </button>
          <button
            className={`tab ${activeTab === "benefits" ? "active" : ""}`}
            onClick={() => setActiveTab("benefits")}
          >
            Benefits
          </button>
          <button
            className={`tab ${activeTab === "cancellation" ? "active" : ""}`}
            onClick={() => setActiveTab("cancellation")}
          >
            Cancellation
          </button>
          <button
            className={`tab ${activeTab === "faqs" ? "active" : ""}`}
            onClick={() => setActiveTab("faqs")}
          >
            FAQs
          </button>
          <button
            className={`tab ${activeTab === "agreement" ? "active" : ""}`}
            onClick={() => setActiveTab("agreement")}
          >
            Agreement
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "reviews" && (
            <div className="reviews-section">
              <h2>Ratings & Reviews</h2>
              <div className="rating">
                <div className="rating-score">4.9</div>
                <div className="stars">
                  <Star className="star filled" size={16} />
                  <Star className="star filled" size={16} />
                  <Star className="star filled" size={16} />
                  <Star className="star filled" size={16} />
                  <Star className="star filled" size={16} />
                </div>
                <div className="rating-count">Based on 13 trips</div>
              </div>

              <div className="reviews-count">Reviews (5)</div>

              <div className="reviews-list">
                {[1, 2, 3].map((review) => (
                  <div className="review-card" key={review}>
                    <div className="reviewer">
                      <div className="reviewer-avatar">M</div>
                      <div className="reviewer-name">MANIK SINGH</div>
                      <div className="review-rating">
                        <Star className="star filled" size={14} />
                        <Star className="star filled" size={14} />
                        <Star className="star filled" size={14} />
                      </div>
                    </div>
                    <div className="review-text">
                      Car was extremely dirty from inside as well as outside too
                      much damaged
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "location" && (
            <div className="location-section">
              <h2>Location</h2>
              <div className="address">
                <p>
                  1, Hoodi Main Rd, Garudachar Layout, Ayyappa Nagar,
                  Krishnarajapuram, Bengaluru, Karnataka 560036, India
                </p>
              </div>
              <div className="distance">14.1 Kms Away</div>
              <button className="directions-button">Get Directions</button>
            </div>
          )}

          {activeTab === "features" && (
            <div className="features-section">
              <h2>Features</h2>
              <div className="features-grid">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Pet Friendly</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Reverse Camera</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Traction control</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Aux Cable</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Child seat</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Power steering</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Spare Tyre</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Electric ORVM</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">
                    <Check size={16} />
                  </div>
                  <div className="feature-name">Air Conditioning</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "benefits" && (
            <div className="benefits-section">
              <h2>Benefits</h2>
              <div className="benefits-description">
                <p>Journey boldly and explore without limits.</p>
                <button className="learn-more">
                  Learn More
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="plans">
                <div className="plan ultimate">
                  <div className="plan-name">ULTIMATE</div>
                  <div className="plan-price">₹ 499</div>
                  <div className="plan-description">
                    Get up to 5000 kms of unlimited
                  </div>
                </div>
                <div className="plan enhanced">
                  <div className="plan-name">ENHANCED</div>
                  <div className="plan-price">₹ 299</div>
                  <div className="plan-description">
                    Get up to 3000 kms of unlimited
                  </div>
                </div>
                <div className="plan standard">
                  <div className="plan-name">STANDARD</div>
                  <div className="plan-price">₹ 99</div>
                  <div className="plan-description">
                    Only pay 7/km (5000 kms of included)
                  </div>
                </div>
              </div>

              <div className="exclusive-perks">
                <h3>Take advantage of these exclusive perks:</h3>
                <div className="perk">
                  <div className="perk-icon">✓</div>
                  <div className="perk-details">
                    <div className="perk-title">No Limits on Distance</div>
                    <div className="perk-description">
                      Drive as much as you want to
                    </div>
                  </div>
                </div>
                <div className="perk">
                  <div className="perk-icon">✓</div>
                  <div className="perk-details">
                    <div className="perk-title">No Security Deposit</div>
                    <div className="perk-description">
                      No need to block money for bookings
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="faqs-section">
              <h2>FAQs</h2>
              <div className="faq-list">
                {[
                  { id: "faq1", question: "How do I book a rental car?" },
                  {
                    id: "faq2",
                    question: "What documents do I need to rent a car?",
                  },
                  { id: "faq3", question: "Can I rent without a credit card?" },
                  {
                    id: "faq4",
                    question: "What is the minimum age to rent a car?",
                  },
                  {
                    id: "faq5",
                    question: "Can I cancel or modify my booking?",
                  },
                ].map((faq) => (
                  <div className="faq-item" key={faq.id}>
                    <div
                      className="faq-question"
                      onClick={() => toggleFaq(faq.id)}
                    >
                      <div className="question-text">{faq.question}</div>
                      <ChevronDown
                        size={16}
                        className={`faq-toggle ${
                          expandedFaq === faq.id ? "expanded" : ""
                        }`}
                      />
                    </div>
                    {expandedFaq === faq.id && (
                      <div className="faq-answer">
                        This is the answer to the question. It provides detailed
                        information about the topic.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed right panel */}
      <div className="right-panel">
        <div className="exclusive-offers">
          <h2>Exclusive Offers</h2>
          <div className="offer-card">
            <div className="offer-icon">%</div>
            <div className="offer-details">
              <div className="offer-title">Expolre Offers</div>
              <div className="offer-subtitle">Check Availability Here</div>
            </div>
            <ChevronRight size={20} className="offer-arrow" />
          </div>
        </div>

        <div className="price-details">
          <div className="fee-item">
            <div className="fee-name">Trip Protection Fee</div>
            <div className="fee-action">Change</div>
            <div className="fee-amount">₹209</div>
          </div>

          <div className="total-price">
            <div className="price-label">
              <div className="price-title">Total Price</div>
              <div className="price-subtitle">Inclusive of taxes</div>
            </div>
            <div className="price-amount">₹1,156</div>
          </div>

          <div className="view-details">View Details</div>

          <button className="proceed-button">PROCEED TO PAY</button>
        </div>
      </div>
    </div>
  );
}
