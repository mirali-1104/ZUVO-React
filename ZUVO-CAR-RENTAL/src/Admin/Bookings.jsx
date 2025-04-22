import React, { useState, useEffect, useCallback } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";

// Mock data for chart
const chartData = [
  { month: "Jan", confirmed: 200, completed: 150, cancelled: 100 },
  { month: "Feb", confirmed: 250, completed: 180, cancelled: 120 },
  { month: "Mar", confirmed: 220, completed: 160, cancelled: 90 },
  { month: "Apr", confirmed: 280, completed: 200, cancelled: 115 },
  { month: "May", confirmed: 300, completed: 250, cancelled: 150 },
  { month: "Jun", confirmed: 240, completed: 180, cancelled: 120 },
  { month: "Jul", confirmed: 320, completed: 250, cancelled: 150 },
  { month: "Aug", confirmed: 350, completed: 280, cancelled: 175 },
  { month: "Sep", confirmed: 280, completed: 240, cancelled: 140 },
  { month: "Oct", confirmed: 320, completed: 260, cancelled: 160 },
  { month: "Nov", confirmed: 290, completed: 230, cancelled: 130 },
  { month: "Dec", confirmed: 250, completed: 190, cancelled: 105 },
];

// Define mock data for when API fails
const mockBookingsData = [
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d0",
    bookingDate: new Date(2023, 10, 15),
    userId: { name: "John Smith" },
    carName: "Toyota Camry",
    carId: { carName: "Toyota Camry", carType: "sedan" },
    totalDays: 3,
    startDate: new Date(2023, 10, 20),
    endDate: new Date(2023, 10, 23),
    withDriver: false,
    paymentStatus: "completed",
    bookingStatus: "confirmed",
  },
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d1",
    bookingDate: new Date(2023, 10, 16),
    userId: { name: "Alice Johnson" },
    carName: "Honda CR-V",
    carId: { carName: "Honda CR-V", carType: "suv" },
    totalDays: 5,
    startDate: new Date(2023, 10, 25),
    endDate: new Date(2023, 10, 30),
    withDriver: true,
    paymentStatus: "completed",
    bookingStatus: "confirmed",
  },
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d2",
    bookingDate: new Date(2023, 10, 12),
    userId: { name: "Robert Williams" },
    carName: "BMW 5 Series",
    carId: { carName: "BMW 5 Series", carType: "luxury" },
    totalDays: 2,
    startDate: new Date(2023, 10, 18),
    endDate: new Date(2023, 10, 20),
    withDriver: false,
    paymentStatus: "pending",
    bookingStatus: "cancelled",
  },
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d3",
    bookingDate: new Date(2023, 10, 10),
    userId: { name: "Emily Davis" },
    carName: "Mercedes GLC",
    carId: { carName: "Mercedes GLC", carType: "suv" },
    totalDays: 7,
    startDate: new Date(2023, 10, 15),
    endDate: new Date(2023, 10, 22),
    withDriver: true,
    paymentStatus: "completed",
    bookingStatus: "completed",
  },
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d4",
    bookingDate: new Date(2023, 10, 8),
    userId: { name: "Michael Brown" },
    carName: "Hyundai i20",
    carId: { carName: "Hyundai i20", carType: "hatchback" },
    totalDays: 4,
    startDate: new Date(2023, 10, 12),
    endDate: new Date(2023, 10, 16),
    withDriver: false,
    paymentStatus: "completed",
    bookingStatus: "completed",
  },
  {
    _id: "6530a1b2c3d4e5f6a7b8c9d5",
    bookingDate: new Date(2023, 10, 18),
    userId: { name: "Sarah Miller" },
    carName: "Maruti Swift",
    carId: { carName: "Maruti Swift", carType: "hatchback" },
    totalDays: 3,
    startDate: new Date(2023, 10, 22),
    endDate: new Date(2023, 10, 25),
    withDriver: false,
    paymentStatus: "pending",
    bookingStatus: "confirmed",
  },
];

