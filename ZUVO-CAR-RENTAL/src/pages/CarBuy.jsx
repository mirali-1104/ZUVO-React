"use client";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/CarBuy.css";
import { ArrowLeft, ChevronLeft, ChevronRight, Star } from "lucide-react";
import NavbarP from "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/components/NavbarP.jsx";
import axios from "axios";

export default function CarBookingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rentalInfo, setRentalInfo] = useState({
    days: 0,
    hours: 5,
    totalDays: 1,
  });

  // Default images as fallback
  const defaultCarImages = [
    "/Model1.png",
    "/Model2.png",
    "/Model3.png",
    "/Model4.png",
  ];

  // Common car features for mapping
  const commonFeatures = [
    { key: "airConditioning", name: "Air Conditioning", icon: "❄️" },
    { key: "powerSteering", name: "Power Steering", icon: "🔄" },
    { key: "powerWindows", name: "Power Windows", icon: "⚡" },
    { key: "bluetooth", name: "Bluetooth", icon: "📱" },
    { key: "childSeat", name: "Child Seat", icon: "👶" },
    { key: "usb", name: "USB Port", icon: "🔌" },
    { key: "spareTyre", name: "Spare Tyre", icon: "🛞" },
    { key: "toolkit", name: "Toolkit", icon: "🧰" },
    { key: "firstAid", name: "First Aid Kit", icon: "🩹" },
    { key: "parkingSensors", name: "Parking Sensors", icon: "📡" },
    { key: "rearCamera", name: "Rear Camera", icon: "📷" },
    { key: "musicSystem", name: "Music System", icon: "🎵" },
    { key: "petFriendly", name: "Pet Friendly", icon: "🐾" },
    { key: "gps", name: "GPS", icon: "🗺️" },
    { key: "cruiseControl", name: "Cruise Control", icon: "🚗" },
    { key: "tractionControl", name: "Traction Control", icon: "🔄" },
    { key: "absSystem", name: "Anti-lock Braking System", icon: "🛑" },
    { key: "fullBootSpace", name: "Full Boot Space", icon: "📦" },
  ];

  // Function to handle image URLs
  const getImageUrl = (photo) => {
    if (!photo) return null;

    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("/uploads")) return `http://localhost:5000${photo}`;
    return photo;
  };

  // Fetch car details on component mount
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);

        let vehicleData = null;
        let rentalDuration = {
          days: 0,
          hours: 5,
          totalDays: 1,
        };

        // Check if car data and rental info were passed via navigation state
        if (location.state) {
          if (location.state.vehicle) {
            vehicleData = location.state.vehicle;
            console.log("Car data from navigation:", vehicleData);
          }

          if (location.state.rentalInfo) {
            rentalDuration = location.state.rentalInfo;
            console.log("Rental info from navigation:", rentalDuration);
            setRentalInfo(rentalDuration);
          }
        }

        // If no car data in navigation state, try to get car ID from URL params
        if (!vehicleData) {
          const urlParams = new URLSearchParams(location.search);
          const carId = urlParams.get("id");

          if (carId) {
            // Fetch car data from API using the ID
            const response = await axios.get(
              `http://localhost:5000/api/cars/${carId}`
            );
            if (response.data.success) {
              vehicleData = response.data.car;
              console.log("Car data from API:", vehicleData);
            } else {
              throw new Error("Failed to fetch car details");
            }
          } else {
            throw new Error("No car ID provided");
          }
        }

        if (vehicleData) {
          // Process images
          let carImages = [];
          if (vehicleData.photos && vehicleData.photos.length > 0) {
            carImages = vehicleData.photos
              .map((photo) => getImageUrl(photo))
              .filter(Boolean);
          }

          // If no images found, use defaults
          if (carImages.length === 0) {
            carImages = defaultCarImages;
          }

          // Process features
          let carFeatures = [];

          // Check if the car has a features property
          if (
            vehicleData.features &&
            typeof vehicleData.features === "object"
          ) {
            // Map features from the car data to our feature objects
            carFeatures = Object.entries(vehicleData.features)
              .filter(([_, value]) => value === true)
              .map(([key]) => {
                const matchedFeature = commonFeatures.find(
                  (f) => f.key === key
                );
                return (
                  matchedFeature || {
                    key,
                    name: key.replace(/([A-Z])/g, " $1").trim(),
                    icon: "✅",
                  }
                );
              });
          } else {
            // If no features found, use some defaults based on car type
            carFeatures = [
              { id: 9, name: "Air Conditioning", icon: "❄️" },
              { id: 6, name: "Power Steering", icon: "🔄" },
              { id: 7, name: "Spare Tyre", icon: "🛞" },
              { id: 11, name: "Anti-lock Braking System", icon: "🛑" },
              { id: 12, name: "Full Boot Space", icon: "📦" },
            ];
          }

          // Set the car data
          setCarData({
            ...vehicleData,
            processedImages: carImages,
            displayName:
              vehicleData.carName || vehicleData.title || "Unnamed Car",
            price: vehicleData.rentalPrice || vehicleData.price || 1200,
            seats: vehicleData.numberOfSeats || vehicleData.seats || 5,
            transmission: vehicleData.transmission || "Automatic",
            fuel: vehicleData.fuelTypes || vehicleData.fuelType || "Petrol",
            host:
              vehicleData.hostName ||
              vehicleData.host?.name ||
              "Anonymous Host",
            features: carFeatures,
          });
        } else {
          throw new Error("No car data found");
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
        setError(error.message || "Failed to load car details");
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [location]);

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
    if (!carData) return;
    const imagesArray = carData.processedImages || defaultCarImages;
    setSelectedImage((prev) => (prev + 1) % imagesArray.length);
  };

  const prevImage = () => {
    if (!carData) return;
    const imagesArray = carData.processedImages || defaultCarImages;
    setSelectedImage(
      (prev) => (prev - 1 + imagesArray.length) % imagesArray.length
    );
  };

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Calculate the total rental cost
  const calculateTotalRentalCost = () => {
    if (!carData) return 0;

    const basePrice = carData.price * rentalInfo.totalDays;
    const serviceFee = Math.round(basePrice * 0.05);
    const protectionFee = 200;

    return {
      basePrice,
      serviceFee,
      protectionFee,
      total: basePrice + serviceFee + protectionFee,
    };
  };

  // Format rental duration for display
  const formatRentalDuration = () => {
    const { days, hours } = rentalInfo;

    if (days === 0 && hours > 0) {
      return `${hours} hours (charged as 1 day)`;
    } else if (days > 0 && hours === 0) {
      return `${days} day${days > 1 ? "s" : ""}`;
    } else {
      return `${days} day${
        days > 1 ? "s" : ""
      } and ${hours} hours (charged as ${days + 1} days)`;
    }
  };

  // Show loading state
  if (loading) {
    return (
      <>
        <NavbarP />
        <div
          className="car-booking-container"
          style={{ padding: "100px 20px", textAlign: "center" }}
        >
          <p>Loading car details...</p>
        </div>
      </>
    );
  }

  // Show error state
  if (error) {
    return (
      <>
        <NavbarP />
        <div
          className="car-booking-container"
          style={{ padding: "100px 20px", textAlign: "center" }}
        >
          <p style={{ color: "red" }}>{error}</p>
          <button
            onClick={handleGoBack}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              background: "#3d342a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  // If no car data, show error
  if (!carData) {
    return (
      <>
        <NavbarP />
        <div
          className="car-booking-container"
          style={{ padding: "100px 20px", textAlign: "center" }}
        >
          <p>No car details available</p>
          <button
            onClick={handleGoBack}
            style={{
              marginTop: "20px",
              padding: "10px 15px",
              background: "#3d342a",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Go Back
          </button>
        </div>
      </>
    );
  }

  // Get the images to display
  const displayImages = carData.processedImages || defaultCarImages;

  // Get the pricing info
  const pricingInfo = calculateTotalRentalCost();

  return (
    <>
      <NavbarP />

      <div className="car-booking-container">
        <div className="car-booking-content">
          <div className="car-booking-left">
            <div className="back-button" onClick={handleGoBack}>
              <ArrowLeft size={20} />
              <span>Back</span>
            </div>

            <div className="car-gallery">
              <div className="main-image" onClick={() => handleImageClick(0)}>
                <img
                  src={displayImages[0] || "/placeholder.svg"}
                  className="main-image1"
                  alt={carData.displayName}
                />
                <img
                  className="main-image2"
                  src={
                    displayImages[
                      displayImages.length > 3
                        ? 3
                        : displayImages.length - 1 || 0
                    ] || "/placeholder.svg"
                  }
                  alt={carData.displayName}
                />
              </div>
              <div className="thumbnail-container">
                {displayImages.slice(1, 4).map((img, index) => (
                  <div
                    key={index + 1}
                    className="thumbnail"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`${carData.displayName} view ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="car-details">
              <div className="car-badge">Hosted by {carData.host}</div>
              <h1 className="car-title">{carData.displayName}</h1>
              <p className="car-subtitle">
                {carData.transmission} transmission, {carData.fuel},{" "}
                {carData.seats} Seats
              </p>

              <div className="car-tabs">
                <span>Reviews</span>
                <span>Location</span>
                <span>Features</span>
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
                  {carData.location ||
                    "5 Hosur Main Rd, Roopena Agrahara, Anchepalya, Hosur, Bommanahalli, Karnataka 560068, India"}
                </p>
                <div className="distance-info">
                  <span>15.1 Kms Away</span>
                </div>
                <button className="directions-btn">Get Directions</button>
              </div>

              <div className="features-section">
                <h3>Features</h3>
                <div className="features-grid">
                  {carData.features.map((feature, index) => (
                    <div
                      key={feature.id || feature.key || index}
                      className="feature-item"
                    >
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
              <h4 style={{ margin: "20px 0 10px", color: "#41372D" }}>FAQs</h4>
              <div>
                {faqs.map((q, i) => (
                  <div
                    key={i}
                    style={{
                      borderBottom: "1px solid #ddd",
                      padding: "10px 0",
                      cursor: "pointer",
                      color: "#41372d",
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
              <h2 style={{ color: "black", marginTop : "90px" }}>Booking Summary</h2>
              <div className="price-details">
                <div className="price-row">
                  <span>Base Rental Fee</span>
                  <div className="price-action">
                    <span className="price">₹{carData.price}/day</span>
                  </div>
                </div>

                <div className="price-row">
                  <span>Rental Duration</span>
                  <div className="price-action">
                    <span className="price">{formatRentalDuration()}</span>
                  </div>
                </div>

                <div className="price-row">
                  <span>
                    Subtotal ({rentalInfo.totalDays} day
                    {rentalInfo.totalDays > 1 ? "s" : ""})
                  </span>
                  <div className="price-action">
                    <span className="price">₹{pricingInfo.basePrice}</span>
                  </div>
                </div>

                <div className="price-row">
                  <span>Trip Protection Fee</span>
                  <div className="price-action">
                    <span className="change-link">Change</span>
                    <span className="price">₹{pricingInfo.protectionFee}</span>
                  </div>
                </div>

                <div className="price-row">
                  <span>Service Fee</span>
                  <div className="price-action">
                    <span className="price">₹{pricingInfo.serviceFee}</span>
                  </div>
                </div>

                <div className="total-price">
                  <div className="total-label">
                    <span>Total Price</span>
                    <span className="tax-note">Inclusive of taxes</span>
                  </div>
                  <div className="price-amount">
                    <span className="amount">₹{pricingInfo.total}</span>
                    <span className="view-details">View Details</span>
                  </div>
                </div>
                <button className="pay-button">PROCEED TO PAY</button>
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
                  src={displayImages[selectedImage] || "/placeholder.svg"}
                  alt={`${carData.displayName} view ${selectedImage}`}
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
