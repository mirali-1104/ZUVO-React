import React, { useState, useEffect } from "react";
import { FaUserCircle, FaCarSide } from "react-icons/fa";
import { FaRocket } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { FaCog, FaLock, FaUsers } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SocialNetworkSection from "../components/HomePageComponents/SocialNetworkSection";
import axios from "axios";

// Create authenticated API instance
const createAuthAPI = () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    console.error("No auth token found in localStorage");
    return null;
  }

  // Ensure proper Bearer token format and handle any format inconsistencies
  let authHeader;
  if (token.startsWith("Bearer ")) {
    authHeader = token;
  } else if (
    token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/)
  ) {
    // This regex roughly matches JWT format
    authHeader = `Bearer ${token}`;
  } else {
    // Try to parse if it might be stored as a JSON string
    try {
      const parsed = JSON.parse(token);
      const actualToken = parsed.token || parsed;
      authHeader = actualToken.startsWith("Bearer ")
        ? actualToken
        : `Bearer ${actualToken}`;
    } catch (e) {
      // If not JSON, use as is with Bearer prefix
      authHeader = `Bearer ${token}`;
    }
  }

  console.log(
    "Creating API instance with token:",
    authHeader.substring(0, 20) + "..."
  );

  // Configure Axios instance
  const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    timeout: 10000,
    withCredentials: false, // Change to false to avoid CORS preflight issues
  });

  // Add request interceptor for debugging this specific instance
  api.interceptors.request.use(
    (config) => {
      // Add a timestamp to avoid caching issues
      if (config.method !== "get") {
        config.params = { ...config.params, _t: Date.now() };
      }

      // Log full URL for debugging
      console.log("Auth API Request:", {
        method: config.method.toUpperCase(),
        url: config.url,
        fullUrl: config.baseURL + config.url,
        auth_header: config.headers["Authorization"].substring(0, 20) + "...",
      });
      return config;
    },
    (error) => {
      console.error("Auth API Request Error:", error);
      return Promise.reject(error);
    }
  );

  return api;
};

