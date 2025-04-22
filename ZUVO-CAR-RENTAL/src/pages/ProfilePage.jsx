"use client";

import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/ProfilePage.css";
import {
  Edit,
  Check,
  User,
  Upload,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const personalInfoRef = useRef(null);
  const drivingLicenseRef = useRef(null);
  const paymentBillingRef = useRef(null);
  const bookingsRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [userBookings, setUserBookings] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState(null);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchUserBookings();
  }, []);
  useEffect(() => {
    if (error) {
      alert(error);
      setError(null); // Clear the error after showing it
    }
  }, [error]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      console.log("Token being sent:", token);

      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data) {
        setUserData(response.data);
      } else {
        throw new Error("No data received from server");
      }
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      let errorMessage = "Failed to fetch user data";
      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        localStorage.removeItem("authToken");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserBookings = async () => {
    try {
      setBookingsLoading(true);
      setBookingsError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/user`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setUserBookings(response.data.bookings);
      } else {
        throw new Error("Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      let errorMessage = "Failed to fetch bookings";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setBookingsError(errorMessage);
    } finally {
      setBookingsLoading(false);
    }
  };

  const [walletLoading, setWalletLoading] = useState(false);
  const [walletStatus, setWalletStatus] = useState(null);
  const [walletId, setWalletId] = useState(null);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleLinkWallet = async () => {
    setWalletLoading(true);
    setWalletStatus(null);

    try {
      // Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error("Razorpay SDK failed to load");
      }

      // Create order on backend
      const token = localStorage.getItem("authToken");
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-order`,
        { amount: 100, currency: "INR" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const options = {
        key: "rzp_test_jVqdtFwidymhM3", // Replace with your test key
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency,
        name: "ZUVO",
        description: "Wallet Linking",
        order_id: orderResponse.data.id,
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verification = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payments/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verification.data.success) {
              setWalletStatus("success");
              setWalletId(verification.data.walletId);
              // Update user data to reflect wallet linking
              fetchUserData();
            } else {
              setWalletStatus("verification_failed");
            }
          } catch (error) {
            console.error("Verification error:", error);
            setWalletStatus("error");
          }
        },
        prefill: {
          name: userData.name || "User",
          email: userData.email || "user@example.com",
          contact: userData.mobile || "9876543210",
        },
        notes: {
          userId: userData._id,
          purpose: "Wallet linking",
        },
        theme: {
          color: "#3399cc",
        },
        method: {
          wallet: true,
        },
        wallet: {
          name: "payzapp", // Default wallet
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response) => {
        console.error("Payment failed:", response.error);
        setWalletStatus("failed");
      });

      rzp.open();
    } catch (error) {
      console.error("Wallet linking error:", error);
      setWalletStatus("error");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/profile`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setUserData(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      let errorMessage = "Failed to save user data";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Add file validation
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, GIF, or WebP image");
      return;
    }

    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/profile/picture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user data with the new profile image
      setUserData((prevData) => ({
        ...prevData,
        profilePicture: response.data.profilePicture,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      let errorMessage = "Failed to upload profile picture";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      setCancellingBookingId(bookingId);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found. Please login again.");
      }

      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}/status`,
        {
          bookingStatus: "cancelled",
          cancelledBy: "user",
          cancellationReason: "User requested cancellation",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        // Update the booking in the local state
        setUserBookings((prev) =>
          prev.map((booking) =>
            booking._id === bookingId
              ? { ...booking, bookingStatus: "cancelled" }
              : booking
          )
        );
        alert("Booking cancelled successfully");
      } else {
        throw new Error("Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      let errorMessage = "Failed to cancel booking";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setCancellingBookingId(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // if (error) {
  //   return <div>{error}</div>;
  // }

  if (!userData) {
    return <div>No user data found</div>;
  }

  const isProfileComplete =
    userData.name && userData.email && userData.mobile && userData.address;

  return (
    <div className="app">
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#d8cfb3",
          padding: "10px 30px",
          fontFamily: "Arial, sans-serif",
          position: "fixed",
          width: "100%",
          zIndex: "10",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ height: "40px" }}>
            <img src="logo.png" alt="Logo" style={{ height: "100%" }} />
          </div>
        </div>

        <h1
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            margin: 0,
            color: "#41372d",
          }}
        >
          My Account
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link to="/becomeHost">
            <button
              style={{
                backgroundColor: "#3e3027",
                color: "white",
                border: "none",
                padding: "6px 12px",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
                fontSize: "13px",
              }}
            >
              Become a Host
            </button>
          </Link>
          <button
            style={{
              backgroundColor: "#3e3027",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {userData.name || "Name"}
          </button>
          <div>
            <User size={32} color="#3e3027" />
          </div>
        </div>
      </header>

      <div className="content-container">
        <aside className="sidebar">
          <div className="profile-section">
            <div
              className="avatar"
              onClick={() => fileInputRef.current?.click()}
            >
              {userData?.profilePicture ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}${
                    userData.profilePicture
                  }`}
                  alt="Profile"
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              ) : (
                <User size={60} color="#4B3A2A" />
              )}
              {isEditing && (
                <div className="upload-overlay">
                  <Upload size={24} color="#fff" />
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept="image/*"
            />
            <h3 className="profile-name">{userData?.name || "Person Name"}</h3>
            <p className="profile-phone">
              {userData?.mobile || "No phone number"}
            </p>
            <p className="profile-email">{userData?.email || "No email"}</p>
            <div className="profile-actions">
              <button className="action-button" onClick={handleEdit}>
                <Edit size={20} color="white" />
                Edit
              </button>
              <button className="action-button" onClick={handleSave}>
                <Check size={20} color="#fff" />
                Save
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
          {!isProfileComplete && (
            <div className="complete-profile-prompt">
              <h2>Complete Your Profile</h2>
              <p>
                Please fill in the missing details to complete your profile.
              </p>
            </div>
          )}

          <div ref={personalInfoRef} className="content-section">
            <center>
              <h2 className="section-title">Personal Information</h2>
            </center>
            <div className="subsection">
              <h3 className="subsection-title">Account Details</h3>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={userData.email || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="tel"
                  value={userData.mobile || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, mobile: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="subsection">
              <h3 className="subsection-title">Personal Details</h3>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={userData.name || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <input
                  type="text"
                  value={userData.gender || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, gender: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={userData.dob || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, dob: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={userData.address || ""}
                  readOnly={!isEditing}
                  onChange={(e) =>
                    setUserData({ ...userData, address: e.target.value })
                  }
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
              <input
                type="text"
                value={userData.licenseNo || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, licenseNo: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Issue Date</label>
              <input
                type="date"
                value={userData.issueDate || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, issueDate: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="date"
                value={userData.expiryDate || ""}
                readOnly={!isEditing}
                onChange={(e) =>
                  setUserData({ ...userData, expiryDate: e.target.value })
                }
              />
            </div>
          </div>

          <div ref={paymentBillingRef} className="content-section">
            <center>
              <h2 className="section-title">Payment & Billing</h2>
            </center>
            <div className="payment-billing-content">
              <div className="wallet-status">
                <h3>PAYTM WALLET</h3>
                <p>
                  Wallet Status:{" "}
                  {userData.walletLinked ? "Linked" : "Not Linked"}
                </p>
                {!userData.walletLinked ? (
                  <>
                    <button
                      onClick={handleLinkWallet}
                      disabled={walletLoading}
                      className="link-wallet-button"
                    >
                      {walletLoading ? "Processing..." : "Link Wallet"}
                    </button>
                    {walletStatus === "success" && (
                      <div className="wallet-status-message success">
                        <p>Wallet linked successfully!</p>
                        {walletId && <p>Wallet ID: {walletId}</p>}
                      </div>
                    )}
                    {walletStatus === "failed" && (
                      <div className="wallet-status-message error">
                        <p>Wallet linking failed. Please try again.</p>
                      </div>
                    )}
                    {walletStatus === "error" && (
                      <div className="wallet-status-message error">
                        <p>An error occurred. Please try again later.</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="wallet-status-message success">
                    <p>Your wallet is linked</p>
                    {userData.walletId && <p>Wallet ID: {userData.walletId}</p>}
                  </div>
                )}
              </div>
              <div className="balance-info">
                <h3>Balance</h3>
                <h3>₹{userData.balance || "0"}</h3>
              </div>
              <div className="transactions">
                <h3>Transactions</h3>
                {userData.transactions &&
                  userData.transactions.map((transaction, index) => (
                    <div className="transaction-item" key={index}>
                      <img src={transaction.modelImage} alt="Car" />
                      <div className="transaction-details">
                        <p>ID: {transaction.id}</p>
                        <p>Car: {transaction.car}</p>
                        <p>Amount: ₹{transaction.amount}</p>
                        <p>Mode: {transaction.mode}</p>
                      </div>
                      <button className="download-invoice-button">
                        Download Invoice
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          <div ref={bookingsRef} className="content-section">
            <center>
              <h2 className="section-title">Your Bookings</h2>
            </center>
            <div className="bookings-content">
              {bookingsLoading ? (
                <div className="loading-message">Loading your bookings...</div>
              ) : bookingsError ? (
                <div className="error-message">{bookingsError}</div>
              ) : userBookings.length === 0 ? (
                <div className="no-bookings-message">
                  <p>You haven't made any bookings yet.</p>
                </div>
              ) : (
                userBookings.map((booking) => (
                  <div className="booking-item" key={booking._id}>
                    {booking.carId &&
                    booking.carId.photos &&
                    booking.carId.photos.length > 0 ? (
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          booking.carId.photos[0]
                        }`}
                        alt={booking.carName}
                        className="booking-car-image"
                      />
                    ) : (
                      <div className="booking-car-placeholder">No Image</div>
                    )}
                    <div className="booking-details">
                      <h3 className="booking-car-name">{booking.carName}</h3>
                      <div className="booking-info">
                        <p>
                          <Calendar size={16} /> {formatDate(booking.startDate)}{" "}
                          - {formatDate(booking.endDate)}
                        </p>
                        <p>
                          <Clock size={16} /> {booking.totalDays}{" "}
                          {booking.totalDays === 1 ? "day" : "days"}
                        </p>
                        <p>
                          <MapPin size={16} /> {booking.pickupLocation}
                        </p>
                      </div>
                      <div className="booking-status-payment">
                        <span
                          className={`booking-status ${booking.bookingStatus}`}
                        >
                          {booking.bookingStatus}
                        </span>
                        <span className="booking-amount">
                          ₹{booking.totalAmount}
                        </span>
                      </div>
                    </div>
                    {booking.bookingStatus === "confirmed" && (
                      <div className="booking-actions">
                        <button
                          className="cancel-booking-btn"
                          disabled={cancellingBookingId === booking._id}
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this booking?"
                              )
                            ) {
                              handleCancelBooking(booking._id);
                            }
                          }}
                        >
                          {cancellingBookingId === booking._id
                            ? "Cancelling..."
                            : "Cancel"}
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;
