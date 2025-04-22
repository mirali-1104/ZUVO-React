import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  YAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [carTypes, setCarTypes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    brand: "",
    name: "",
    totalUnits: "",
    bookedUnits: "",
    pricePerDay: "",
  });
  const [file, setFile] = useState(null);
  const [bookingStats, setBookingStats] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalRevenue: 0,
    totalCars: 0,
    totalHosts: 0,
    totalUsers: 0,
    loading: true
  });
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin",
    email: "",
    loading: true
  });

  // Default data in case API fails
  const defaultBookingData = [
    { name: "Jan", value: 800 },
    { name: "Feb", value: 650 },
    { name: "Mar", value: 700 },
    { name: "Apr", value: 600 },
    { name: "May", value: 400 },
    { name: "Jun", value: 600 },
    { name: "Jul", value: 950 },
    { name: "Aug", value: 1200 },
    { name: "Sep", value: 850 },
    { name: "Oct", value: 900 },
    { name: "Nov", value: 700 },
    { name: "Dec", value: 680 },
  ];

  // Default pie data in case API fails
  const defaultPieData = [
    { name: "Confirmed", value: 52 },
    { name: "Cancelled", value: 21 },
    { name: "Pending", value: 15 },
    { name: "Completed", value: 32 },
  ];

  const COLORS = ["#58A06E", "#DA524E", "#F0A93B", "#3B82F6"];

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { label: "Bookings", icon: "📑", path: "/admin-bookings" },
    { label: "Units", icon: "🚗", path: "/admin-units" },
    { label: "Clients", icon: "👥", path: "/admin-clients" },
    { label: "Payments", icon: "💳", path: "/admin-payments" },
  ];

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/carType/car-types"
      );
      setCarTypes(res.data);
    } catch (error) {
      console.error("Error fetching car types:", error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      setDashboardStats(prev => ({ ...prev, loading: true }));
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found for fetchDashboardStats");
        setDashboardStats({
          totalRevenue: 0, 
          totalCars: 0,
          totalHosts: 0,
          totalUsers: 0,
          loading: false
        });
        return;
      }
      
      // Fetch total revenue from bookings
      const revenueResponse = await axios.get(
        `http://localhost:5000/api/bookings/revenue`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Fetch total cars count
      const carsResponse = await axios.get(
        `http://localhost:5000/api/cars/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Fetch total hosts count
      const hostsResponse = await axios.get(
        `http://localhost:5000/api/host/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Fetch total users count
      const usersResponse = await axios.get(
        `http://localhost:5000/api/users/count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      setDashboardStats({
        totalRevenue: revenueResponse.data?.totalRevenue || 0,
        totalCars: carsResponse.data?.count || 0,
        totalHosts: hostsResponse.data?.count || 0,
        totalUsers: usersResponse.data?.count || 0,
        loading: false
      });
      
      console.log("Revenue data fetched:", revenueResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      // Set default values in case of error
      setDashboardStats({
        totalRevenue: 0, 
        totalCars: 0,
        totalHosts: 0,
        totalUsers: 0,
        loading: false
      });
    }
  };

  const fetchBookingStats = async () => {
    setLoadingBookings(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      
      if (!token) {
        console.log("No token found for fetchBookingStats");
        setBookingStats(defaultPieData);
        setMonthlyTrends(defaultBookingData);
        setLoadingBookings(false);
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/bookings/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.success) {
        const { confirmed, cancelled, pending, completed, monthlyTrends: trends } = response.data;

        // Set booking status data for pie chart using all possible statuses
        const bookingStatusData = [
          { name: "Confirmed", value: confirmed || 0 },
          { name: "Cancelled", value: cancelled || 0 },
          { name: "Pending", value: pending || 0 },
          { name: "Completed", value: completed || 0 }
        ].filter(item => item.value > 0); // Only include statuses with values > 0

        setBookingStats(bookingStatusData.length > 0 ? bookingStatusData : defaultPieData);

        // Set monthly trends data for bar chart and line chart
        if (trends && trends.length > 0) {
          setMonthlyTrends(trends);
        } else {
          setMonthlyTrends(defaultBookingData);
        }
      }
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      // Use default data if API call fails
      setBookingStats(defaultPieData);
      setMonthlyTrends(defaultBookingData);
    } finally {
      setLoadingBookings(false);
    }
  };

  // Function to fetch admin profile
  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      if (!token) {
        console.log("No admin token found");
        setAdminProfile({
          name: "Admin",
          email: "",
          loading: false
        });
        return;
      }

      console.log("Using token:", token.substring(0, 15) + "...");

      // First, try the correct endpoint based on the adminRoutes.js file
      try {
        const response = await axios.get(
          "http://localhost:5000/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        console.log("Admin profile response:", response.data);
        
        if (response.data) {
          // The API returns the admin object directly
          setAdminProfile({
            name: response.data.name || "Admin",
            email: response.data.email || "",
            loading: false
          });
          console.log("Admin profile set from direct response");
          return;
        }
      } catch (err) {
        console.log("Error with primary admin profile endpoint:", err.message);
      }
      
      // If first attempt fails, try alternative endpoints
      const endpoints = [
        "http://localhost:5000/api/admins/profile",
        "http://localhost:5000/api/admin/me"
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Trying alternative endpoint: ${endpoint}`);
          const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data) {
            // Check different possible response formats
            const profileData = response.data.admin || response.data.user || response.data;
            
            setAdminProfile({
              name: profileData.name || "Admin",
              email: profileData.email || "",
              loading: false
            });
            console.log("Admin profile set from alternative endpoint");
            return;
          }
        } catch (err) {
          console.log(`Error with endpoint ${endpoint}:`, err.message);
        }
      }

      // If we reach here, none of the endpoints worked
      console.log("Could not fetch admin profile from any endpoint");
      
      // Try to decode the token to at least get the email
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token payload:", payload);
          
          if (payload.email) {
            setAdminProfile({
              name: payload.name || "Admin",
              email: payload.email,
              loading: false
            });
            console.log("Admin email set from token payload");
            return;
          }
        }
      } catch (e) {
        console.log("Error decoding token:", e);
      }
      
      // Final fallback
      setAdminProfile({
        name: "Admin",
        email: "",
        loading: false
      });
      
    } catch (error) {
      console.error("Error in admin profile fetch:", error);
      setAdminProfile({
        name: "Admin",
        email: "",
        loading: false
      });
    }
  };

  useEffect(() => {
    fetchData();
    fetchBookingStats();
    fetchDashboardStats();
    fetchAdminProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("brand", form.brand);
    formData.append("name", form.name);
    formData.append("totalUnits", form.totalUnits);
    formData.append("bookedUnits", form.bookedUnits);
    formData.append("pricePerDay", form.pricePerDay);
    formData.append("image", file);

    // Log FormData contents
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/carType/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowForm(false);
      setForm({
        brand: "",
        name: "",
        totalUnits: "",
        bookedUnits: "",
        pricePerDay: "",
      });
      setFile(null);
      fetchData();
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const getTotalBookings = () => {
    if (!bookingStats.length) return 0;
    return bookingStats.reduce((total, item) => total + item.value, 0);
  };

  const getPercentage = (value) => {
    const total = getTotalBookings();
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardStats.totalRevenue),
      icon: "💰",
      color: "#58A06E"
    },
    {
      title: "Total Cars",
      value: dashboardStats.totalCars,
      icon: "🚗",
      color: "#5B8AF0"
    },
    {
      title: "Total Hosts",
      value: dashboardStats.totalHosts,
      icon: "🏠",
      color: "#D3A048"
    },
    {
      title: "Total Users",
      value: dashboardStats.totalUsers,
      icon: "👥",
      color: "#A06ECB"
    }
  ];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        fontFamily: "sans-serif",
        overflow: "hidden",
        background: "41372D",
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
          boxShadow: "2px 0 10px #41372D",
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
          background: "linear-gradient(to bottom right, #41372D, #41372D)",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h1 style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}>
            DASHBOARD
          </h1>
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
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>
                {adminProfile.loading ? "Loading..." : adminProfile.name}
              </p>
              <p style={{ fontSize: "12px" }}>
                {adminProfile.email || "Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          {dashboardStats.loading ? (
            <div 
              style={{ 
                background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
                padding: "16px",
                flex: 1,
                color: "#41372D",
                borderRadius: "10px",
                textAlign: "center"
              }}
            >
              Loading dashboard statistics...
            </div>
          ) : (
            statCards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
                  padding: "16px",
                  flex: 1,
                  color: "#41372D",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div 
                  style={{ 
                    position: "absolute", 
                    top: 0, 
                    left: 0, 
                    height: "5px", 
                    width: "100%", 
                    background: card.color 
                  }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h3 style={{ fontSize: "14px", opacity: 0.8 }}>{card.title}</h3>
                    <p style={{ fontSize: "24px", fontWeight: "bold", marginTop: "8px" }}>{card.value}</p>
                  </div>
                  <div style={{ 
                    fontSize: "28px", 
                    opacity: 0.8, 
                    backgroundColor: `${card.color}20`,
                    width: "48px",
                    height: "48px",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 2,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Booking Overview</h3>
            {loadingBookings ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading booking data...
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthlyTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} bookings`, "Count"]}
                      labelFormatter={(name) => `Month: ${name}`}
                    />
                    <Bar dataKey="value" name="Bookings" fill="#332f2b" />
                  </BarChart>
                </ResponsiveContainer>
                <h3 style={{ marginTop: "20px" }}>Booking Trends</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`${value} bookings`, "Count"]}
                      labelFormatter={(name) => `Month: ${name}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Bookings"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            )}
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3
              style={{
                color: "#41372D",
                borderRadius: "10px",
              }}
            >
              Booking Status
            </h3>
            {loadingBookings ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                Loading...
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={bookingStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {bookingStats.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} bookings`, "Count"]}
                      labelFormatter={(name) => `Status: ${name}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <ul
                  style={{
                    fontSize: "14px",
                    marginTop: "10px",
                    color: "#41372D",
                    listStyleType: "none",
                  }}
                >
                  {bookingStats.map((stat, index) => (
                    <li key={index}>
                      <span style={{ 
                        display: 'inline-block', 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: COLORS[index % COLORS.length],
                        marginRight: '5px'
                      }}></span> 
                      {stat.name} - {getPercentage(stat.value)}%
                      ({stat.value})
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {/* Reminders and Activities */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>
              Reminders <button style={{ float: "right" }}>+</button>
            </h3>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#dcd6c8",
                  marginTop: "8px",
                  padding: "8px",
                  border: "1px solid #41372D",
                  borderRadius: "10px",
                }}
              >
                Inspect and service the fleet vehicles.
                <br />
                2025-10-10
              </div>
            ))}
          </div>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 2,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Recent Activities</h3>
            <div style={{ fontSize: "14px", padding: "10px" }}>
              <p>
                <strong>Today</strong>
              </p>
              <p>
                ✅ Alice Johnson completed a booking for Toyota Corolla (TX1234)
                - 10:15AM
              </p>
              <p>
                🕒 Rob Smith's booking for Honda Civic (RX5678) is pending
                payment - 10:45PM
              </p>
              <p>
                <br />
                <strong>Yesterday</strong>
              </p>
              <p>
                ✅ Alice Johnson completed a booking for Toyota Corolla (TX1234)
                - 10:15AM
              </p>
              <p>
                🕒 Rob Smith's booking for Honda Civic (RX5678) is pending
                payment - 10:45PM
              </p>
            </div>
          </div>
        </div>

        {/* Car Availability & Car Types */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 1,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <h3>Car Availability</h3>
            <select
              style={{
                width: "100%",
                marginTop: "20px",
                marginBottom: "15px",
                background: "#41372d",
              }}
            >
              <option>Car Type</option>
            </select>
            <input
              type="date"
              style={{
                width: "100%",
                marginBottom: "8px",
                height: "35px",
                padding: "7px",
              }}
            />
            <input
              type="date"
              style={{
                width: "100%",
                marginBottom: "16px",
                height: "35px",
                padding: "7px",
              }}
            />
            <button
              style={{
                width: "100%",
                backgroundColor: "red",
                color: "white",
                padding: "8px",
              }}
            >
              Check
            </button>
          </div>

          <div
            style={{
              background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
              padding: "16px",
              flex: 3,
              color: "#41372D",
              borderRadius: "10px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3>Car Types</h3>
              <button onClick={() => setShowForm(true)}>Add</button>
            </div>

            {carTypes.map((car, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <img
                  src={`http://localhost:5000/uploads/${car.img}`}
                  alt={car.name}
                  style={{
                    width: "60px",
                    height: "40px",
                    objectFit: "fill",
                    marginRight: "10px",
                  }}
                />
                <span style={{ width: "80px" }}>{car.name}</span>
                <div
                  style={{
                    flex: 1,
                    backgroundColor: "#dcd6c8",
                    height: "10px",
                    borderRadius: "10px",
                    margin: "0 10px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "red",
                      height: "100%",
                      width: `${car.percent}%`,
                      borderRadius: "10px",
                    }}
                  ></div>
                </div>
                <span>{car.percent.toFixed(1)}%</span>
              </div>
            ))}

            {showForm && (
              <div
                style={{
                  position: "fixed",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  background: "#fff",
                  padding: "30px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 15px rgba(0,0,0,0.3)",
                  zIndex: 1000,
                  width: "400px",
                }}
              >
                <h4
                  style={{
                    marginBottom: "20px",
                    textAlign: "center",
                    color: "#41372D",
                  }}
                >
                  Add New Car Type
                </h4>
                <form onSubmit={handleSubmit}>
                  <input
                    name="brand"
                    placeholder="Brand"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    name="name"
                    placeholder="Car Name"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    name="totalUnits"
                    placeholder="Total Units"
                    type="number"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    name="bookedUnits"
                    placeholder="Booked Units"
                    type="number"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    name="pricePerDay"
                    placeholder="Price per day"
                    type="number"
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      marginBottom: "10px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <input
                    type="file"
                    onChange={handleFileChange}
                    required
                    style={{
                      marginBottom: "20px",
                    }}
                  />
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      type="submit"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#58A06E",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#4a8a5c")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#58A06E")
                      }
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#DA524E",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        transition: "background 0.3s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#c44a44")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#DA524E")
                      }
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
