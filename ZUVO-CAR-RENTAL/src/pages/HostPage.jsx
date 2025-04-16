import React, { useState } from "react";
import { FaUserCircle, FaCarSide } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaCog, FaLock, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";

const CarCard = ({ carName, rate, transmission, fuel, capacity, imageUrl }) => {
  const [available, setAvailable] = useState(true);

  const handleToggle = () => {
    const confirmChange = window.confirm(
      `Do you want to mark this car as ${
        available ? "unavailable" : "available"
      }?`
    );
    if (confirmChange) {
      setAvailable(!available);
    }
  };

  return (
    <div
      style={{
        width: "180px",
        backgroundColor: "#d8d0b2",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}
    >
      <div
        onClick={handleToggle}
        style={{
          height: "10px",
          width: "10px",
          borderRadius: "50%",
          backgroundColor: available ? "green" : "red",
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
        }}
      />
      <img
        src={imageUrl}
        alt={carName}
        style={{ width: "100%", borderRadius: "4px" }}
      />
      <div style={{ marginTop: "10px" }}>
        <strong>{carName}</strong>
        <p style={{ margin: "5px 0" }}>{rate}/hr</p>
        <p style={{ margin: "2px 0" }}>
          <FaCog /> {transmission}
        </p>
        <p style={{ margin: "2px 0" }}>
          <FaLock /> {fuel}
        </p>
        <p style={{ margin: "2px 0" }}>
          <FaUsers /> {capacity}
        </p>
      </div>
    </div>
  );
};

const HostPage = () => {
  return (
    <div>
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#d8d0b2",
          padding: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid skyblue",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <img src="/logo.png" alt="Zuvo Logo" style={{ height: "40px" }} />
          <nav style={{ display: "flex", gap: "25px" }}>
            <a href="#" style={navStyle}>
              Home
            </a>
            <a href="#" style={navStyle}>
              Add Car
            </a>
            <a href="#" style={navStyle}>
              Contact Us
            </a>
            <a href="#" style={navStyle}>
              Your Cars
            </a>
          </nav>
        </div>
        <FaUserCircle size={40} color="#3d342a" />
      </div>

      {/* Welcome Banner */}
      <div style={{ fontFamily: "sans-serif", border: "2px solid skyblue" }}>
        <div
          style={{
            backgroundImage: "url('/host1bg.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            padding: "50px 30px 80px 30px",
            color: "white",
            fontSize: "24px",
            fontWeight: "bold",
            height: "300px",
          }}
        >
          Welcome, Rajveersinh!
        </div>

        {/* Steps Section */}
        <div
          style={{
            backgroundColor: "#d8d0b2",
            padding: "30px",
            textAlign: "center",
          }}
        >
          <Link to="/add-car">
            <div style={{ textAlign: "right", marginBottom: "20px" }}>
              <button style={buttonStyle}>LIST YOUR CAR</button>
            </div>
          </Link>

          <div style={stepsContainer}>
            <Step
              number="1"
              text="LIST YOUR CAR"
              icon={<FaCarSide size={40} color="darkred" />}
            />
            <Arrow />
            <Step
              number="2"
              text="SET AVAILABILITY"
              icon={<MdAccessTime size={40} color="#2f9e44" />}
            />
            <Arrow />
            <Step
              number="3"
              text="START EARNING"
              icon={<FaRocket size={40} color="#1c7ed6" />}
            />
          </div>
        </div>

        {/* Your Cars Section */}
        <div style={{ padding: "30px" }}>
          <h2 style={{ marginBottom: "20px" }}>YOUR CARS</h2>
          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
              color: "black",
            }}
          >
            <CarCard
              carName="Baleno 2020"
              rate="238"
              transmission="Manual"
              fuel="Petrol"
              capacity="5"
              imageUrl="/Model1.png"
            />
            <CarCard
              carName="Baleno 2020"
              rate="238"
              transmission="Manual"
              fuel="Petrol"
              capacity="5"
              imageUrl="/Model2.png"
            />
          </div>
        </div>
      </div>
      <SocialNetworkSection />
    </div>
  );
};

// Reusable step component
const Step = ({ number, text, icon }) => (
  <div>
    <div style={circleStyle}>{number}</div>
    <p style={{ fontWeight: "bold", marginTop: "10px" }}>{text}</p>
    {icon}
  </div>
);

const Arrow = () => <div style={{ fontSize: "80px", color: "#5c3b1f" }}>→</div>;

// Styles
const navStyle = {
  textDecoration: "none",
  color: "#2f2f2f",
  fontWeight: "bold",
};

const buttonStyle = {
  backgroundColor: "#3d342a",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};

const stepsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
};

const circleStyle = {
  backgroundColor: "#5c3b1f",
  color: "white",
  width: "50px",
  height: "50px",
  lineHeight: "50px",
  borderRadius: "50%",
  margin: "0 auto",
  fontSize: "20px",
};

export default HostPage;
