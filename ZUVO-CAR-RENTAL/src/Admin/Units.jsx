import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];

const Units = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [carType, setCarType] = useState("");
  const [status, setStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [admin, setAdmin] = useState({});

  // Fetch cars on component mount
  useEffect(() => {
    fetchCars();
    // Get admin info from localStorage
    const adminInfo = localStorage.getItem("admin");
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    }
  }, [currentPage]);

  const fetchCars = async () => {
    setLoading(true);
    try {
      // Get admin token from localStorage
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("You must be logged in as admin");
        setLoading(false);
        return;
      }

      // Build query parameters
      let queryParams = `?page=${currentPage}`;
      if (searchName) queryParams += `&carName=${searchName}`;
      if (carType) queryParams += `&brand=${carType}`;
      if (status === "available") queryParams += `&available=true`;
      if (status === "unavailable") queryParams += `&available=false`;

      // Make API request
      const response = await axios.get(
        `http://localhost:5000/api/cars/admin/cars${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCars(response.data.cars);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to fetch cars");
      }
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError(
        err.response?.data?.error || "An error occurred while fetching cars"
      );
      toast.error(err.response?.data?.error || "Failed to fetch cars");
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filters
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCars();
  };

  // Handle car deletion
  const handleDeleteCar = async (carId) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`http://localhost:5000/api/cars/admin/cars/${carId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        toast.success("Car deleted successfully");
        fetchCars(); // Refresh the list
      } catch (err) {
        console.error("Error deleting car:", err);
        toast.error(err.response?.data?.error || "Failed to delete car");
      }
    }
  };

  // Format price to display with currency
  const formatPrice = (price) => {
    return `₹${price}/hr`;
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
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1230px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h1
              style={{ fontSize: "20px", fontWeight: "bold", color: "black" }}
            >
              UNITS
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
              <div>
                <p
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    margin: 0,
                    color: "black",
                  }}
                >
                  {admin.name || "Admin Name"}
                </p>
                <p style={{ fontSize: "12px", margin: 0, color: "black" }}>
                  Admin
                </p>
              </div>
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
                marginBottom: "10px",
              }}
            >
              {error}
            </div>
          )}

          {/* Search Filters and Add Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <form
              onSubmit={handleSearch}
              style={{ display: "flex", gap: "10px" }}
            >
              <input
                type="text"
                placeholder="Search Name"
                style={{ padding: "6px" }}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              
              <button
                type="submit"
                style={{
                  backgroundColor: "#5C4B3D",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </form>
            <button
              style={{
                backgroundColor: "#5C4B3D",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => {
                /* Add functionality */
              }}
            >
              Add Unit
            </button>
          </div>

          {/* Loading indicator */}
          {loading && (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "#5C4B3D",
              }}
            >
              Loading cars...
            </div>
          )}

          {/* Units Grid */}
          {!loading && cars.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "30px",
                fontSize: "16px",
                color: "#5C4B3D",
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              No cars found. Try adjusting your search criteria.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "20px",
                width: "100%",
                color: "#41372D",
              }}
            >
              {cars.map((car) => (
                <div
                  key={car._id}
                  style={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.1)",
                    backgroundColor: "#fff",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#5C4B3D",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      color: "#41372D",
                      height: "150px",
                      position: "relative",
                    }}
                  >
                    {car.photos && car.photos.length > 0 ? (
                      <img
                        src={`http://localhost:5000${car.photos[0]}`}
                        alt={car.carName}
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          e.target.src = "/Model1.png"; // Fallback image
                        }}
                      />
                    ) : (
                      <img
                        src="/Model1.png"
                        alt={car.carName}
                        style={{ height: "100px", objectFit: "contain" }}
                      />
                    )}
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        backgroundColor: car.isAvailable
                          ? "rgba(46, 125, 50, 0.8)"
                          : "rgba(211, 47, 47, 0.8)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {car.isAvailable ? "Available" : "Unavailable"}
                    </div>
                  </div>
                  <div
                    style={{
                      padding: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0 }}>{car.carName}</h4>
                      <p style={{ margin: "4px 0 0 0", fontSize: "14px" }}>
                        {car.brand} | {car.carModel || "N/A"}
                      </p>
                      <p
                        style={{
                          margin: "4px 0 0 0",
                          fontWeight: "bold",
                          color: "#5C4B3D",
                        }}
                      >
                        {formatPrice(car.rentalPrice)}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link to={`/admin-edit-car/${car._id}`}>
                        <button
                          style={{
                            background: "#5C4B3D",
                            border: "none",
                            borderRadius: "4px",
                            padding: "6px",
                            cursor: "pointer",
                          }}
                        >
                          <FiEdit2 color="white" size={18} />
                        </button>
                      </Link>
                      <button
                        style={{
                          background: "#c62828",
                          border: "none",
                          borderRadius: "4px",
                          padding: "6px",
                          cursor: "pointer",
                        }}
                        onClick={() => handleDeleteCar(car._id)}
                      >
                        <FiTrash2 color="white" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "20px",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "6px 12px",
                  backgroundColor: currentPage === 1 ? "#d5cfc2" : "#5C4B3D",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: currentPage === 1 ? "default" : "pointer",
                }}
              >
                Previous
              </button>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#41372D",
                }}
              >
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                style={{
                  padding: "6px 12px",
                  backgroundColor:
                    currentPage === totalPages ? "#d5cfc2" : "#5C4B3D",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: currentPage === totalPages ? "default" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
          </div>
      </div>
    </div>
  );
};

export default Units;
