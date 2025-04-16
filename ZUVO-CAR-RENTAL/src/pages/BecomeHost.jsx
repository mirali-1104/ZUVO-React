import React, { useState } from "react";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";
import {Link} from "react-router-dom";

const CarSharingLanding = () => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [days, setDays] = useState(15);

  const calculateEarnings = () => {
    const min = days * 1000;
    const max = days * 2000;
    return { min, max };
  };

  const earnings = calculateEarnings();

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
          <Link to="/host-page">
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
            <input
              placeholder="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              style={{ padding: "10px", width: "150px" }}
            />
            <input
              placeholder="Model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              style={{ padding: "10px", width: "150px" }}
            />
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
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                backgroundColor: "#f0e6c8",
                padding: "20px",
                borderRadius: "8px",
                width: "280px",
              }}
            >
              <p style={{ fontStyle: "italic" }}>
                “I never thought sharing my car could be rewarding! Highly
                recommended.”
              </p>
              <p style={{ fontWeight: "bold", marginTop: "10px" }}>
                – Priya, Pune
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
