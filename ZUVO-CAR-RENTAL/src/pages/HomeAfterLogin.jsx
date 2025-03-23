import React from "react";
import NavbarAl from "../components/NavbarAl";
import HeroSection from "../components/HomePageComponents/HeroSection";
import BookingSection from "../components/HomePageComponents/BookingSection";
import AboutSection from "../components/HomePageComponents/AboutSection";
import VehicleModels from "../components/HomePageComponents/VehicleModels";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";

const Home = () => {
  return (
    <div className="home-container">
      <NavbarAl />
      <HeroSection />
      <BookingSection />
      <AboutSection />
      <VehicleModels />
      <SocialNetworkSection />
    </div>
  );
};

export default Home;