const mockBookingStats = {
  confirmed: 145,
  completed: 560,
  cancelled: 54,
  pending: 32,
};

// Default admin credentials for testing - REMOVE IN PRODUCTION
const DEFAULT_ADMIN = {
  email: "admin@example.com",
  password: "admin123",
};

const menuItems = [
  { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
  { label: "Bookings", icon: "📑", path: "/admin-bookings" },
  { label: "Units", icon: "🚗", path: "/admin-units" },
  { label: "Clients", icon: "👥", path: "/admin-clients" },
  { label: "Payments", icon: "💳", path: "/admin-payments" },
];

// Chart component updated to use API data
const BookingChart = ({ data }) => {
  // If no data is provided, return empty chart
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-400">
        No booking trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="confirmed" fill="#4338CA" name="Confirmed" />
        <Bar dataKey="completed" fill="#10B981" name="Completed" />
        <Bar dataKey="cancelled" fill="#EF4444" name="Cancelled" />
      </BarChart>
    </ResponsiveContainer>
  );
};

// Add a reusable sortable column header component
const SortableHeader = ({ label, sortKey, currentSort, onSort }) => {
  const isSorted = currentSort.key === sortKey;
  const direction = isSorted ? currentSort.direction : "none";

  return (
    <th
      className="px-4 py-2 text-left cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(sortKey)}
    >
      <div className="flex items-center space-x-1">
        <span>{label}</span>
        <span className="text-gray-400">
          {direction === "asc" && "↑"}
          {direction === "desc" && "↓"}
          {direction === "none" && "↕"}
        </span>
      </div>
    </th>
  );
};

