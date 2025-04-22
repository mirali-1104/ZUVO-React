import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaHeart, FaGasPump, FaCogs, FaChair, FaRupeeSign, FaTimes, FaCalendarAlt } from "react-icons/fa";
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
  
  // Replace days/hours with date selection
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  
  const navigate = useNavigate();

  // Set today as the minimum date for booking
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  
  // Set maximum date (e.g., 1 year from now)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const formattedMaxDate = maxDate.toISOString().split('T')[0];

  // Function to fetch cars from the database
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        // Fetch all available cars
        const response = await axios.get(
          "http://localhost:5000/api/cars/available"
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
          totalDays: rentalDays || 1 // Minimum 1 day
        }
      } 
    });
    
    // Reset and close modal
    setShowRentalModal(false);
  };

  return (
    <section id="vehicle-models" className="vehicle-models-section">
      <div className="Vehicle-model-section">
        <div className="flex items-center justify-center flex-col h-screen bg-[#D6BFC4] p-8">
          <h2 className="text-3xl font-bold mb-6 text-[#3d342a]">
            Explore Premium Vehicles
          </h2>
          <p className="text-[#5c3b1f] mb-8 max-w-2xl text-center">
            Browse our selection of high-quality vehicles available for rent. Find the perfect car for your needs.
          </p>

          <div className="flex items-center mb-10">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by model, fuel type, or transmission..."
              className="px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-[#5c3b1f] text-white px-4 py-2 rounded-r-lg hover:bg-[#3d342a] focus:outline-none"
            >
              Search
            </button>
          </div>

          {loading ? (
            <div className="loading-indicator">Loading premium vehicles...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredVehicles.length === 0 ? (
            <div className="error-message">No vehicles match your search criteria</div>
          ) : (
            <Swiper
              breakpoints={{
                340: { slidesPerView: 1, spaceBetween: 15 },
                700: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 25 },
                1280: { slidesPerView: 4, spaceBetween: 30 },
              }}
              freeMode={true}
              pagination={{ clickable: true }}
              modules={[FreeMode, Pagination]}
              className="w-full max-w-6xl"
            >
              {filteredVehicles.map((item, index) => (
                <SwiperSlide key={item.id || index}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="card"
                    onClick={() => handleImageClick(item)}
                  >
                    <div
                      className="like-button"
                      onClick={(e) => e.stopPropagation()}
                      title="Add to favorites"
                    >
                      <FaHeart />
                    </div>
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="card-img"
                        onError={(e) => {
                          // Set a fallback image if the original fails
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/280x180/f0f0f0/3d342a?text=Car+Image";
                        }}
                      />
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
                      <button 
                        className="mt-4 w-full bg-[#5c3b1f] text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#3d342a]"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleImageClick(item);
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
            <div className="rental-modal-overlay">
              <div className="rental-modal">
                <div className="rental-modal-header">
                  <h3>Rent {selectedVehicle.title}</h3>
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
                      <p className="rental-car-price">₹{selectedVehicle.price}/day</p>
                      <div className="rental-car-specs">
                        <span><FaCogs /> {selectedVehicle.transmission}</span>
                        <span><FaGasPump /> {selectedVehicle.fuel}</span>
                        <span><FaChair /> {selectedVehicle.seats} Seats</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rental-date-selector">
                    <h4>Select Rental Dates</h4>
                    
                    {dateError && (
                      <div className="date-error-message">{dateError}</div>
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
                    <div className="rental-price-row">
                      <span>Daily Rate:</span>
                      <span>₹{selectedVehicle.price}</span>
                    </div>
                    
                    {startDate && endDate && (
                      <>
                        <div className="rental-price-row">
                          <span>Rental Period:</span>
                          <span>
                            {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="rental-price-row">
                          <span>Duration:</span>
                          <span>
                            {calculateDays(startDate, endDate)} day{calculateDays(startDate, endDate) !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="rental-price-row total">
                          <span>Estimated Total:</span>
                          <span>
                            ₹{selectedVehicle.price * calculateDays(startDate, endDate)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <button 
                    className="rental-submit-btn"
                    onClick={handleRentalSubmit}
                  >
                    Continue to Booking
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
