import React from "react";
import { Link } from "react-router-dom";
import { FaCar, FaGasPump, FaCogs } from "react-icons/fa";

const CarCard = ({ car, onToggleAvailability }) => {
  // Destructure car properties
  const {
    _id,
    carName,
    carModel,
    fuelType,
    transmission,
    isAvailable,

    rentalPrice,
    carImages,
  } = car;

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: "180px",
          overflow: "hidden",
          background: "#eee",
          position: "relative",
        }}
      >
        {carImages && carImages.length > 0 ? (
          <img
            src={carImages[0]}
            alt={carName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#999",
            }}
          >
            <FaCar size={60} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: isAvailable ? "#28a745" : "#dc3545",
            color: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {isAvailable ? "Available" : "Unavailable"}
        </div>
      </div>

      <div style={{ padding: "15px" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>{carName}</h3>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "10px",
            fontSize: "14px",
            color: "#666",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaCar size={14} />
            <span>{carModel}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaGasPump size={14} />
            <span>{fuelType}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FaCogs size={14} />
            <span>{transmission}</span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
            paddingTop: "15px",
            borderTop: "1px solid #eee",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333",
            }}
          >
            ₹{rentalPrice}/day
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleAvailability(_id, !isAvailable);
              }}
              style={{
                padding: "8px 12px",
                backgroundColor: isAvailable ? "#dc3545" : "#28a745",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {isAvailable ? "Set Unavailable" : "Set Available"}
            </button>

            <Link to={`/edit-car/${_id}`} onClick={(e) => e.stopPropagation()}>
              <button
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Edit
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
