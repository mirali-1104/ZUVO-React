import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeSection from "./pages/Home";
import BookingSection from "./components/HomePageComponents/BookingSection.jsx";
import AboutSection from "./components/HomePageComponents/AboutSection";
import VehicleModelsSection from "./components/HomePageComponents/VehicleModels";
import LoginSignup from "./pages/LoginSignUp.jsx";
import HomeAfterLogin from "./pages/HomeAfterLogin";
import ProfilePage from "./pages/ProfilePage";
import CarBuy from "./pages/CarBuy";
// import ContactSection from "./ContactSection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeSection />} />
        <Route path="/booking" element={<BookingSection />} />
        <Route path="/about" element={<AboutSection />} />
        <Route path="/vehicle-models" element={<VehicleModelsSection />} />
        {/* <Route path="/contact" element={<ContactSection />} /> */}
        <Route path="/login" element={<LoginSignup />} />{" "}
        <Route path="/home-after-login" element={<HomeAfterLogin />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/car-buy" element={<CarBuy/>} />
        {/* Route for login/signup */}
      </Routes>
    </Router>
  );
}

export default App;
