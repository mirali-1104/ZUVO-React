import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import HomeSection from "./pages/Home";
import BookingSection from "./components/HomePageComponents/BookingSection.jsx";
import AboutSection from "./components/HomePageComponents/AboutSection";
import VehicleModelsSection from "./components/HomePageComponents/VehicleModels";
import LoginSignup from "./pages/LoginSignUp.jsx";
import HomeAfterLogin from "./pages/HomeAfterLogin";
import ProfilePage from "./pages/ProfilePage";
import CarBuy from "./pages/CarBuy";
import CarSharingLanding from "./pages/BecomeHost.jsx";
import PaymentPage from "./pages/ProceedToPay.jsx";
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import Bookings from "./Admin/Bookings.jsx";
import Units from "./Admin/Units.jsx";
import Clients from "./Admin/Clients.jsx";
import Payment from "./Admin/Payment.jsx";
import AdminProfilePage from "./Admin/AdminProfile.jsx";
import HostPage from "./pages/HostPage.jsx";
import AddCarForm from "./pages/AddCarForm.jsx";
import QueryPage from "./pages/QueryPage";
import AdminQueries from "./Admin/AdminQueries";
import Login from "./components/HostLoginSignUp/Login.jsx";
import HostLoginSignup from "./pages/HostLoginSignUp.jsx";

function App() {
  return (
    <AuthProvider>
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
          <Route path="/car-buy" element={<CarBuy />} />
          <Route path="/becomeHost" element={<CarSharingLanding />} />
          <Route path="/proceedToPay" element={<PaymentPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin-bookings" element={<Bookings />} />
          <Route path="/admin-units" element={<Units />} />
          <Route path="/admin-clients" element={<Clients />} />
          <Route path="/admin-payments" element={<Payment />} />
          <Route path="/admin-profile" element={<AdminProfilePage />} />
          <Route path="/host-page" element={<HostPage />} />
          <Route path="/add-car" element={<AddCarForm />} />
          <Route path="/support" element={<QueryPage />} />
          <Route path="/admin/queries" element={<AdminQueries />} />
          <Route path="/host-login" element={<HostLoginSignup />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
