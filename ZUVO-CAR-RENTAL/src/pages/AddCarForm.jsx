import React, { useState } from "react";

const AddCarForm = () => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form Submitted!");
    console.log(formData);
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

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        padding: "20px",
        // maxWidth: "600px",
        margin: "0 auto",
        fontFamily: "sans-serif",
        background : "white",
        color: "black"
      }}
    >
      <h2>ADD YOUR CAR DETAILS</h2>

      {/* CAR INFORMATION */}
      <div style={sectionStyle}>
        <h3>CAR INFORMATION</h3>
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

      {/* PHOTOS AND VIDEOS */}
      <div style={sectionStyle}>
        <h3>PHOTOS AND VIDEOS</h3>
        <label>Upload multiple car photos</label>
        <br />
        <input type="file" multiple />
        <div style={fileNote}>
          file should be less than 20MB and .jpg and .png only
        </div>

        <br />
        <label>Upload video : Short video showcasing the car</label>
        <br />
        <input type="file" />
        <div style={fileNote}>
          file should be less than 40MB and .mp4 and .mkv only
        </div>
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

        <label>Additional Features</label>
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
        <label>Name</label>
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

        <label>Profile Picture</label>
        <br />
        <input type="file" />
      </div>

      {/* LEGAL AND DOCUMENTATION */}
      <div style={sectionStyle}>
        <h3>LEGAL AND DOCUMENTATION</h3>
        <label>Car Registration Document</label>
        <br />
        <input type="file" />
        <div style={fileNote}>
          file should be less than 20MB and .jpg and .png only
        </div>

        <br />
        <label>Insurance Certificate</label>
        <br />
        <input type="file" />
        <div style={fileNote}>
          file should be less than 20MB and .jpg and .png only
        </div>
      </div>

      <div style={{ textAlign: "right", marginTop: "30px" }}>
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            background: "#2d1d13",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
          }}
        >
          SUBMIT
        </button>
      
      </div>
    </form>
  );
};

export default AddCarForm;
