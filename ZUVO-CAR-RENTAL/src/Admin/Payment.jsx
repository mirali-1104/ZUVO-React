import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];

const Payment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    completed: { count: 0, total: 0 },
    pending: { count: 0, total: 0 },
    failed: { count: 0, total: 0 },
    refunded: { count: 0, total: 0 }
  });
  
  const navigate = useNavigate();

  // Get admin token from local storage (use adminToken specifically if available)
  const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
  
  // Function to test different tokens (for debugging)
  const testAuth = async () => {
    try {
      // Test with hardcoded admin token (REMOVE THIS IN PRODUCTION)
      // This is just for testing if your backend is working correctly
      const testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHp1dm8uY29tIiwiYWRtaW5JZCI6IjY1NzIxNDM2YzhlNzk1ZmNjYWVmZThjZCIsInVzZXJUeXBlIjoiYWRtaW4iLCJpYXQiOjE3MTYzMzc3MjMsImV4cCI6MTcxNjQyNDEyM30.uX7S9C3q3GBk1g0fQWvUyQ42ApF99xtD8LsrEF8RZ-g";
      
      const options = {
        headers: {
          Authorization: `Bearer ${testToken}`
        }
      };
      
      // Try a different URL pattern as the /admin/payments endpoint might be different
      let urlToTry = `http://localhost:5000/api/admin/bookings?page=1&limit=10`;
      console.log("Testing alternative URL:", urlToTry);
      
      try {
        const response = await axios.get(urlToTry, options);
        console.log("Alternative URL test successful:", response.data);
        
        // If successful with the bookings, we know auth works but need correct payments endpoint
        if (response.data.success) {
          // Try the correct payments endpoint
          urlToTry = `http://localhost:5000/api/admin/payments?page=1&limit=10`;
          console.log("Testing payments URL:", urlToTry);
          const paymentsResponse = await axios.get(urlToTry, options);
          
          if (paymentsResponse.data.success) {
            console.log("Payments URL test successful:", paymentsResponse.data);
            setPayments(paymentsResponse.data.payments || []);
            setTotalPages(paymentsResponse.data.pagination?.totalPages || 1);
            setStats(paymentsResponse.data.stats || stats);
            setLoading(false);
            setError(null);
            return;
          }
        }
      } catch (err) {
        console.log("Alternative URL failed, trying original URL...");
      }
      
      // Fall back to original URL
      urlToTry = `http://localhost:5000/api/payments/admin/payments?page=1&limit=10`;
      console.log("Testing original URL:", urlToTry);
      const response = await axios.get(urlToTry, options);
      
      if (response.data.success) {
        console.log("Original URL test successful:", response.data);
        setPayments(response.data.payments || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
        setStats(response.data.stats || stats);
        setLoading(false);
        setError(null);
      }
    } catch (err) {
      console.error("All test auth attempts failed:", err);
      setError("Authentication failed. The API endpoints might be incorrect or the server is not running.");
    }
  };
  
  // Check if token exists
  useEffect(() => {
    if (!token) {
      console.log("No authentication token found");
      setError("You must be logged in as an admin to view this page");
      setLoading(false);
      // Optionally redirect to login
      // navigate("/admin-login");
    }
  }, [token, navigate]);

  // Fetch payments from API
  const fetchPayments = async (page = 1, searchTerm = "", status = "") => {
    setLoading(true);
    
    // If no token, don't attempt API call
    if (!token) {
      setError("Authentication token is missing. Please login again.");
      setLoading(false);
      return;
    }
    
    // Set up API call options with Bearer token
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
    
    // Log the auth header for debugging (remove in production)
    console.log("Auth header:", options.headers.Authorization);
    
    // Try multiple URL patterns in sequence
    const urls = [
      `http://localhost:5000/api/payments/admin/payments?page=${page}&limit=10`,
      `http://localhost:5000/api/admin/payments?page=${page}&limit=10`,
      `http://localhost:5000/api/bookings/admin/payments?page=${page}&limit=10`
    ];
    
    // Add query parameters to each URL
    const getUrlWithParams = (baseUrl) => {
      let url = baseUrl;
      if (searchTerm) {
        url += `&search=${searchTerm}`;
      }
      if (status) {
        url += `&paymentStatus=${status}`;
      }
      return url;
    };
    
    let finalError = null;
    
    // Try each URL in sequence
    for (const baseUrl of urls) {
      const url = getUrlWithParams(baseUrl);
      console.log("Trying URL:", url);
      
      try {
        const response = await axios.get(url, options);
        
        if (response.data.success) {
          console.log("Request successful with URL:", url);
          setPayments(response.data.payments || []);
          setTotalPages(response.data.pagination?.totalPages || 1);
          setStats(response.data.stats || stats);
          setError(null);
          setLoading(false);
          return; // Exit the function on success
        } else {
          console.log("Request failed with URL:", url, response.data);
          finalError = "Failed to fetch payments";
        }
      } catch (err) {
        console.error("Error with URL:", url, err);
        // Only update finalError if we haven't got a better one
        if (!finalError || err.response?.status === 401) {
          finalError = err.response?.data?.error || "Failed to fetch payments";
          
          // Handle 401 Unauthorized specifically
          if (err.response && err.response.status === 401) {
            finalError = "Your session has expired or you don't have permission. Please login again.";
            // Clear the invalid token if 401
            localStorage.removeItem("adminToken");
            localStorage.removeItem("token");
          }
        }
      }
    }
    
    // If we get here, all URLs failed
    setError(finalError);
    setLoading(false);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPayments(1, search);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchPayments(page, search);
  };

  // Initial data load - only if token exists
  useEffect(() => {
    if (token) {
      fetchPayments(currentPage);
    } else {
      // If no normal token, try test auth (FOR DEVELOPMENT ONLY)
      testAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Added token as dependency

  // Calculate total payments amount
  const totalAmount = payments.reduce((sum, payment) => 
    sum + (payment.rawAmount || 0), 0);

  // Handle admin login
  const handleLogin = () => {
    navigate("/admin-login");
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
          color: "#2f2f2f",
          padding: "20px",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>PAYMENTS</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Link to="/admin-profile">
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  backgroundColor: "gray",
                }}
              ></div>
            </Link>
            <div>
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>Admin</p>
              <p style={{ fontSize: "12px" }}>Admin</p>
            </div>
          </div>
        </div>
        
        {/* Auth Error Message */}
        {error && error.includes("login") && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffeeba',
            color: '#856404' 
          }}>
            <h3 style={{ marginBottom: '15px' }}>Authentication Error</h3>
            <p>{error}</p>
            <button 
              onClick={handleLogin}
              style={{
                backgroundColor: "#5C4B3D",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
                marginTop: "15px"
              }}
            >
              Go to Login
            </button>
          </div>
        )}
        
        {!error?.includes("login") && (
          <>
            {/* Payment Statistics */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}
            >
              <div style={{
                background: '#e6dbc7', 
                padding: '15px', 
                borderRadius: '8px',
                width: '23%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#5d4c40' }}>Completed Payments</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {stats.completed?.count || 0}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Rs. {stats.completed?.total?.toFixed(0) || 0}
                </p>
              </div>
              
              <div style={{
                background: '#e6dbc7', 
                padding: '15px', 
                borderRadius: '8px',
                width: '23%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#5d4c40' }}>Pending Payments</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {stats.pending?.count || 0}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Rs. {stats.pending?.total?.toFixed(0) || 0}
                </p>
              </div>
              
              <div style={{
                background: '#e6dbc7', 
                padding: '15px', 
                borderRadius: '8px',
                width: '23%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#5d4c40' }}>Refunded Payments</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>
                  {stats.refunded?.count || 0}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  Rs. {stats.refunded?.total?.toFixed(0) || 0}
                </p>
              </div>
              
              <div style={{
                background: '#e6dbc7', 
                padding: '15px', 
                borderRadius: '8px',
                width: '23%',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: 0, fontSize: '14px', color: '#5d4c40' }}>Total Revenue</h3>
                <p style={{ margin: '5px 0 0 0', fontSize: '20px', fontWeight: 'bold' }}>
                  Rs. {totalAmount.toFixed(0)}
                </p>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                  From {payments.length} transactions
                </p>
              </div>
            </div>

            {/* Payments List */}
            <div
              style={{
                background: "#f0e8d9",
                padding: "20px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <form onSubmit={handleSearchSubmit} style={{ display: 'flex' }}>
                  <input
                    type="text"
                    placeholder="Search by client name"
                    value={search}
                    onChange={handleSearchChange}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginRight: "5px"
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      backgroundColor: "#7d6953",
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    Search
                  </button>
                </form>
                
                <div>
                  <select 
                    onChange={(e) => {
                      const status = e.target.value;
                      setCurrentPage(1);
                      fetchPayments(1, search, status);
                    }}
                    style={{
                      padding: "6px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      marginRight: "10px"
                    }}
                  >
                    <option value="">All Statuses</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>Loading payments...</p>
                </div>
              ) : error && !error.includes("login") ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#c62828' }}>
                  <p>{error}</p>
                  <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    <button 
                      onClick={() => fetchPayments(currentPage, search)}
                      style={{
                        backgroundColor: "#5C4B3D",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Try Again
                    </button>
                    <button 
                      onClick={testAuth}
                      style={{
                        backgroundColor: "#7d6953",
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "4px",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      Test Auth
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      backgroundColor: "#ded2ba",
                    }}
                  >
                    <thead style={{ backgroundColor: "#9a8a71", color: "white" }}>
                      <tr>
                        <th style={{ padding: "10px" }}>Client</th>
                        <th>Phone</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Car</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length > 0 ? (
                        payments.map((payment) => (
                          <tr
                            key={payment.id}
                            style={{
                              textAlign: "center",
                              borderTop: "1px solid #cbbf9f",
                            }}
                          >
                            <td style={{ padding: "10px" }}>{payment.name}</td>
                            <td>{payment.phone}</td>
                            <td>{payment.date}</td>
                            <td>
                              <span style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                fontSize: '12px',
                                backgroundColor: 
                                  payment.status === 'Completed' ? '#d4edda' :
                                  payment.status === 'Awaiting' ? '#fff3cd' :
                                  payment.status === 'Failed' ? '#f8d7da' :
                                  payment.status === 'Refunded' ? '#cce5ff' : '#f0f0f0',
                                color: 
                                  payment.status === 'Completed' ? '#155724' :
                                  payment.status === 'Awaiting' ? '#856404' :
                                  payment.status === 'Failed' ? '#721c24' :
                                  payment.status === 'Refunded' ? '#004085' : '#333'
                              }}>
                                {payment.status}
                              </span>
                            </td>
                            <td>{payment.carName}</td>
                            <td style={{ fontWeight: "bold" }}>{payment.amount}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                            No payments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'center',
                      marginTop: '20px',
                      gap: '5px'
                    }}>
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          backgroundColor: currentPage === 1 ? '#f0f0f0' : '#fff',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        // Show pages around current page
                        let pageToShow;
                        if (totalPages <= 5) {
                          pageToShow = i + 1;
                        } else if (currentPage <= 3) {
                          pageToShow = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageToShow = totalPages - 4 + i;
                        } else {
                          pageToShow = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageToShow}
                            onClick={() => handlePageChange(pageToShow)}
                            style={{
                              padding: '5px 10px',
                              borderRadius: '4px',
                              border: '1px solid #ccc',
                              backgroundColor: currentPage === pageToShow ? '#9a8a71' : '#fff',
                              color: currentPage === pageToShow ? '#fff' : '#333',
                              cursor: 'pointer'
                            }}
                          >
                            {pageToShow}
                          </button>
                        );
                      })}
                      
                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: '1px solid #ccc',
                          backgroundColor: currentPage === totalPages ? '#f0f0f0' : '#fff',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
