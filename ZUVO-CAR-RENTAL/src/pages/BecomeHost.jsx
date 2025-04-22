import React, { useState, useEffect } from "react";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";
import { Link } from "react-router-dom";

const CarSharingLanding = () => {
  const [days, setDays] = useState(15);
  const [carTypes, setCarTypes] = useState([]);
  const [selectedCarType, setSelectedCarType] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/carType/car-types"
        );
        const data = await response.json();
        setCarTypes(data);
      } catch (error) {
        console.error("Error fetching car types:", error);
      }
    };

    fetchCarTypes();
  }, []);

  const calculateEarnings = (pricePerDay) => {
    const min = days * pricePerDay;
    const max = days * pricePerDay * 2;
    return { min, max };
  };

  const earnings = selectedCarType
    ? calculateEarnings(
        carTypes.find((car) => car._id === selectedCarType)?.pricePerDay || 0
      )
    : { min: 0, max: 0 };

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Hero Section */}
      <div
        style={{
          backgroundImage: 'url("/hostbg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
          color: "#333",
          display: "flex",
          alignItems: "center",
          padding: "0 60px 0 20px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: "500px",
            backgroundColor: "rgba(218, 217, 217, 0.5)",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <img
            src="logo.png"
            alt="Zuvo Logo"
            style={{ width: "60px", marginBottom: "10px" }}
          />
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "16px",
              color: "#2f2f2f",
            }}
          >
            Earn More By Sharing <br /> Your Car
          </h1>
          <p style={{ fontSize: "16px", marginBottom: "20px" }}>
            Join thousands of hosts earning up to ₹50,000/month by sharing their
            vehicles. Flexible options, full control, and extra income.
          </p>
          <Link to="/host-login">
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#ffffffcc",
                border: "1px solid #000",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                color: "black",
              }}
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Banner Section */}
      <div
        style={{
          backgroundImage: `url("/banner.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
          display: "flex",
          alignItems: "center",
          padding: "40px",
        }}
      >
        {/* Calculator Section */}
        <div
          style={{
            backgroundColor: "#f0e6c8",
            padding: "30px",
            borderRadius: "8px",
            margin: "20px auto",
            width: "100%",
            color: "#41372d",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "28px",
              fontWeight: "bold",
            }}
          >
            Calculate Your Potential Earnings
          </h2>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "20px",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              width: "80%",
              color: "#41372d",
            }}
          >
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              style={{ padding: "10px", width: "150px" }}
            >
              <option value="">Select Brand</option>
              {[...new Set(carTypes.map((carType) => carType.brand))].map(
                (brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                )
              )}
            </select>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setSelectedCarType(e.target.value);
              }}
              style={{ padding: "10px", width: "150px" }}
              disabled={!selectedBrand}
            >
              <option value="">Select Model</option>
              {carTypes
                .filter((carType) => carType.brand === selectedBrand)
                .map((carType) => (
                  <option key={carType._id} value={carType._id}>
                    {carType.name}
                  </option>
                ))}
            </select>
            <div>
              <label htmlFor="days">Sharing Days</label>
              <input
                id="days"
                type="range"
                min={1}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                style={{ marginLeft: "10px", width: "200px" }}
              />
            </div>
          </div>
          <h3 style={{ textAlign: "center", marginTop: "20px" }}>
            Potential Monthly Earnings :{" "}
            <span style={{ color: "green" }}>
              ₹{earnings.min.toLocaleString()} - ₹
              {earnings.max.toLocaleString()}
            </span>
          </h3>
        </div>
      </div>

      {/* Testimonials Section */}
      <div style={{ backgroundColor: "#eee", padding: "40px" }}>
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "26px",
            color: "#41372d",
          }}
        >
          What Our Hosts Say
        </h2>
        <div
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "center",
            marginTop: "30px",
            flexWrap: "wrap",
            color: "#41372d",
          }}
        >
          {[
            {
              id: "priya-testimonial",
              name: "Priya",
              city: "Pune",
              quote:
                "I never thought sharing my car could be rewarding! Highly recommended.",
            },
            {
              id: "amit-testimonial",
              name: "Amit",
              city: "Delhi",
              quote:
                "Zuvo made it super easy to earn from my car when I wasn't using it.",
            },
            {
              id: "anita-testimonial",
              name: "Anita",
              city: "Mumbai",
              quote: "Within a month, I started seeing real income coming in!",
            },
          ].map((testimonial) => (
            <div
              key={testimonial.id}
              style={{
                backgroundColor: "#f0e6c8",
                padding: "20px",
                borderRadius: "8px",
                width: "280px",
              }}
            >
              <p style={{ fontStyle: "italic" }}>{`"${testimonial.quote}"`}</p>
              <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                – {testimonial.name}, {testimonial.city}
              </p>
            </div>
          ))}
        </div>
      </div>

      <SocialNetworkSection />
    </div>
  );
};

export default CarSharingLanding;
