import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiEye } from "react-icons/fi";
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

const Clients = () => {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [admin, setAdmin] = useState({});

  // Fetch hosts on component mount
  useEffect(() => {
    fetchHosts();
    // Get admin info from localStorage
    const adminInfo = localStorage.getItem("admin");
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    }
  }, [currentPage]);

  const fetchHosts = async () => {
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
      if (searchName) queryParams += `&name=${searchName}`;

      // Make API request
      const response = await axios.get(
        `http://localhost:5000/api/host/admin/hosts${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setHosts(response.data.hosts);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to fetch hosts");
      }
    } catch (err) {
      console.error("Error fetching hosts:", err);
      setError(
        err.response?.data?.error || "An error occurred while fetching hosts"
      );
      toast.error(err.response?.data?.error || "Failed to fetch hosts");
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchHosts();
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString()}`;
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
              HOSTS
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

          {/* Search and Add Button */}
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
                placeholder="Search Host Name"
                style={{
                  padding: "8px",
                  width: "250px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#5C4B3D",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Search
              </button>
            </form>
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
              Loading hosts...
            </div>
          )}

          {/* Client Table */}
          {!loading && hosts.length === 0 ? (
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
              No hosts found. Try adjusting your search criteria.
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#e4dbc2",
                borderRadius: "8px",
                padding: "12px",
                overflowX: "auto",
              }}
            >
              {/* Table Header */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr 1fr",
                  fontWeight: "bold",
                  padding: "8px 0",
                  backgroundColor: "#9c8c74",
                  color: "#fff",
                  borderRadius: "6px",
                }}
              >
                <div style={{ paddingLeft: "8px" }}>Host Name</div>
               
                <div>Phone</div>
                <div>Verification</div>
                <div>Earnings</div>
                <div>Actions</div>
              </div>

              {/* Host Rows */}
              {hosts.map((host) => (
                <div
                  key={host._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr 1fr",
                    alignItems: "center",
                    padding: "12px 0",
                    borderBottom: "1px solid #c2b79e",
                    color: "black",
                  }}
                >
                  <div style={{ paddingLeft: "8px" }}>{host.name}</div>
                  
                  <div>{host.mobile || "Not provided"}</div>
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: host.isVerified
                          ? "#4caf50"
                          : "#f44336",
                        color: "white",
                        fontSize: "12px",
                      }}
                    >
                      {host.isVerified ? "Verified" : "Not Verified"}
                    </span>
                  </div>
                  <div style={{ fontWeight: "bold" }}>
                    {formatCurrency(host.earnings || 0)}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                    }}
                  >
                    <button
                      style={{
                        background: "#5C4B3D",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px",
                        cursor: "pointer",
                      }}
                      title="View Host Details"
                      onClick={() => {
                        /* View host details functionality */
                      }}
                    >
                      <FiEye color="white" size={18} />
                    </button>
                    <button
                      style={{
                        background: "#c62828",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px",
                        cursor: "pointer",
                      }}
                      title="Delete Host"
                      onClick={() => {
                        /* Delete host functionality */
                      }}
                    >
                      <FiTrash2 color="white" size={18} />
                    </button>
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

export default Clients;
