import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];

const EditCar = () => {
  const { carId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [admin, setAdmin] = useState({});
  const [carData, setCarData] = useState({
    carName: "",
    brand: "",
    carModel: "",
    year: "",
    rentalPrice: "",
    transmission: "Manual",
    fuelTypes: "",
    numberOfSeats: "",
    color: "",
    mileage: "",
    isAvailable: true,
    licensePlate: "",
    vin: "",
    additionalFeatures: "",
    location: {
      address: "",
    },
  });
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchCarDetails();
    
    // Get admin info from localStorage
    const adminInfo = localStorage.getItem("admin");
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    }
  }, [carId]);

  const fetchCarDetails = async () => {
    setLoading(true);
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("You must be logged in as admin");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/cars/admin/cars/${carId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCarData(response.data.car);
        if (response.data.car.photos) {
          setPhotos(response.data.car.photos);
        }
      } else {
        setError("Failed to fetch car details");
      }
    } catch (err) {
      console.error("Error fetching car details:", err);
      setError(
        err.response?.data?.error || "An error occurred while fetching car details"
      );
      toast.error(err.response?.data?.error || "Failed to fetch car details");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes(".")) {
      // Handle nested objects like location.address
      const [parent, child] = name.split(".");
      setCarData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === "checkbox") {
      // Handle checkbox for isAvailable
      setCarData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      // Handle regular inputs
      setCarData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      
      // Make API request to update car
      const response = await axios.put(
        `http://localhost:5000/api/cars/admin/cars/${carId}`,
        carData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Car updated successfully");
        // Navigate back to units page
        navigate("/admin-units");
      } else {
        setError("Failed to update car");
        toast.error("Failed to update car");
      }
    } catch (err) {
      console.error("Error updating car:", err);
      setError(
        err.response?.data?.error || "An error occurred while updating car"
      );
      toast.error(err.response?.data?.error || "Failed to update car");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "linear-gradient(to bottom, #e3ddcf, #c5bfb3)",
          padding: "30px 20px",
          flexShrink: 0,
          height: "100vh",
          boxShadow: "2px 0 10px rgba(0, 0, 0, 0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
        }}
      >
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "bold",
            marginBottom: "50px",
            color: "#41372d",
            textAlign: "center",
            letterSpacing: "1px",
          }}
        >
          🛠 Admin
        </h2>
        <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
          {menuItems.map((item, index) => (
            <li key={index} style={{ marginBottom: "20px" }}>
              <Link
                to={item.path}
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "#2e2b25",
                  fontWeight: "500",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  transition: "background 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#d6cfb4";
                  e.currentTarget.style.transform = "translateX(5px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <span style={{ marginRight: "10px" }}>{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          background: "#f5f0e6",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            background: "white",
            borderRadius: "8px",
            padding: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h1
              style={{ fontSize: "24px", fontWeight: "bold", color: "#41372d" }}
            >
              Edit Car Details
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Link to="/admin-profile">
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "gray",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: "18px",
                    fontWeight: "bold",
                  }}
                >
                  {admin.name ? admin.name.charAt(0).toUpperCase() : "A"}
                </div>
              </Link>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#ffebee",
                color: "#c62828",
                borderRadius: "4px",
                marginBottom: "20px",
              }}
            >
              {error}
            </div>
          )}

          {/* Loading indicator */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px",
                fontSize: "18px",
                color: "#5C4B3D",
              }}
            >
              Loading car details...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                }}
              >
                {/* Basic Information */}
                <div>
                  <h3 style={{ color: "#5C4B3D", marginBottom: "15px" }}>
                    Basic Information
                  </h3>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Car Name *
                    </label>
                    <input
                      type="text"
                      name="carName"
                      value={carData.carName}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={carData.brand}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Model
                    </label>
                    <input
                      type="text"
                      name="carModel"
                      value={carData.carModel || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={carData.year || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Color
                    </label>
                    <input
                      type="text"
                      name="color"
                      value={carData.color || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                </div>

                {/* Rental Information */}
                <div>
                  <h3 style={{ color: "#5C4B3D", marginBottom: "15px" }}>
                    Rental Information
                  </h3>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Rental Price (₹/hr) *
                    </label>
                    <input
                      type="number"
                      name="rentalPrice"
                      value={carData.rentalPrice}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                      required
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Transmission
                    </label>
                    <select
                      name="transmission"
                      value={carData.transmission || "Manual"}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    >
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Fuel Type
                    </label>
                    <input
                      type="text"
                      name="fuelTypes"
                      value={carData.fuelTypes || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Number of Seats
                    </label>
                    <input
                      type="number"
                      name="numberOfSeats"
                      value={carData.numberOfSeats || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: "15px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "5px",
                        fontWeight: "500",
                      }}
                    >
                      Mileage
                    </label>
                    <input
                      type="text"
                      name="mileage"
                      value={carData.mileage || ""}
                      onChange={handleChange}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div style={{ marginTop: "20px" }}>
                <h3 style={{ color: "#5C4B3D", marginBottom: "15px" }}>
                  Additional Details
                </h3>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    Location Address
                  </label>
                  <input
                    type="text"
                    name="location.address"
                    value={carData.location?.address || ""}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    License Plate
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={carData.licensePlate || ""}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    VIN (Vehicle Identification Number)
                  </label>
                  <input
                    type="text"
                    name="vin"
                    value={carData.vin || ""}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "500",
                    }}
                  >
                    Additional Features
                  </label>
                  <textarea
                    name="additionalFeatures"
                    value={carData.additionalFeatures || ""}
                    onChange={handleChange}
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      minHeight: "100px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: "500",
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={carData.isAvailable}
                      onChange={handleChange}
                      style={{ marginRight: "8px" }}
                    />
                    Car is Available for Rent
                  </label>
                </div>
              </div>

              {/* Car Images */}
              {photos.length > 0 && (
                <div style={{ marginTop: "20px", marginBottom: "30px" }}>
                  <h3 style={{ color: "#5C4B3D", marginBottom: "15px" }}>
                    Car Images
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      overflowX: "auto",
                      padding: "10px 0",
                    }}
                  >
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        style={{
                          width: "150px",
                          height: "100px",
                          flexShrink: 0,
                          position: "relative",
                        }}
                      >
                        <img
                          src={`http://localhost:5000${photo}`}
                          alt={`Car photo ${index + 1}`}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.src = "/Model1.png"; // Fallback image
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      marginTop: "10px",
                      fontSize: "14px",
                      color: "#666",
                    }}
                  >
                    To update images, please contact the system administrator.
                  </p>
                </div>
              )}

              {/* Buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "30px",
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate("/admin-units")}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#e0e0e0",
                    color: "#333",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "10px 30px",
                    backgroundColor: "#5C4B3D",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    opacity: loading ? 0.7 : 1,
                  }}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditCar; 