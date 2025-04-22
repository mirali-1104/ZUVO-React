import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/AddCarForm.css";

// The style for the map container
const mapContainerStyle = {
  width: "100%",
  height: "300px",
  marginBottom: "15px",
  borderRadius: "8px",
};

// Default center position (India)
const defaultCenter = {
  lat: 20.5937,
  lng: 78.9629,
};

// You'll need to get a Google Maps API key
// Replace the placeholder below with your actual API key
// Get one from: https://developers.google.com/maps/documentation/javascript/get-api-key
const googleMapsApiKey = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual API key

const AddCarForm = () => {
  const [carTypes, setCarTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCarName, setSelectedCarName] = useState("");
  const [location, setLocation] = useState({ lat: defaultCenter.lat, lng: defaultCenter.lng, address: "" });
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [isLoading, setIsLoading] = useState(false);
  const geocoderRef = useRef(null);

  useEffect(() => {
    const fetchCarTypes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/carType/car-types");
        setCarTypes(response.data);
      } catch (error) {
        console.error("Error fetching car types:", error);
        toast.error("Failed to fetch car types");
      }
    };

    fetchCarTypes();
  }, []);

  // Initialize geocoder when map is loaded
  const onMapLoad = (map) => {
    geocoderRef.current = new window.google.maps.Geocoder();
  };

  // Handle map click event
  const onMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    // Update location state with new coordinates
    setLocation({ ...location, lat, lng });
    
    // Update map center
    setMapCenter({ lat, lng });
    
    // Perform reverse geocoding to get address
    if (geocoderRef.current) {
      geocoderRef.current.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          setLocation({
            lat,
            lng,
            address: results[0].formatted_address
          });
        } else {
          toast.error("Failed to get address for this location");
        }
      });
    }
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
    setSelectedCarName(""); // Reset car name when brand changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (location.lat === defaultCenter.lat && location.lng === defaultCenter.lng) {
      toast.error("Please select a location on the map");
      return;
    }
    
    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/cars/add", {
        brand: selectedBrand,
        name: selectedCarName,
        location: {
          latitude: location.lat,
          longitude: location.lng,
          address: location.address
        }
      });

      if (response.data.success) {
        toast.success("Car added successfully!");
        // Reset form
        setSelectedBrand("");
        setSelectedCarName("");
        setLocation({ lat: defaultCenter.lat, lng: defaultCenter.lng, address: "" });
        setMapCenter(defaultCenter);
      } else {
        toast.error(response.data.error || "Failed to add car");
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast.error(error.response?.data?.error || "Failed to add car");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-car-form">
      <h2>Add New Car</h2>
      
      <div className="form-group">
        <label htmlFor="brand">Car Brand</label>
        <select
          id="brand"
          value={selectedBrand}
          onChange={handleBrandChange}
          required
          className="form-control"
        >
          <option value="">Select Brand</option>
          {[...new Set(carTypes.map((carType) => carType.brand))].map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="carName">Car Model</label>
        <select
          id="carName"
          value={selectedCarName}
          onChange={(e) => setSelectedCarName(e.target.value)}
          required
          disabled={!selectedBrand}
          className="form-control"
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
      
      <div className="form-group">
        <label>Location (Click on map to select)</label>
        <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={["places"]}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={5}
            onClick={onMapClick}
            onLoad={onMapLoad}
          >
            {location.lat !== defaultCenter.lat && location.lng !== defaultCenter.lng && (
              <Marker position={{ lat: location.lat, lng: location.lng }} />
            )}
          </GoogleMap>
        </LoadScript>
        <input
          type="text"
          value={location.address}
          readOnly
          placeholder="Selected location address will appear here"
          className="form-control"
        />
      </div>
      
      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? "Adding..." : "Add Car"}
      </button>
    </form>
  );
};

export default AddCarForm; 