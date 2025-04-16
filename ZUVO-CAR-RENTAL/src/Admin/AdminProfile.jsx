"use client";

import { useRef } from "react";
import "../styles/ProfilePage.css";
import { Edit, Check, User } from "lucide-react";

const AdminProfilePage = () => {
  const personalInfoRef = useRef(null);
  const drivingLicenseRef = useRef(null);
  const paymentBillingRef = useRef(null);
  const bookingsRef = useRef(null);

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo-container">
          <div className="logo">
            <img src="logo.png" alt="" />
          </div>
        </div>
        <h1 className="page-title">Admin</h1>
        <div className="header-actions">
          <button className="name-button">Name</button>
          <div className="user-icon">
            <User size={24} color="#fff" />
          </div>
        </div>
      </header>

      <div className="content-container">
        <aside className="sidebar">
          <div className="profile-section">
            <div className="avatar">
              <User size={60} color="#4B3A2A" />
            </div>
            <h3 className="profile-name">Person Name</h3>
            <p className="profile-phone">8849593953</p>
            <p className="profile-email">abcd@gmail.com</p>
            <div className="profile-actions">
              <button className="action-button">
                <Edit size={20} color="#fff" />
              </button>
              <button className="action-button">
                <Check size={20} color="#fff" />
              </button>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button
              className="nav-item"
              onClick={() => scrollToSection(personalInfoRef)}
            >
              Personal Information
            </button>
            <button
              className="nav-item"
              onClick={() => scrollToSection(drivingLicenseRef)}
            >
              Driving License
            </button>
            <button
              className="nav-item"
              onClick={() => scrollToSection(paymentBillingRef)}
            >
              Payment & Billing
            </button>
            <button
              className="nav-item"
              onClick={() => scrollToSection(bookingsRef)}
            >
              Bookings
            </button>
          </nav>
        </aside>

        <main className="main-content">
          <div ref={personalInfoRef} className="content-section">
            <center>
              <h2 className="section-title">Personal Information</h2>
            </center>
            <div className="subsection">
              <h3 className="subsection-title">Account Details</h3>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value="abcd@gmail.com" readOnly />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input type="tel" value="8849593953" readOnly />
              </div>
              <div className="form-group">
                <label>Username</label>
                <input type="text" value="abcd@gmail.com" readOnly />
              </div>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Personal Details</h3>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value="Miraliba Jadeja" readOnly />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input type="text" value="Female" readOnly />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="text" placeholder="DD/MM/YYYY" readOnly />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value="addr, dist, tdfsdfdsfsd, 332434"
                  readOnly
                />
              </div>
            </div>
          </div>

          <div ref={drivingLicenseRef} className="content-section">
            <center>
              <h2 className="section-title">Driving License Information</h2>
            </center>
            <div className="form-group">
              <label>License No</label>
              <input type="text" value="ABCD123CD" readOnly />
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input type="date" readOnly />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input type="date" value="abcd@gmail.com" readOnly />
            </div>
            <div className="form-group">
              <label>Upload Photo</label>
              <input type="file" name="" id="" />
            </div>
          </div>

          <div ref={paymentBillingRef} className="content-section">
            <center>
              <h2 className="section-title">Payment & Billing</h2>
            </center>
            <div className="payment-billing-content">
              <div className="wallet-status">
                <h3>PAYTM WALLET</h3>
                <p>Wallet Status: Not Linked</p>
                <button className="link-wallet-button">Link Wallet</button>
              </div>
              <div className="balance-info">
                <h3>Balance</h3>
                <h3>₹3200</h3>
              </div>
              <div className="transactions">
                <h3>Transactions</h3>
                <div className="transaction-item">
                  <img src="Model1.png" alt="Car" />
                  <div className="transaction-details">
                    <p>ID: 1234567</p>
                    <p>Car: Maruti Suzuki</p>
                    <p>Amount: ₹5000</p>
                    <p>Mode: Paypal</p>
                  </div>
                  <button className="download-invoice-button">
                    Download Invoice
                  </button>
                </div>
                <div className="transaction-item">
                  <img src="Model2.png" alt="Car" />
                  <div className="transaction-details">
                    <p>ID: 1234567</p>
                    <p>Car: Maruti Suzuki</p>
                    <p>Amount: ₹5000</p>
                    <p>Mode: Paypal</p>
                  </div>
                  <button className="download-invoice-button">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div ref={bookingsRef} className="content-section">
            <h2 className="section-title">Bookings</h2>
            <div className="bookings-content">
              {["Model1", "Model2", "Model3", "Model4"].map((model, index) => (
                <div className="booking-item" key={index}>
                  <img src={`${model}.png`} alt="Car" />
                  <div className="booking-details">
                    <p>ID: 1234567</p>
                    <p>Date: 26 Jan - 28 Jan</p>
                    <p>Location: Ahmedabad, Street 234, 438032</p>
                  </div>
                  <button className="accept">Accept</button>
                  <button className="decline">Decline</button>
                </div>
              ))}
            </div>
          </div>
          <div ref={bookingsRef} className="content-section">
            <h2 className="section-title">Bookings</h2>
            <div className="bookings-content">
              {["Model1", "Model2", "Model3", "Model4"].map((model, index) => (
                <div className="booking-item" key={index}>
                  <img src={`${model}.png`} alt="Car" />
                  <div className="booking-details">
                    <p>ID: 1234567</p>
                    <p>Date: 26 Jan - 28 Jan</p>
                    <p>Location: Ahmedabad, Street 234, 438032</p>
                  </div>
                  <button className="download-invoice-button">
                    Download Invoice
                  </button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminProfilePage;
