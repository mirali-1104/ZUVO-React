import React from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HomePageComponents/HeroSection";
import BookingSection from "../components/HomePageComponents/BookingSection";
import AboutSection from "../components/HomePageComponents/AboutSection";
import VehicleModels from "../components/HomePageComponents/VehicleModels";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <HeroSection />
      <BookingSection />
      <AboutSection />
      <VehicleModels />
      <SocialNetworkSection />
    </div>
  );
};

export default Home;
