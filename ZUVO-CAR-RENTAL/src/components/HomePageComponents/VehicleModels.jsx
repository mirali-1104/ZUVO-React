import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FaHeart,
  FaGasPump,
  FaCogs,
  FaChair,
  FaRupeeSign,
  FaTimes,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/VehicleModel.css";

const VehicleModels = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Fallback vehicles data in case API fails
  const fallbackVehicles = [
    {
      id: "fallback1",
      title: "Toyota Camry",
      price: 1500,
      transmission: "Automatic",
      seats: "5",
      fuel: "Petrol",
      image: "/Model1.png",
      carDetails: {
        _id: "fallback1",
        carName: "Toyota Camry",
        rentalPrice: 1500,
        transmission: "Automatic",
        numberOfSeats: 5,
        fuelTypes: "Petrol",
        photos: ["/Model1.png"],
        location: "Bangalore, India",
      },
    },
    {
      id: "fallback2",
      title: "Honda Civic",
      price: 1300,
      transmission: "Automatic",
      seats: "5",
      fuel: "Petrol",
      image: "/Model2.png",
      carDetails: {
        _id: "fallback2",
        carName: "Honda Civic",
        rentalPrice: 1300,
        transmission: "Automatic",
        numberOfSeats: 5,
        fuelTypes: "Petrol",
        photos: ["/Model2.png"],
        location: "Delhi, India",
      },
    },
    {
      id: "fallback3",
      title: "Hyundai i20",
      price: 1100,
      transmission: "Manual",
      seats: "5",
      fuel: "Diesel",
      image: "/Model3.png",
      carDetails: {
        _id: "fallback3",
        carName: "Hyundai i20",
        rentalPrice: 1100,
        transmission: "Manual",
        numberOfSeats: 5,
        fuelTypes: "Diesel",
        photos: ["/Model3.png"],
        location: "Mumbai, India",
      },
    },
    {
      id: "fallback4",
      title: "Maruti Swift",
      price: 900,
      transmission: "Manual",
      seats: "5",
      fuel: "Petrol",
      image: "/Model4.png",
      carDetails: {
        _id: "fallback4",
        carName: "Maruti Swift",
        rentalPrice: 900,
        transmission: "Manual",
        numberOfSeats: 5,
        fuelTypes: "Petrol",
        photos: ["/Model4.png"],
        location: "Chennai, India",
      },
    },
  ];

  // Replace days/hours with date selection
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  const navigate = useNavigate();

  // Set today as the minimum date for booking
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  // Set maximum date (e.g., 1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const formattedMaxDate = maxDate.toISOString().split("T")[0];

  // Function to fetch cars from the database
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        // Fetch all cars regardless of availability status
        const response = await axios.get(
          "http://localhost:5000/api/cars/all-with-availability"
        );

        console.log("API Response:", response.data);

        if (
          response.data.success &&
          response.data.cars &&
          response.data.cars.length > 0
        ) {
          // Format the data for our component
          const formattedCars = response.data.cars.map((car) => {
            // Function to get photo URL
            const getPhotoUrl = (photos) => {
              if (!photos || photos.length === 0) {
                // Use default model photo based on car ID
                const modelNumber = (car._id.charCodeAt(0) % 6) + 1;
                return `/Model${modelNumber}.png`;
              }

              const photo = photos[0];
              if (photo.startsWith("http")) return photo;
              if (photo.startsWith("/uploads"))
                return `http://localhost:5000${photo}`;
              return photo;
            };

            return {
              id: car._id,
              title: car.carName || car.brand + " " + car.carModel,
              price: car.rentalPrice || car.price || 1200,
              transmission: car.transmission || "Automatic",
              seats: car.numberOfSeats || car.seats || "10",
              fuel: car.fuelTypes || car.fuelType || "Petrol",
              image: getPhotoUrl(car.photos),
              // Availability for the selected dates (if provided)
              availableForDates:
                car.availableForDates !== undefined
                  ? car.availableForDates
                  : true,
              // Additional data to pass to car details page
              carDetails: car,
            };
          });

          console.log("Formatted cars:", formattedCars);
          setVehicles(formattedCars);
        } else {
          console.log(
            "No cars found or invalid response format, using fallback data"
          );
          setVehicles(fallbackVehicles);
        }
      } catch (error) {
        console.error("Error fetching cars:", error);
        setError("Failed to load vehicles. Using fallback data.");
        // Use fallback data on error
        setVehicles(fallbackVehicles);
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Function to check availability for selected dates
  const checkAvailabilityForDates = async () => {
    if (!startDate || !endDate) {
      return; // Don't check if dates aren't selected
    }

    try {
      setLoading(true);
      // Fetch cars with availability check for selected dates
      const response = await axios.get(
        `http://localhost:5000/api/cars/all-with-availability?startDate=${startDate}&endDate=${endDate}`
      );

      if (
        response.data.success &&
        response.data.cars &&
        response.data.cars.length > 0
      ) {
        // Update the vehicles with availability information
        const formattedCars = response.data.cars.map((car) => {
          // Function to get photo URL
          const getPhotoUrl = (photos) => {
            if (!photos || photos.length === 0) {
              // Use default model photo based on car ID
              const modelNumber = (car._id.charCodeAt(0) % 6) + 1;
              return `/Model${modelNumber}.png`;
            }

            const photo = photos[0];
            if (photo.startsWith("http")) return photo;
            if (photo.startsWith("/uploads"))
              return `http://localhost:5000${photo}`;
            return photo;
          };

          return {
            id: car._id,
            title: car.carName || car.brand + " " + car.carModel,
            price: car.rentalPrice || car.price || 1200,
            transmission: car.transmission || "Automatic",
            seats: car.numberOfSeats || car.seats || "10",
            fuel: car.fuelTypes || car.fuelType || "Petrol",
            image: getPhotoUrl(car.photos),
            // Availability for the selected dates
            availableForDates: car.availableForDates,
            // Additional data to pass to car details page
            carDetails: car,
          };
        });

        setVehicles(formattedCars);
      }
    } catch (error) {
      console.error("Error checking car availability:", error);
    } finally {
      setLoading(false);
    }
  };

  // Check availability when dates change
  useEffect(() => {
    if (startDate && endDate) {
      checkAvailabilityForDates();
    }
  }, [startDate, endDate]);

  // Filter vehicles based on search query
  const filteredVehicles = searchQuery
    ? vehicles.filter(
        (vehicle) =>
          vehicle.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vehicle.transmission
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          vehicle.fuel.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : vehicles;

  const handleSearch = () => {
    // The filtering is already handled by the filteredVehicles constant
    console.log("Search query:", searchQuery);
  };

  const handleImageClick = (vehicle) => {
    // Set the selected vehicle and show the rental modal
    setSelectedVehicle(vehicle);
    setShowRentalModal(true);

    // Reset date fields and errors
    setStartDate("");
    setEndDate("");
    setDateError("");
  };

  // Calculate the number of days between two dates
  const calculateDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const validateDates = () => {
    if (!startDate) {
      setDateError("Please select a pickup date");
      return false;
    }

    if (!endDate) {
      setDateError("Please select a return date");
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if the dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setDateError("Please select valid dates");
      return false;
    }

    // Check if end date is after start date
    if (end < start) {
      setDateError("Return date must be after pickup date");
      return false;
    }

    // Check if start date is not in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setDateError("Pickup date cannot be in the past");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleRentalSubmit = () => {
    if (!selectedVehicle) return;

    if (!validateDates()) {
      return;
    }

    // Check if car is available for the selected dates
    if (selectedVehicle.availableForDates === false) {
      setDateError("This car is not available for the selected dates");
      return;
    }

    // Calculate the number of days between the dates
    const rentalDays = calculateDays(startDate, endDate);

    // Format dates for display
    const formattedStartDate = new Date(startDate).toLocaleDateString();
    const formattedEndDate = new Date(endDate).toLocaleDateString();

    // Navigate to the CarBuy page with the selected vehicle data and rental information
    navigate("/car-buy", {
      state: {
        vehicle: selectedVehicle.carDetails || selectedVehicle,
        rentalInfo: {
          startDate: startDate,
          endDate: endDate,
          formattedStartDate: formattedStartDate,
          formattedEndDate: formattedEndDate,
          totalDays: rentalDays || 1, // Minimum 1 day
        },
      },
    });

    // Reset and close modal
    setShowRentalModal(false);
  };

  return (
    <section id="vehicle-models" className="vehicle-models-section">
      <div className="Vehicle-model-section">
        <div className="vehicle-models-section">
          <h2 className="text-3xl font-bold mb-4 text-[#3d342a] text-center">
            Explore Premium Vehicles
          </h2>
          <p className="text-[#5c3b1f] mb-6 max-w-2xl text-center mx-auto">
            Browse our selection of high-quality vehicles available for rent.
            Find the perfect car for your needs.
          </p>
          <div className="flex items-center mb-8 max-w-xl w-full mx-auto shadow-md rounded-lg overflow-hidden">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, fuel type, or transmission..."
              className="px-4 py-3 w-full rounded-l-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#5c3b1f] text-white px-6 py-3 rounded-r-lg hover:bg-[#3d342a] focus:outline-none transition-colors duration-300"
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className="loading-indicator shadow-md mx-auto">
              <div className="animate-pulse flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-[#5c3b1f] border-t-transparent rounded-full animate-spin mb-4"></div>
                Loading premium vehicles...
              </div>
            </div>
          ) : error ? (
            <div className="error-message shadow-md mx-auto">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {error}
              </div>
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="error-message shadow-md mx-auto">
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                No vehicles match your search criteria
              </div>
            </div>
          ) : (
            <Swiper
              breakpoints={{
                340: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 15 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 25 },
              }}
              freeMode={true}
              pagination={{ clickable: true }}
              modules={[FreeMode, Pagination]}
              className="w-full max-w-5xl mx-auto pb-12"
            >
              {filteredVehicles.map((item, index) => (
                <SwiperSlide key={item.id || index}>
                  <motion.div
                    className="vehicle-card"
                    onClick={() => handleImageClick(item)}
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="card-header">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="card-image"
                      />
                      <div className="card-likes">
                        <FaHeart className="heart-icon" />
                        <span>{Math.floor(Math.random() * 50) + 50}</span>
                      </div>
                    </div>
                    <div className="card-body">
                      <h3 className="card-title" title={item.title}>
                        {item.title}
                      </h3>
                      <p className="card-price">₹{item.price}/day</p>
                      <div className="card-info">
                        <span title="Transmission">
                          <FaCogs /> {item.transmission}
                        </span>
                        <span title="Fuel Type">
                          <FaGasPump /> {item.fuel}
                        </span>
                        <span title="Seating Capacity">
                          <FaChair /> {item.seats} Seats
                        </span>
                      </div>
                      {startDate && endDate && (
                        <div
                          className="availability-status"
                          style={{
                            backgroundColor: item.availableForDates
                              ? "#4caf50"
                              : "#f44336",
                            color: "white",
                            textAlign: "center",
                            fontWeight: "600",
                          }}
                        >
                          {item.availableForDates
                            ? "Available"
                            : "Not available"}
                        </div>
                      )}
                      <button
                        className="mt-auto" /* Make the button stick to bottom */
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(item);
                        }}
                        disabled={
                          startDate && endDate && !item.availableForDates
                        }
                        style={{
                          opacity:
                            startDate && endDate && !item.availableForDates
                              ? 0.5
                              : 1,
                          cursor:
                            startDate && endDate && !item.availableForDates
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <FaRupeeSign /> View Details
                      </button>
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}

          {/* Date Selection Modal */}
          {showRentalModal && selectedVehicle && (
            <div
              className="rental-modal-overlay"
              onClick={() => setShowRentalModal(false)}
            >
              <div
                className="rental-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="rental-modal-header">
                  <h3>
                    <span className="mr-2">🚗</span>
                    Rent {selectedVehicle.title}
                  </h3>
                  <button
                    className="modal-close-btn"
                    onClick={() => setShowRentalModal(false)}
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="rental-modal-content">
                  <div className="rental-car-details">
                    <img
                      src={selectedVehicle.image}
                      alt={selectedVehicle.title}
                      className="rental-car-image"
                    />
                    <div className="rental-car-info">
                      <h4>{selectedVehicle.title}</h4>
                      <p className="rental-car-price">
                        ₹{selectedVehicle.price}/day
                      </p>
                      <div className="rental-car-specs">
                        <span>
                          <FaCogs /> {selectedVehicle.transmission}
                        </span>
                        <span>
                          <FaGasPump /> {selectedVehicle.fuel}
                        </span>
                        <span>
                          <FaChair /> {selectedVehicle.seats} Seats
                        </span>
                      </div>
                      {startDate &&
                        endDate &&
                        selectedVehicle.availableForDates === false && (
                          <div
                            style={{
                              backgroundColor: "#f44336",
                              color: "white",
                              padding: "8px",
                              marginTop: "10px",
                              borderRadius: "4px",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            Not available for selected dates
                          </div>
                        )}
                    </div>
                  </div>

                  <div className="rental-date-selector">
                    <h4>
                      <FaCalendarAlt className="text-[#5c3b1f]" />
                      Select Rental Dates
                    </h4>

                    {dateError && (
                      <div className="date-error-message">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 inline-block mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        {dateError}
                      </div>
                    )}

                    <div className="rental-date-inputs">
                      <div className="date-input-group">
                        <label>
                          <FaCalendarAlt /> Pickup Date:
                        </label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          min={formattedToday}
                          max={formattedMaxDate}
                          className="date-input"
                        />
                      </div>

                      <div className="date-input-group">
                        <label>
                          <FaCalendarAlt /> Return Date:
                        </label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          min={startDate || formattedToday}
                          max={formattedMaxDate}
                          className="date-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="rental-price-summary">
                    <h4 className="text-[#3d342a] font-bold text-lg mb-2">
                      Price Summary
                    </h4>
                    <div className="rental-price-row">
                      <span>Daily Rate:</span>
                      <span>₹{selectedVehicle.price}</span>
                    </div>

                    {startDate && endDate && (
                      <>
                        <div className="rental-price-row">
                          <span>Rental Period:</span>
                          <span>
                            {new Date(startDate).toLocaleDateString()} to{" "}
                            {new Date(endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="rental-price-row">
                          <span>Duration:</span>
                          <span>
                            {calculateDays(startDate, endDate)} day
                            {calculateDays(startDate, endDate) !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="rental-price-row total">
                          <span>Estimated Total:</span>
                          <span>
                            ₹
                            {selectedVehicle.price *
                              calculateDays(startDate, endDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    className="rental-submit-btn"
                    onClick={handleRentalSubmit}
                    style={{
                      opacity:
                        startDate &&
                        endDate &&
                        selectedVehicle.availableForDates === false
                          ? 0.5
                          : 1,
                      cursor:
                        startDate &&
                        endDate &&
                        selectedVehicle.availableForDates === false
                          ? "not-allowed"
                          : "pointer",
                    }}
                    disabled={
                      startDate &&
                      endDate &&
                      selectedVehicle.availableForDates === false
                    }
                  >
                    {startDate &&
                    endDate &&
                    selectedVehicle.availableForDates === false
                      ? "Car Unavailable for Selected Dates"
                      : "Continue to Booking"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default VehicleModels;