const CarCard = ({ car, onToggleAvailability }) => {
  // Debug log to inspect what's coming from the database before destructuring
  console.log("CarCard raw car data:", car);
  console.log("CarCard price data:", {
    rentalPrice: car.rentalPrice,
    price: car.price,
    ratePerHour: car.ratePerHour,
  });

  // Enhanced destructuring with additional fallbacks for price fields
  const {
    _id = "unknown",
    carName = "Unnamed Car",
    // Try all possible price field names
    rentalPrice,
    price,
    ratePerHour,
    transmission = "N/A",
    fuelTypes = "N/A",
    fuelType,
    numberOfSeats = "N/A",
    seats,
    isAvailable = true,
    photos = [],
  } = car || {};

  // Calculate the price to display, trying different possible field names
  const displayPrice = rentalPrice || price || ratePerHour || 0;

  // Use one of the available car model images from the public folder as fallback
  // Based on the file listing, we have Model1.png through Model6.png
  const getDefaultImagePath = () => {
    // Use a different model image based on car ID to add variety
    const modelNumber = (_id.charCodeAt(0) % 6) + 1;
    return `/Model${modelNumber}.png`;
  };

  const defaultImagePath = getDefaultImagePath();

  // Function to format photo URL correctly
  const getPhotoUrl = (photo) => {
    // If it's a full URL already, return it
    if (
      photo &&
      (photo.startsWith("http://") || photo.startsWith("https://"))
    ) {
      return photo;
    }

    // If it's a server path starting with /uploads, prepend the server URL
    if (photo && photo.startsWith("/uploads")) {
      try {
        return `http://localhost:5000${photo}`;
      } catch (error) {
        console.warn("Error formatting photo URL:", error);
        return defaultImagePath;
      }
    }

    // Default fallback image
    return defaultImagePath;
  };

  // Get the first photo URL or fallback to default
  const photoUrl =
    photos && photos.length > 0 ? getPhotoUrl(photos[0]) : defaultImagePath;

  // Use actual values or fallbacks for features
  const displayFuelType = fuelTypes || fuelType || "N/A";
  const displaySeats = numberOfSeats || seats || "N/A";

  return (
    <div
      style={{
        width: "220px",
        backgroundColor: "#f5f0e1",
        borderRadius: "12px",
        padding: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        margin: "10px",
        border: "1px solid #e0d6b8",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onToggleAvailability(_id, !isAvailable);
        }}
        style={{
          height: "16px",
          width: "16px",
          borderRadius: "50%",
          backgroundColor: isAvailable ? "#2f9e44" : "#e03131",
          border: "2px solid white",
          position: "absolute",
          top: "10px",
          right: "10px",
          cursor: "pointer",
          zIndex: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.2)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        title={isAvailable ? "Car is available (click to change)" : "Car is unavailable (click to change)"}
      />
      <div
        style={{
          marginBottom: "10px",
          height: "140px",
          overflow: "hidden",
          borderRadius: "8px",
          position: "relative",
        }}
      >
        <img
          src={photoUrl}
          alt={carName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "8px",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onError={(e) => {
            console.log("Image load error, falling back to external image");
            e.target.onerror = null; // Prevent infinite loop
            // Use an external image as ultimate fallback if all else fails
            e.target.src =
              "https://via.placeholder.com/220x140/f0f0f0/3d342a?text=Car+Image";
          }}
        />
      </div>
      <div style={{ padding: "5px 0" }}>
        <h3 style={{ margin: "5px 0", color: "#3d342a", fontSize: "18px", fontWeight: "600" }}>{carName}</h3>
        <p style={{ margin: "5px 0", fontSize: "18px", color: "#5c3b1f", fontWeight: "bold" }}>₹{displayPrice}/hr</p>
        <div style={{ marginTop: "10px", fontSize: "14px", color: "#5c3b1f" }}>
          <p style={{ margin: "6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaCog style={{ color: "#1c7ed6" }} /> {transmission}
          </p>
          <p style={{ margin: "6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaLock style={{ color: "#e67700" }} /> {displayFuelType}
          </p>
          <p style={{ margin: "6px 0", display: "flex", alignItems: "center", gap: "6px" }}>
            <FaUsers style={{ color: "#2f9e44" }} /> {displaySeats} Seats
          </p>
        </div>
        <div 
          style={{
            marginTop: "10px",
            backgroundColor: isAvailable ? "rgba(47, 158, 68, 0.1)" : "rgba(224, 49, 49, 0.1)",
            color: isAvailable ? "#2f9e44" : "#e03131",
            padding: "5px 10px",
            borderRadius: "5px",
            textAlign: "center",
            fontWeight: "500",
            fontSize: "13px"
          }}
        >
          {isAvailable ? "Available for Rent" : "Currently Unavailable"}
        </div>
      </div>
    </div>
  );
};

const HostPage = () => {
  const navigate = useNavigate();
  const [hostName, setHostName] = useState("");
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up axios interceptors for debugging
  useEffect(() => {
    // Add request interceptor
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        console.error("Request error intercepted:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        console.error("Response error intercepted:", error);
        return Promise.reject(error);
      }
    );

    // Clean up interceptors when component unmounts
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Check for authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Function to check if the user is authenticated
  const checkAuthentication = async () => {
    // Check both possible storage keys
    const hostDataFromLocalStorage =
      localStorage.getItem("hostData") || localStorage.getItem("host");
    const token = localStorage.getItem("authToken");

    console.log("Checking authentication...");
    console.log("Host data exists:", !!hostDataFromLocalStorage);
    console.log("Token exists:", !!token);

    // Extract and format token properly
    let formattedToken = null;
    if (token) {
      console.log("Token length:", token.length);
      console.log("Token preview:", token.substring(0, 20) + "...");

      // Format token properly
      if (token.startsWith("Bearer ")) {
        formattedToken = token;
      } else if (
        token.match(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/)
      ) {
        // Looks like a JWT
        formattedToken = `Bearer ${token}`;
      } else {
        // Try to parse if it's JSON
        try {
          const parsed = JSON.parse(token);
          const actualToken = parsed.token || parsed;
          formattedToken = actualToken.startsWith("Bearer ")
            ? actualToken
            : `Bearer ${actualToken}`;
        } catch (e) {
          // Not JSON, use as is
          formattedToken = `Bearer ${token}`;
        }
      }

      // Create pre-flight test to verify token is valid
      try {
        console.log(
          "Testing token with authorization header:",
          formattedToken.substring(0, 20) + "..."
        );

        // Add a small delay to ensure token is properly stored
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Test token directly before trying to fetch cars - using correct URL path
        const testResponse = await axios.get(
          "http://localhost:5000/api/host/debug-token",
          {
            headers: {
              Authorization: formattedToken,
            },
          }
        );

        console.log("Token pre-flight test:", testResponse.data);

        if (!testResponse.data.verified) {
          console.error("Token validation failed:", testResponse.data);
          redirectToLogin("Authentication failed. Please login again.");
          return false;
        }
      } catch (error) {
        console.error("Token pre-flight test failed:", error);

        if (error.response && error.response.status === 401) {
          redirectToLogin("Your session has expired. Please login again.");
          return false;
        }
      }
    }

    if (!hostDataFromLocalStorage || !token) {
      console.error("No host data or token found in localStorage");
      // Redirect to login
      redirectToLogin("Your session has expired. Please login again.");
      return false;
    }

    try {
      // Try to parse hostData
      const parsedHostData = JSON.parse(hostDataFromLocalStorage);
      console.log("Host data successfully parsed:", parsedHostData);
      setHostName(parsedHostData.name || "");

      // Continue with fetching cars since auth is valid
      await fetchHostCars();
      return true;
    } catch (error) {
      console.error("Error parsing host data:", error);
      redirectToLogin("Invalid session data. Please login again.");
      return false;
    }
  };

  // Redirect to login with optional message
  const redirectToLogin = (message) => {
    if (message) {
      alert(message);
    }
    navigate("/host-login");
  };

  const fetchHostCars = async () => {
    setLoading(true);
    setError(null);

    try {
      const authAPI = createAuthAPI();
      if (!authAPI) {
        throw new Error("No authentication token found");
      }

      // Try the test route since it's more reliable
      try {
        console.log("Attempting to fetch cars from test route...");
        const testResponse = await authAPI.get("/api/cars/test-host-cars");

        console.log("Test route response:", testResponse.data);

        if (testResponse.data.success) {
          if (testResponse.data.cars && testResponse.data.cars.length > 0) {    
            // Log the first car to see its structure
            console.log("First car from test route:", testResponse.data.cars[0]);
            
            const formattedCars = testResponse.data.cars.map((car) => {
              // Log price fields to debug
              console.log(`Car ${car._id || car.id} price fields:`, {
                rentalPrice: car.rentalPrice,
                price: car.price,
                ratePerHour: car.ratePerHour
              });
              
              return {
                _id: car._id || car.id,
                carName: car.carName || car.name || "Unnamed Car",
                // Handle all possible price field names
                rentalPrice: car.rentalPrice || car.price || car.ratePerHour || 0,
                price: car.price || car.rentalPrice || car.ratePerHour || 1200,
                ratePerHour: car.ratePerHour || car.rentalPrice || car.price || 0,
                transmission: car.transmission || "Automatic",
                fuelTypes: car.fuelTypes || car.fuelType || "Petrol",
                fuelType: car.fuelType || car.fuelTypes || "Petrol",
                numberOfSeats: car.numberOfSeats || car.seats || "5",
                seats: car.seats || car.numberOfSeats || "5",
                isAvailable: car.isAvailable !== undefined ? car.isAvailable : false,
                photos: car.photos || [],
              };
            });

            console.log("Formatted car data:", formattedCars[0]); // Debug first car
            setCars(formattedCars);
            console.log(`Successfully fetched ${formattedCars.length} cars`);
            return; // Exit if successful
          } else {
            console.log("No cars found in test route response");
            setCars([]);
            return;
          }
        } else {
          console.error("Test API returned success: false", testResponse.data);
        }
      } catch (error) {
        console.error("Test route failed, trying primary route:", error);
      }

      // If we get here, try the regular route
      console.log("Attempting primary host-cars route...");
      const response = await authAPI.get("/api/cars/host-cars");

      console.log("Cars API response:", response.data);

      if (response.data.success) {
        // Log the first car to see its structure
        if (response.data.cars && response.data.cars.length > 0) {
          console.log("First car from primary route:", response.data.cars[0]);
        }
        
        // Normalize the data from primary route to match our component's expectations
        const normalizedCars = response.data.cars.map((car) => {
          // Log price fields to debug
          console.log(`Car ${car._id} price fields:`, {
            rentalPrice: car.rentalPrice,
            price: car.price,
            ratePerHour: car.ratePerHour
          });
          
          return {
            _id: car._id,
            carName: car.carName || "Unnamed Car",
            // Handle all possible price field names
            rentalPrice: car.rentalPrice || car.price || car.ratePerHour || 0,
            price: car.price || car.rentalPrice || car.ratePerHour || 0,
            ratePerHour: car.ratePerHour || car.rentalPrice || car.price || 0,
            transmission: car.transmission || "Automatic",
            fuelTypes: car.fuelTypes || car.fuelType || "Petrol",
            fuelType: car.fuelType || car.fuelTypes || "Petrol",
            numberOfSeats: car.numberOfSeats || car.seats || "5",
            seats: car.seats || car.numberOfSeats || "5",
            isAvailable: car.isAvailable !== undefined ? car.isAvailable : true,
            photos: car.photos || [],
          };
        });

        console.log("Normalized car data:", normalizedCars[0]); // Debug first car
        setCars(normalizedCars);
        console.log(
          `Successfully fetched and normalized ${normalizedCars.length} cars`
        );
      } else {
        console.error("API returned success: false", response.data);
        setError(
          "Failed to fetch cars: " + (response.data.error || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error fetching cars:", error);

      // Check for specific errors
      if (error.response) {
        console.error("Server response error:", {
          status: error.response.status,
          data: error.response.data,
        });

        // If unauthorized, prompt to login again
        if (error.response.status === 401) {
          redirectToLogin("Your session has expired. Please login again.");
        } else {
          setError(
            `Error: ${
              error.response.data.error || error.message || "Unknown error"
            }`
          );
        }
      } else {
        setError(`Network error: ${error.message}. Please try again later.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (carId, newStatus) => {
    // Validate inputs
    if (!carId || typeof newStatus !== "boolean") {
      alert("Invalid request parameters");
      return;
    }

    const confirmChange = window.confirm(
      `Do you want to mark this car as ${
        newStatus ? "available" : "unavailable"
      }?`
    );

    if (!confirmChange) return;

    try {
      // Use direct axios call instead of the authAPI instance
      console.log(`Updating car ${carId} availability to ${newStatus}`);

      // Get token for the request
      const token = localStorage.getItem("authToken");
      let authHeader = token;
      if (token && !token.startsWith("Bearer ")) {
        authHeader = `Bearer ${token}`;
      }

      // Use simple fetch instead of axios
      const response = await fetch(
        "http://localhost:5000/api/cars/test-update-availability",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify({
            carId: carId,
            isAvailable: newStatus,
          }),
        }
      );

      const data = await response.json();
      console.log("Update response:", data);

      if (data.success) {
        // Update the car in the local state to avoid refetching
        setCars((prevCars) =>
          prevCars.map((car) =>
            car._id === carId ? { ...car, isAvailable: newStatus } : car
          )
        );

        // Show success message
        alert(`Car marked as ${newStatus ? "available" : "unavailable"} successfully`);

        // Optional: Refresh all cars to ensure data consistency
        setTimeout(() => {
          fetchHostCars();
        }, 500);
      } else {
        throw new Error(data.error || "Failed to update car availability");
      }
    } catch (error) {
      console.error("Error updating car availability:", error);
      alert(
        `Failed to update car availability: ${error.message || "Unknown error"}`
      );
    }
  };

  return (
    <div style={{ backgroundColor: "#d8d0b2", minHeight: "100vh" }}>
      {/* Navbar */}
      <div
        style={{
          backgroundColor: "#d8d0b2",
          padding: "10px 30px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid skyblue",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <img src="/logo.png" alt="Zuvo Logo" style={{ height: "40px" }} />
          <nav style={{ display: "flex", gap: "25px" }}>
            <Link to="/host-page" style={navStyle}>
              Home
            </Link>
            <Link to="/add-car" style={navStyle}>
              Add Car
            </Link>
            <Link to="/contact" style={navStyle}>
              Contact Us
            </Link>
            <Link to="/host-page" style={navStyle}>
              Your Cars
            </Link>
          </nav>
        </div>
        <Link to="/host-profile">
          <FaUserCircle
            size={40}
            color="#3d342a"
            style={{ cursor: "pointer" }}
          />
        </Link>
      </div>

      {/* Content without margin-left */}
      <div>
        {/* Welcome Banner */}
        <div style={{ fontFamily: "sans-serif", border: "2px solid skyblue" }}>
          <div
            style={{
              backgroundImage: "url('/host1bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              padding: "50px 30px 80px 30px",
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              height: "300px",
            }}
          >
            Welcome, {hostName || "Host"}!
          </div>

          {/* Steps Section */}
          <div
            style={{
              backgroundColor: "#d8d0b2",
              padding: "30px",
              textAlign: "center",
            }}
          >
            <Link to="/add-car">
              <div style={{ textAlign: "right", marginBottom: "20px" }}>
                <button style={buttonStyle}>LIST YOUR CAR</button>
              </div>
            </Link>

            <div style={stepsContainer}>
              <Step
                key="step-1"
                number="1"
                text="LIST YOUR CAR"
                icon={<FaCarSide size={40} color="darkred" />}
              />
              <Arrow key="arrow-1" />
              <Step
                key="step-2"
                number="2"
                text="SET AVAILABILITY"
                icon={<MdAccessTime size={40} color="#2f9e44" />}
              />
              <Arrow key="arrow-2" />
              <Step
                key="step-3"
                number="3"
                text="START EARNING"
                icon={<FaRocket size={40} color="#1c7ed6" />}
              />
            </div>
          </div>

          {/* Your Cars Section */}
          <div style={{ padding: "30px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h2>YOUR CARS</h2>

              {loading && <span>Loading...</span>}
            </div>

            {loading ? (
              <p>Loading cars...</p>
            ) : error ? (
              <p style={{ color: "red" }}>{error}</p>
            ) : cars.length === 0 ? (
              <p>No cars listed yet. Add your first car!</p>
            ) : (
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  flexWrap: "wrap",
                  color: "black",
                }}
              >
                {cars.map((car) => (
                  <CarCard
                    key={car._id}
                    car={car}
                    onToggleAvailability={handleToggleAvailability}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
        <SocialNetworkSection />
      </div>
    </div>
  );
};

// Reusable step component
const Step = ({ number, text, icon }) => (
  <div>
    <div style={circleStyle}>{number}</div>
    <p style={{ fontWeight: "bold", marginTop: "10px" }}>{text}</p>
    {icon}
  </div>
);

const Arrow = () => <div style={{ fontSize: "80px", color: "#5c3b1f" }}>→</div>;

// Styles
const buttonStyle = {
  backgroundColor: "#3d342a",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "bold",
  cursor: "pointer",
};

const stepsContainer = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "20px",
};

const circleStyle = {
  backgroundColor: "#5c3b1f",
  color: "white",
  width: "50px",
  height: "50px",
  lineHeight: "50px",
  borderRadius: "50%",
  margin: "0 auto",
  fontSize: "20px",
};

const navStyle = {
  textDecoration: "none",
  color: "#2f2f2f",
  fontWeight: "bold",
};

export default HostPage;
