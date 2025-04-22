import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "../styles/AddCarForm.css";

const AddCarForm = () => {
  // Existing form state
  const [formData, setFormData] = useState({
    carModel: "",
    year: "",
    color: "",
    licensePlate: "",
    vin: "",
    rentalPrice: "",
    cancellation: "Yes",
    minPeriod: "",
    mileage: "",
    fuelTypes: "",
    numberOfSeats: "",
    additionalFeatures: "",
    insuranceType: "",
    insuranceNo: "",
    insuranceCompany: "",
    ownerName: "",
    contactNo: "",
    address: "", // New address field
    transmission: "Manual", // Add transmission with default value
  });

  // New state for car type selection
  const [carTypes, setCarTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCarName, setSelectedCarName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [features, setFeatures] = useState([]); // Array to store features
  const [currentFeature, setCurrentFeature] = useState(""); // Current feature input
  const [selectedFiles, setSelectedFiles] = useState([]); // Array to store selected image files
  const [imagePreviews, setImagePreviews] = useState([]); // Array to store image previews
  const token = localStorage.getItem("authToken"); // Get the auth token
  
  // Try different possible storage keys for host data
  const getHostData = () => {
    try {
      // Check all possible localStorage keys
      const hostDataRaw = localStorage.getItem("host") || 
                         localStorage.getItem("hostData") || 
                         localStorage.getItem("zuvo-host");
                         
      if (!hostDataRaw) {
        console.warn("No host data found in localStorage under any known key");
        return null;
      }
      
      // Parse the JSON data
      return JSON.parse(hostDataRaw);
    } catch (error) {
      console.error("Error parsing host data from localStorage:", error);
      return null;
    }
  };
  
  const hostData = getHostData();

  // Check if token and host data exist
  useEffect(() => {
    // Log all localStorage keys to help debug
    console.log("Available localStorage keys:", Object.keys(localStorage));
    
    if (!token) {
      console.error("No auth token found in localStorage");
      toast.error("Authentication token missing. Please login again.");
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/host-login';
      }, 2000);
      return;
    }
    
    if (!hostData) {
      console.error("No host data found in localStorage");
      // Try to fetch host data from API using token
      fetchHostDataFromAPI();
    }
  }, [token]);
  
  // Fetch host data from API if not in localStorage
  const fetchHostDataFromAPI = async () => {
    if (!token) return;
    
    try {
      const response = await axios.get("http://localhost:5000/api/host/profile", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.success && response.data.host) {
        // Save host data to localStorage
        const hostDataToSave = {
          id: response.data.host._id,
          name: response.data.host.name,
          email: response.data.host.email
        };
        
        localStorage.setItem("host", JSON.stringify(hostDataToSave));
        toast.success("Host profile loaded successfully");
        
        // Reload the page to use the new host data
        window.location.reload();
      } else {
        toast.error("Failed to fetch your profile. Please login again.");
        setTimeout(() => {
          window.location.href = '/host-login';
        }, 2000);
      }
    } catch (error) {
      console.error("Error fetching host profile:", error);
      toast.error("Authentication error. Please login again.");
      setTimeout(() => {
        window.location.href = '/host-login';
      }, 2000);
    }
  };

  // Fetch car types on component mount
  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/carType/car-types"
        );
        setCarTypes(response.data);
      } catch (error) {
        console.error("Error fetching car types:", error);
        toast.error("Failed to fetch car types");
      }
    };

    fetchCarTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedCarName("");
  };

  // Handle adding a new feature
  const handleAddFeature = () => {
    if (currentFeature.trim() !== "") {
      setFeatures([...features, currentFeature.trim()]);
      setCurrentFeature("");
    }
  };

  // Handle removing a feature
  const handleRemoveFeature = (indexToRemove) => {
    setFeatures(features.filter((_, index) => index !== indexToRemove));
  };

  // Handle key press in features input field
  const handleFeatureKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFeature();
    }
  };

  // Handle file selection for images
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    // Check if adding these files would exceed the 5 image limit
    if (selectedFiles.length + files.length > 5) {
      toast.error("You can upload maximum 5 images");
      return;
    }

    // Check file types
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles.length > 0) {
      toast.error("Only JPEG, JPG, and PNG files are allowed");
      return;
    }

    // Check file sizes (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("One or more files exceed the 5MB size limit");
      return;
    }

    // Add new files to selected files
    setSelectedFiles((prevFiles) => [...prevFiles, ...files]);

    // Generate and add new previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  // Handle removing an image
  const handleRemoveImage = (index) => {
    // Remove file from selectedFiles
    const newFiles = [...selectedFiles];
    newFiles.splice(index, 1);
    setSelectedFiles(newFiles);

    // Remove preview and revoke object URL to free memory
    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]);
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    // Debug the host data in localStorage
    try {
      // Check all localStorage keys related to host data
      const allKeys = Object.keys(localStorage);
      console.log("All localStorage keys:", allKeys);

      // Log the content of anything that might be host-related
      const hostRelatedKeys = allKeys.filter(key => 
        key.toLowerCase().includes('host') || 
        key.toLowerCase().includes('auth') || 
        key.toLowerCase().includes('token')
      );
      
      console.log("Host-related localStorage keys:", hostRelatedKeys);
      
      // Log the parsed content of each potential host-data key
      hostRelatedKeys.forEach(key => {
        try {
          const value = localStorage.getItem(key);
          console.log(`${key}:`, value ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : 'null');
          
          // Try to parse JSON if it looks like JSON
          if (value && (value.startsWith('{') || value.startsWith('['))) {
            console.log(`${key} (parsed):`, JSON.parse(value));
          }
        } catch (e) {
          console.log(`Error parsing ${key}:`, e.message);
        }
      });
      
    } catch (err) {
      console.error("Error analyzing localStorage:", err);
    }
    
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Re-check host data at submission time
    const currentHostData = getHostData();
    
    if (!token) {
      toast.error("Authentication token missing. Please login again.");
      setTimeout(() => {
        window.location.href = '/host-login';
      }, 2000);
      return;
    }
    
    if (!currentHostData) {
      toast.error("Host profile data is missing. Please login again.");
      setTimeout(() => {
        window.location.href = '/host-login';
      }, 2000);
      return;
    }

    if (!selectedBrand || !selectedCarName) {
      toast.error("Please select a car brand and model");
      return;
    }

    if (!formData.address.trim()) {
      toast.error("Please enter a valid address");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one car image");
      return;
    }

    setIsLoading(true);

    // Debug information
    console.log(
      "Sending request with token:",
      token?.substring(0, 15) +
        "..." +
        (token?.substring(token.length - 15) || "")
    );
    console.log("Token and host verification check:", {
      tokenExists: !!token,
      tokenLength: token?.length,
      hostDataExists: !!currentHostData,
      hostId: currentHostData?.id,
      hostName: currentHostData?.name,
    });

    // Let's run a debug check on the token first
    axios.get("http://localhost:5000/api/cars/debug-auth", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      console.log("Token debug info:", response.data);
      
      // Now proceed with the actual form submission
      submitFormData();
    })
    .catch(error => {
      console.error("Token debug error:", error.response?.data || error);
      toast.error("Authentication issue detected. Please login again.");
      setTimeout(() => {
        window.location.href = "/host-login";
      }, 2000);
    });
  };

  // Separate function to submit the form data
  const submitFormData = () => {
    // Re-check host data right before submission
    const currentHostData = getHostData();

    if (!currentHostData) {
      toast.error("Host data missing. Please login again.");
      setIsLoading(false);
      return;
    }

    // Validation for required fields
    if (!formData.rentalPrice) {
      toast.error("Please enter a rental price");
      setIsLoading(false);
      return;
    }

    // Create FormData object for sending files along with other data
    const formDataToSend = new FormData();

    // Add host information from localStorage
    formDataToSend.append("hostId", currentHostData.id);
    formDataToSend.append("hostName", currentHostData.name);

    // Add form fields
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    // Add features as a JSON string
    formDataToSend.append("features", JSON.stringify(features));

    // Add the car brand and model
    formDataToSend.append("brand", selectedBrand);
    formDataToSend.append("carName", selectedCarName);

    // Add images
    selectedFiles.forEach((file) => {
      formDataToSend.append("photos", file);
    });

    // Add location as a JSON string
    const locationObject = {
      address: formData.address,
      latitude: null, // You can add geocoding later
      longitude: null,
    };
    formDataToSend.append("location", JSON.stringify(locationObject));

    // Log the data being sent
    console.log("Host data being sent:", {
      hostId: currentHostData.id,
      hostName: currentHostData.name
    });
    
    // Log other form data for debugging
    Object.keys(formData).forEach(key => {
      console.log(`Form field ${key}:`, formData[key]);
    });

    // Send the request
    axios
      .post("http://localhost:5000/api/cars/add", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type here, it will be set automatically for FormData
        },
      })
      .then((response) => {
        console.log("Car added successfully:", response.data);
        toast.success("Car added successfully!");
        
        // Reset form after success
        setFormData({
          carModel: "",
          year: "",
          color: "",
          licensePlate: "",
          vin: "",
          rentalPrice: "",
          cancellation: "Yes",
          minPeriod: "",
          mileage: "",
          fuelTypes: "",
          numberOfSeats: "",
          additionalFeatures: "",
          insuranceType: "",
          insuranceNo: "",
          insuranceCompany: "",
          ownerName: "",
          contactNo: "",
          address: "",
          transmission: "Manual",
        });
        setSelectedBrand("");
        setSelectedCarName("");
        setFeatures([]);
        setSelectedFiles([]);
        setImagePreviews([]);
        
        // Redirect to host page after success
        setTimeout(() => {
          window.location.href = "/host-page";
        }, 2000);
      })
      .catch((error) => {
        console.error("Error adding car:", error);
        
        // Handle different error cases
        if (error.response) {
          // Server responded with an error
          console.error("Server error response:", error.response.data);
          toast.error(error.response.data.error || "Failed to add car. Please try again.");
          
          // If unauthorized, redirect to login
          if (error.response.status === 401) {
            toast.error("Your session has expired. Please login again.");
            setTimeout(() => {
              window.location.href = "/host-login";
            }, 2000);
          }
        } else if (error.request) {
          // No response received
          console.error("No response from server");
          toast.error("No response from server. Please check your internet connection.");
        } else {
          // Error in setting up the request
          console.error("Request setup error:", error.message);
          toast.error("Error setting up the request. Please try again.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const inputStyle = {
    padding: "8px",
    width: "100%",
    marginTop: "5px",
    marginBottom: "10px",
    background: "#f1ede6",
    border: "1px solid #ccc",
    borderRadius: "4px",
  };

  const sectionStyle = {
    marginBottom: "25px",
    borderTop: "1px solid #888",
    paddingTop: "10px",
  };

  const labelStyle = {
    fontWeight: "bold",
  };

  const fileNote = {
    fontSize: "12px",
    color: "green",
    marginTop: "5px",
  };

  const selectStyle = {
    ...inputStyle,
    appearance: "menulist",
  };

  return (
    <>
      <ToastContainer />
      <form
        onSubmit={handleSubmit}
        style={{
          padding: "20px",
          margin: "0 auto",
          fontFamily: "sans-serif",
          background: "white",
          color: "black",
        }}
      >
        <h2>ADD YOUR CAR DETAILS</h2>

        {/* CAR INFORMATION */}
        <div style={sectionStyle}>
          <h3>CAR INFORMATION</h3>

          {/* Car Brand & Name Dropdowns */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Car Brand</label>
            <select
              style={selectStyle}
              value={selectedBrand}
              onChange={handleBrandChange}
              required
            >
              <option value="">Select Brand</option>
              {[...new Set(carTypes.map((carType) => carType.brand))].map(
                (brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                )
              )}
            </select>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Car Model</label>
            <select
              style={selectStyle}
              value={selectedCarName}
              onChange={(e) => setSelectedCarName(e.target.value)}
              required
              disabled={!selectedBrand}
            >
              <option value="">Select Model</option>
              {carTypes
                .filter((carType) => carType.brand === selectedBrand)
                .map((carType) => (
                  <option key={carType._id} value={carType.name}>
                    {carType.name}
                  </option>
                ))}
            </select>
          </div>

          <label style={labelStyle}>Car Model</label>
          <input
            name="carModel"
            style={inputStyle}
            value={formData.carModel}
            onChange={handleChange}
          />

          <label style={labelStyle}>Year</label>
          <input
            name="year"
            style={inputStyle}
            value={formData.year}
            onChange={handleChange}
          />

          <label style={labelStyle}>Color</label>
          <input
            name="color"
            style={inputStyle}
            value={formData.color}
            onChange={handleChange}
          />

          <label style={labelStyle}>License Plate No.</label>
          <input
            name="licensePlate"
            style={inputStyle}
            value={formData.licensePlate}
            onChange={handleChange}
          />

          <label style={labelStyle}>VIN</label>
          <input
            name="vin"
            style={inputStyle}
            value={formData.vin}
            onChange={handleChange}
          />
        </div>

        {/* LOCATION SECTION */}
        <div style={sectionStyle}>
          <h3>LOCATION</h3>
          <label style={labelStyle}>Car Location</label>
          <input
            name="address"
            style={inputStyle}
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter full address including city, state, and zip code"
            required
          />
          <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
            Please enter the complete address where the car is located
          </p>
        </div>

        {/* PHOTOS AND VIDEOS */}
        <div style={sectionStyle}>
          <h3>PHOTOS</h3>
          <label>Upload multiple car photos (Max 5)</label>
          <br />
          <input
            type="file"
            multiple
            onChange={handleFileSelect}
            accept=".jpg,.jpeg,.png"
          />
          <div style={fileNote}>
            Each file should be less than 5MB and in .jpg, .jpeg or .png format
          </div>

          {/* Image previews */}
          {imagePreviews.length > 0 && (
            <div style={{ marginTop: "15px" }}>
              <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
                Selected Images:
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginBottom: "15px",
                }}
              >
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "14px",
                        fontWeight: "bold",
                        color: "#ff4d4d",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                {selectedFiles.length} of 5 images selected
              </div>
            </div>
          )}
        </div>

        {/* RENTAL DETAILS */}
        <div style={sectionStyle}>
          <h3>RENTAL DETAILS</h3>

          <label style={labelStyle}>Rental Price</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>₹</span>
            <input
              name="rentalPrice"
              type="number"
              style={{ ...inputStyle, flex: 1 }}
              value={formData.rentalPrice}
              onChange={handleChange}
            />
            <span>/day</span>
          </div>

          <label style={labelStyle}>Cancellation</label>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            <label>
              <input
                type="radio"
                name="cancellation"
                value="Yes"
                checked={formData.cancellation === "Yes"}
                onChange={handleChange}
              />{" "}
              Yes
            </label>
            <label>
              <input
                type="radio"
                name="cancellation"
                value="No"
                checked={formData.cancellation === "No"}
                onChange={handleChange}
              />{" "}
              No
            </label>
          </div>

          <label style={labelStyle}>Min Period</label>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              name="minPeriod"
              type="number"
              style={{ ...inputStyle, flex: 1 }}
              value={formData.minPeriod}
              onChange={handleChange}
            />
            <span>days</span>
          </div>
        </div>

        {/* CAR FEATURES */}
        <div style={sectionStyle}>
          <h3>CAR FEATURES</h3>
          <label style={labelStyle}>Transmission</label>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "5px",
              marginBottom: "10px",
            }}
          >
            <label>
              <input
                type="radio"
                name="transmission"
                value="Manual"
                checked={formData.transmission === "Manual"}
                onChange={handleChange}
              />{" "}
              Manual
            </label>
            <label>
              <input
                type="radio"
                name="transmission"
                value="Automatic"
                checked={formData.transmission === "Automatic"}
                onChange={handleChange}
              />{" "}
              Automatic
            </label>
          </div>

          <label>Mileage</label>
          <input
            name="mileage"
            style={inputStyle}
            value={formData.mileage}
            onChange={handleChange}
          />

          <label>Fuel Types</label>
          <input
            name="fuelTypes"
            style={inputStyle}
            value={formData.fuelTypes}
            onChange={handleChange}
          />

          <label>Number of seats</label>
          <input
            name="numberOfSeats"
            style={inputStyle}
            value={formData.numberOfSeats}
            onChange={handleChange}
          />

          <label style={labelStyle}>Features</label>
          <div style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                value={currentFeature}
                onChange={(e) => setCurrentFeature(e.target.value)}
                onKeyPress={handleFeatureKeyPress}
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
                placeholder="Enter a feature (e.g., 'Bluetooth', 'Sunroof')"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                style={{
                  padding: "8px 15px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Add
              </button>
            </div>

            {features.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontWeight: "bold", margin: "0 0 8px 0" }}>
                  Added Features:
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    maxHeight: "150px",
                    overflowY: "auto",
                    padding: "5px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  {features.map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#e9e9e9",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "14px",
                      }}
                    >
                      {feature}
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        style={{
                          marginLeft: "5px",
                          backgroundColor: "transparent",
                          border: "none",
                          color: "#ff4d4d",
                          cursor: "pointer",
                          fontWeight: "bold",
                          fontSize: "16px",
                          padding: "0 5px",
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>
              Press Enter or click Add to add a feature. Features will be stored
              separately for better organization.
            </p>
          </div>

          <label>Additional Features (Description)</label>
          <input
            name="additionalFeatures"
            style={inputStyle}
            value={formData.additionalFeatures}
            onChange={handleChange}
          />
        </div>

        {/* SAFETY AND INSURANCE */}
        <div style={sectionStyle}>
          <h3>SAFETY AND INSURANCE</h3>
          <label>Insurance Type</label>
          <input
            name="insuranceType"
            style={inputStyle}
            value={formData.insuranceType}
            onChange={handleChange}
          />

          <label>Insurance No</label>
          <input
            name="insuranceNo"
            style={inputStyle}
            value={formData.insuranceNo}
            onChange={handleChange}
          />

          <label>Insurance Company</label>
          <input
            name="insuranceCompany"
            style={inputStyle}
            value={formData.insuranceCompany}
            onChange={handleChange}
          />
        </div>

        {/* OWNER INFORMATION */}
        <div style={sectionStyle}>
          <h3>OWNER INFORMATION</h3>
          <label>Owner Name</label>
          <input
            name="ownerName"
            style={inputStyle}
            value={formData.ownerName}
            onChange={handleChange}
          />

          <label>Contact No</label>
          <input
            name="contactNo"
            style={inputStyle}
            value={formData.contactNo}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          style={{
            padding: "10px 24px",
            backgroundColor: isLoading ? "#ccc" : "#58372b",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
          }}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "SUBMIT"}
        </button>
      </form>
    </>
  );
};

export default AddCarForm;