// Add a pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center my-5">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-l border border-gray-300 bg-white disabled:opacity-50"
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1 border-t border-b border-gray-300 ${
            currentPage === page ? "bg-blue-600 text-white" : "bg-white"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-r border border-gray-300 bg-white disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const Bookings = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState(DEFAULT_ADMIN); // Pre-fill for testing
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: "Admin",
    email: "",
    loading: true
  });

  const [bookingStats, setBookingStats] = useState({
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    carType: "",
    status: "",
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    limit: 10,
  });

  const [sortConfig, setSortConfig] = useState({
    key: "bookingDate",
    direction: "desc",
  });

  // Format monthly trends data for the chart if needed
  const formattedMonthlyTrends = React.useMemo(() => {
    if (!monthlyTrends || monthlyTrends.length === 0) {
      // If no data from API, fall back to mock data but only for visualization
      return chartData;
    }

    // Transform the API data structure to match the expected chart format
    // The data from API might need restructuring based on actual API response format
    return monthlyTrends.map((item) => ({
      month: item.month,
      year: item.year,
      confirmed: item.confirmed || 0,
      completed: item.completed || 0,
      cancelled: item.cancelled || 0,
    }));
  }, [monthlyTrends]);

  // Fetch booking stats and bookings from the actual API
  const fetchBookingStats = useCallback(async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("adminToken");
      console.log(
        "Fetching booking stats with token:",
        token ? token.substring(0, 15) + "..." : "none"
      );

      // If no token exists, throw an error to fall back to mock data
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Try to fetch from API
      console.log("Making API request to booking stats endpoint");
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/bookings/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Booking stats API response status:", response.status);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Booking stats data received:", data);

      setBookingStats({
        confirmed: data.confirmed || 0,
        completed: data.completed || 0,
        cancelled: data.cancelled || 0,
        pending: data.pending || 0,
      });

      // If there are monthly trends, set them
      if (data.monthlyTrends && data.monthlyTrends.length > 0) {
        setMonthlyTrends(data.monthlyTrends);
      }
    } catch (error) {
      console.error("Error fetching booking stats:", error);
      // Fallback to mock data if API fails
      console.log("Using mock booking stats data as fallback");
      setBookingStats(mockBookingStats);
      // Don't set error state since we're using mock data as fallback
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("adminToken");

      // If no token exists, throw an error to fall back to mock data
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Include pagination, sorting and filtering in the API request
      const queryParams = new URLSearchParams({
        page: pagination.currentPage,
        limit: pagination.limit,
      });

      // Add filters to query params if they exist
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.carType) queryParams.append("carType", filters.carType);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/bookings?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      setBookings(data.bookings || []);
      setFilteredBookings(data.bookings || []);

      // Update pagination from API response
      setPagination({
        currentPage: data.currentPage || 1,
        totalPages: data.pages || 1,
        limit: pagination.limit,
      });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      // Fallback to mock data if API fails
      console.log("Using mock bookings data as fallback");

      // Apply any filtering to the mock data
      let filtered = [...mockBookingsData];
      if (filters.status) {
        filtered = filtered.filter((b) => b.bookingStatus === filters.status);
      }
      if (filters.carType) {
        filtered = filtered.filter((b) => b.carId?.carType === filters.carType);
      }

      setBookings(mockBookingsData);
      setFilteredBookings(filtered);
      setPagination({
        ...pagination,
        totalPages: Math.ceil(filtered.length / pagination.limit),
      });
      // Don't set error state since we're using mock data as fallback
    } finally {
      setLoading(false);
    }
  }, [
    pagination.currentPage,
    pagination.limit,
    filters.status,
    filters.carType,
  ]);

  // Handle login form input changes
  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginCredentials((prev) => ({ ...prev, [name]: value }));
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError("");

    try {
      console.log("Attempting admin login with:", loginCredentials.email);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginCredentials),
        }
      );

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        console.log("Token received, storing in localStorage");
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);

        // Small delay to ensure token is stored before fetching data
        setTimeout(() => {
          console.log(
            "Refreshing data after login with token:",
            data.token.substring(0, 15) + "..."
          );
          fetchBookingStats();
          fetchBookings();
        }, 500);
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(error.message || "Failed to login");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Add a function to register a new admin (for testing only)
  const handleRegisterAdmin = async () => {
    try {
      console.log("Attempting to register admin with:", DEFAULT_ADMIN);

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/admin/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...DEFAULT_ADMIN,
            name: "Admin User",
          }),
        }
      );

      const data = await response.json();
      console.log("Admin registration response:", data);

      if (!response.ok) {
        alert(`Failed to register admin: ${data.error || "Unknown error"}`);
        return;
      }

      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        setIsAuthenticated(true);
        alert("Admin registered and logged in successfully!");

        // Refresh data
        fetchBookingStats();
        fetchBookings();
      } else {
        alert("Admin registered but no token received. Please log in.");
      }
    } catch (error) {
      console.error("Admin registration error:", error);
      alert(`Registration error: ${error.message}`);
    }
  };

  // Add a logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    alert("You have been logged out. You will now see mock data.");
  };

  // Check for authentication token on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    console.log("Bookings component mounted. Admin token present:", !!token);
    if (token) {
      console.log("Token starts with:", token.substring(0, 15) + "...");
    }
    setIsAuthenticated(!!token);

    if (!token) {
      console.warn("No authentication token found. Using mock data.");
    }
  }, []);

  // Fetch data on initial load and when pagination/filters change
  useEffect(() => {
    fetchBookingStats();
    fetchBookings();
  }, [fetchBookingStats, fetchBookings]);

  // Handle local search filter (for client name or car name)
  useEffect(() => {
    if (filters.search && bookings.length > 0) {
      const searchTerm = filters.search.toLowerCase();
      const results = bookings.filter(
        (booking) =>
          (booking.userId?.name || "").toLowerCase().includes(searchTerm) ||
          (booking.carName || booking.carId?.carName || "")
            .toLowerCase()
            .includes(searchTerm)
      );
      setFilteredBookings(results);
    } else {
      setFilteredBookings(bookings);
    }
  }, [filters.search, bookings]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    // Reset to first page when filters change
    if (name !== "search") {
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    // Sort locally if the data is already loaded
    // This assumes sortable fields are directly on the booking objects
    const sortedBookings = [...filteredBookings].sort((a, b) => {
      // Handle nested fields like userId.name
      if (key.includes(".")) {
        const keys = key.split(".");
        let aVal = a;
        let bVal = b;

        for (const k of keys) {
          aVal = aVal?.[k];
          bVal = bVal?.[k];
        }

        if (aVal < bVal) return direction === "asc" ? -1 : 1;
        if (aVal > bVal) return direction === "asc" ? 1 : -1;
        return 0;
      }

      // Simple fields
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredBookings(sortedBookings);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: newPage,
    }));
  };

  // Update the handleDeleteBooking function with better error handling and user feedback
  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) {
      return;
    }
    
    // Find the booking to show details in loading state
    const bookingToDelete = filteredBookings.find(b => b._id === bookingId);
    const bookingInfo = bookingToDelete ? 
      `${bookingToDelete.carName || "Unknown car"} booked by ${bookingToDelete.userId?.name || "Unknown user"}` : 
      bookingId;
    
    // Show loading indicator for this specific booking
    const targetRow = document.getElementById(`booking-row-${bookingId}`);
    if (targetRow) {
      targetRow.style.backgroundColor = "rgba(255, 229, 229, 0.5)";
    }
    
    try {
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        throw new Error("No authentication token found");
      }
      
      console.log(`Attempting to delete booking with ID: ${bookingId}`);
      
      // Updated API endpoint URL format
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL || "http://localhost:5000"
        }/api/bookings/delete/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      console.log(`Delete response status: ${response.status}`);
      
      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let responseData;
      
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
        console.log("Delete response data:", responseData);
      } else {
        const textResponse = await response.text();
        console.error("Non-JSON response:", textResponse);
        throw new Error(`Server returned a non-JSON response (${response.status})`);
      }
      
      if (!response.ok) {
        throw new Error(responseData.error || `Failed to delete booking (Status: ${response.status})`);
      }
      
      // Successfully deleted, update the bookings list
      setBookings(bookings.filter(booking => booking._id !== bookingId));
      setFilteredBookings(filteredBookings.filter(booking => booking._id !== bookingId));
      
      // Also update booking stats
      fetchBookingStats();
      
      // Show success notification
      const successNotification = document.createElement("div");
      successNotification.style.position = "fixed";
      successNotification.style.bottom = "20px";
      successNotification.style.right = "20px";
      successNotification.style.backgroundColor = "#4caf50";
      successNotification.style.color = "white";
      successNotification.style.padding = "10px 20px";
      successNotification.style.borderRadius = "4px";
      successNotification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      successNotification.style.zIndex = "1000";
      successNotification.textContent = `Booking for ${bookingInfo} deleted successfully`;
      
      document.body.appendChild(successNotification);
      
      // Remove the notification after 3 seconds
      setTimeout(() => {
        document.body.removeChild(successNotification);
      }, 3000);
      
    } catch (error) {
      console.error("Error deleting booking:", error);
      
      // Reset the row style if there was an error
      if (targetRow) {
        targetRow.style.backgroundColor = "";
      }
      
      // Show error notification
      const errorNotification = document.createElement("div");
      errorNotification.style.position = "fixed";
      errorNotification.style.bottom = "20px";
      errorNotification.style.right = "20px";
      errorNotification.style.backgroundColor = "#f44336";
      errorNotification.style.color = "white";
      errorNotification.style.padding = "10px 20px";
      errorNotification.style.borderRadius = "4px";
      errorNotification.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)";
      errorNotification.style.zIndex = "1000";
      errorNotification.textContent = `Failed to delete booking: ${error.message}`;
      
      document.body.appendChild(errorNotification);
      
      // Remove the notification after 5 seconds
      setTimeout(() => {
        document.body.removeChild(errorNotification);
      }, 5000);
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

      console.log("Using token for admin profile:", token.substring(0, 15) + "...");

      // First, try the correct endpoint based on the adminRoutes.js file
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/profile",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log("Admin profile response:", data);
          
          if (data) {
            // The API returns the admin object directly
            setAdminProfile({
              name: data.name || "Admin",
              email: data.email || "",
              loading: false
            });
            console.log("Admin profile set from direct response");
            return;
          }
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
          const response = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.ok) {
            const data = await response.json();
            
            if (data) {
              // Check different possible response formats
              const profileData = data.admin || data.user || data;
              
              setAdminProfile({
                name: profileData.name || "Admin",
                email: profileData.email || "",
                loading: false
              });
              console.log("Admin profile set from alternative endpoint");
              return;
            }
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

  // Update useEffect to include fetchAdminProfile
  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem("adminToken");
    if (token) {
      setIsAuthenticated(true);
      fetchBookingStats();
      fetchBookings();
      fetchAdminProfile();
    }
  }, [fetchBookingStats, fetchBookings]);

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
          background: "#41372D",
          color: "white",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          overflowY: "auto",
        }}
      >
        {/* Header with auth status and login form */}
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1
              style={{ fontSize: "20px", fontWeight: "bold", color: "white" }}
            >
              BOOKINGS
            </h1>
            {!isAuthenticated && (
              <div
                style={{
                  background: "#F0E68C",
                  color: "#8B4513",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  marginTop: "5px",
                }}
              >
                Not authenticated - using mock data
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isAuthenticated ? (
              <>
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
                <button
                  onClick={handleLogout}
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "#d32f2f",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <form
                onSubmit={handleLogin}
                style={{
                  background: "white",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  color: "#333",
                }}
              >
                <h3
                  style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  Admin Login
                </h3>
                {loginError && (
                  <div
                    style={{
                      background: "#ffebee",
                      color: "#c62828",
                      padding: "8px",
                      borderRadius: "4px",
                      marginBottom: "10px",
                      fontSize: "12px",
                    }}
                  >
                    {loginError}
                  </div>
                )}
                <div
                  style={{
                    color: "#666",
                    fontSize: "12px",
                    marginBottom: "10px",
                  }}
                >
                  <p>Use your admin credentials to log in.</p>
                  <p>Default admin credentials are pre-filled for testing.</p>
                  <p style={{ marginTop: "5px", color: "#f57c00" }}>
                    Note: Make sure an admin account exists with these
                    credentials in your database.
                  </p>
                  <p style={{ marginTop: "5px", color: "#1976d2" }}>
                    Important: If you already logged in on the Dashboard, you
                    should automatically be authenticated here. If not, the
                    token might be stored inconsistently.
                  </p>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <input
                    type="email"
                    name="email"
                    value={loginCredentials.email}
                    onChange={handleLoginInputChange}
                    placeholder="Email"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      marginBottom: "8px",
                    }}
                    required
                  />
                  <input
                    type="password"
                    name="password"
                    value={loginCredentials.password}
                    onChange={handleLoginInputChange}
                    placeholder="Password"
                    style={{
                      width: "100%",
                      padding: "8px",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  style={{
                    width: "100%",
                    background: "#1976d2",
                    color: "white",
                    border: "none",
                    padding: "8px 0",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>

                <div
                  style={{
                    marginTop: "15px",
                    paddingTop: "10px",
                    borderTop: "1px solid #eee",
                  }}
                >
                  <p
                    style={{
                      color: "#666",
                      fontSize: "12px",
                      marginBottom: "8px",
                    }}
                  >
                    First time setup? Create an admin account:
                  </p>
                  <button
                    type="button"
                    onClick={handleRegisterAdmin}
                    style={{
                      width: "100%",
                      background: "#616161",
                      color: "white",
                      border: "none",
                      padding: "8px 0",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Register Default Admin
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Booking Stats */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            color: "#41372D",
            borderRadius: "10px",
          }}
        >
          {[
            { label: "Confirmed Bookings", value: bookingStats.confirmed },
            { label: "Completed Bookings", value: bookingStats.completed },
            { label: "Cancelled Bookings", value: bookingStats.cancelled },
            { label: "Pending Bookings", value: bookingStats.pending },
          ].map((stat, i) => (
            <div
              key={i}
              style={{ background: "#dcd3c3", padding: "16px", flex: 1 }}
            >
              <h4 style={{ fontSize: "14px" }}>{stat.label}</h4>
              <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart and Filter */}
        <div style={{ display: "flex", gap: "16px", borderRadius: "10px" }}>
          <div
            style={{
              background: "#dcd3c3",
              padding: "16px",
              flex: 2,
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <h4>Booking Overview</h4>
              <select style={{ background: "#41372D", paddingRight: "10px" }}>
                <option>This Year</option>
              </select>
            </div>
            <BookingChart data={formattedMonthlyTrends} />
          </div>
        </div>

        {/* Car Bookings Table */}
        <div
          style={{
            background: "#dcd3c3",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: "15px" }}>
            <h4
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#41372D",
                marginBottom: "10px",
              }}
            >
              Car Bookings
            </h4>
            <p style={{ fontSize: "13px", color: "#666" }}>
              Manage and track all car bookings from this dashboard
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "20px 0",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search Name"
              style={{
                padding: "10px 15px",
                width: "200px",
                height: "42px",
                borderRadius: "6px",
                border: "1px solid #bbb",
                backgroundColor: "white",
                fontSize: "14px",
              }}
            />
          </div>

          {loading ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#41372d",
                backgroundColor: "rgba(255,255,255,0.7)",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  width: "30px",
                  height: "30px",
                  border: "3px solid #41372d",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginBottom: "10px",
                }}
              ></div>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
              <p>Loading bookings...</p>
            </div>
          ) : error ? (
            <div
              style={{
                padding: "20px",
                textAlign: "center",
                color: "#d32f2f",
                backgroundColor: "#ffebee",
                borderRadius: "8px",
                border: "1px solid #ffcdd2",
              }}
            >
              {error}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "#41372D",
                      color: "white",
                    }}
                  >
                    {[
                      "Booking ID",
                      "Booking Date",
                      "Client Name",
                      "Car Model",
                      "Plan",
                      "Date Range",
                      "Driver",
                      "Payment",
                      "Status",
                      "Actions",
                    ].map((head, i) => (
                      <th
                        key={i}
                        style={{
                          padding: "12px 15px",
                          textAlign: "left",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td
                        colSpan="10"
                        style={{
                          textAlign: "center",
                          padding: "30px 20px",
                          color: "black",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "18px",
                            marginBottom: "10px",
                          }}
                        >
                          No bookings found
                        </div>
                        <div style={{ fontSize: "14px" }}>
                          Try adjusting your search or filter criteria
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking, i) => (
                      <tr
                        key={booking._id}
                        id={`booking-row-${booking._id}`}
                        style={{
                          borderBottom: "1px solid #eee",
                          backgroundColor: i % 2 === 0 ? "#f9f6f2" : "white",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#f0ebe4";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor =
                            i % 2 === 0 ? "#f9f6f2" : "white";
                        }}
                      >
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <span
                            style={{
                              fontFamily: "monospace",
                              backgroundColor: "#f0f0f0",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              color: "black",
                            }}
                          >
                            {booking._id.substring(0, 8)}
                          </span>
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            fontSize: "14px",
                            color: "black",
                          }}
                        >
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "black",
                          }}
                        >
                          {booking.userId?.name || "Unknown"}
                        </td>
                        <td
                          style={{
                            padding: "12px 15px",
                            fontSize: "14px",
                            color: "black",
                          }}
                        >
                          {booking.carName ||
                            booking.carId?.carName ||
                            "Unknown"}
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <span
                            style={{
                              fontWeight: "bold",
                              color: "#41372D",
                            }}
                          >
                            {booking.totalDays}
                          </span>{" "}
                          Days
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <div style={{ fontWeight: "500", color: "black" }}>
                              {new Date(booking.startDate).toLocaleDateString()}
                            </div>
                            <div style={{ fontSize: "12px", color: "black" }}>
                              to{" "}
                              {new Date(booking.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          {booking.withDriver ? (
                            <span style={{ color: "#1976d2" }}>Yes</span>
                          ) : (
                            <span style={{ color: "#666" }}>No</span>
                          )}
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor:
                                booking.paymentStatus === "completed"
                                  ? "#e8f5e9"
                                  : booking.paymentStatus === "pending"
                                  ? "#fff8e1"
                                  : "#ffebee",
                              color:
                                booking.paymentStatus === "completed"
                                  ? "#2e7d32"
                                  : booking.paymentStatus === "pending"
                                  ? "#f57f17"
                                  : "#c62828",
                            }}
                          >
                            {booking.paymentStatus || "Pending"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "4px 8px",
                              borderRadius: "4px",
                              fontSize: "12px",
                              fontWeight: "500",
                              backgroundColor:
                                booking.bookingStatus === "confirmed"
                                  ? "#e3f2fd"
                                  : booking.bookingStatus === "completed"
                                  ? "#e8f5e9"
                                  : booking.bookingStatus === "pending"
                                  ? "#fff8e1"
                                  : "#ffebee",
                              color:
                                booking.bookingStatus === "confirmed"
                                  ? "#1565c0"
                                  : booking.bookingStatus === "completed"
                                  ? "#2e7d32"
                                  : booking.bookingStatus === "pending"
                                  ? "#f57f17"
                                  : "#c62828",
                            }}
                          >
                            {booking.bookingStatus
                              ? booking.bookingStatus.charAt(0).toUpperCase() +
                                booking.bookingStatus.slice(1)
                              : "Unknown"}
                          </span>
                        </td>
                        <td style={{ padding: "12px 15px", fontSize: "14px" }}>
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <button
                              onClick={() => handleDeleteBooking(booking._id)}
                              style={{
                                backgroundColor: "#d32f2f",
                                color: "white",
                                border: "none",
                                padding: "6px 12px",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                transition: "background-color 0.2s"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "#b71c1c";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "#d32f2f";
                              }}
                            >
                              <span style={{ fontSize: "14px" }}>×</span> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Improved pagination */}
          {!loading && !error && filteredBookings.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "20px",
                padding: "10px 0",
              }}
            >
              <div style={{ color: "#666", fontSize: "14px" }}>
                Showing {Math.min(pagination.limit, filteredBookings.length)} of{" "}
                {filteredBookings.length} bookings
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "5px",
                }}
              >
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, pagination.currentPage - 1))
                  }
                  disabled={pagination.currentPage === 1}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px 0 0 4px",
                    background:
                      pagination.currentPage === 1 ? "#f0f0f0" : "#41372D",
                    cursor:
                      pagination.currentPage === 1 ? "default" : "pointer",
                    color: pagination.currentPage === 1 ? "#999" : "white",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  Previous
                </button>

                {[...Array(pagination.totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    style={{
                      padding: "8px 12px",
                      border: "1px solid #ccc",
                      borderLeft: index === 0 ? "1px solid #ccc" : "none",
                      background:
                        pagination.currentPage === index + 1
                          ? "#41372D"
                          : "white",
                      color:
                        pagination.currentPage === index + 1 ? "white" : "#333",
                      cursor: "pointer",
                      fontWeight:
                        pagination.currentPage === index + 1
                          ? "bold"
                          : "normal",
                      transition: "all 0.2s",
                    }}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    handlePageChange(
                      Math.min(
                        pagination.totalPages,
                        pagination.currentPage + 1
                      )
                    )
                  }
                  disabled={pagination.currentPage === pagination.totalPages}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "0 4px 4px 0",
                    borderLeft: "none",
                    background:
                      pagination.currentPage === pagination.totalPages
                        ? "#f0f0f0"
                        : "#41372D",
                    cursor:
                      pagination.currentPage === pagination.totalPages
                        ? "default"
                        : "pointer",
                    color:
                      pagination.currentPage === pagination.totalPages
                        ? "#999"
                        : "white",
                    fontWeight: "500",
                    fontSize: "14px",
                    transition: "all 0.2s",
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bookings;
