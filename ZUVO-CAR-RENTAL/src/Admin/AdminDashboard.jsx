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

  const bookingData = [
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

  const pieData = [
    { name: "Hired", value: 52 },
    { name: "Pending", value: 27 },
    { name: "Cancelled", value: 21 },
  ];

  const COLORS = ["#58A06E", "#D3A048", "#DA524E"];

  const menuItems = [
    { label: "Dashboard", icon: "📊", path: "/admin/dashboard" },
    { label: "Bookings", icon: "📑", path: "/admin-bookings" },
    { label: "Units", icon: "🚗", path: "/admin-units" },
    { label: "Clients", icon: "👥", path: "/admin-clients" },
    { label: "Payments", icon: "💳", path: "/admin-payments" },
  ];

  const fetchData = async () => {
    const res = await axios.get("http://localhost:5000/api/carType/car-types");
    setCarTypes(res.data);
  };

  useEffect(() => {
    fetchData();
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
      const res = await axios.post("http://localhost:5000/api/carType/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
              <p style={{ fontSize: "14px", fontWeight: "bold" }}>Admin Name</p>
              <p style={{ fontSize: "12px" }}>Admin</p>
            </div>
          </div>
        </div>

        {/* Revenue Cards */}
        <div style={{ display: "flex", gap: "16px", flex: "none" }}>
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                background: "linear-gradient(to bottom, #e3ddcf, #d0c8ba)",
                padding: "16px",
                flex: 1,
                color: "#41372D",
                borderRadius: "10px",
              }}
            >
              <h3 style={{ fontSize: "14px" }}>Total Revenue</h3>
              <p style={{ fontSize: "18px", fontWeight: "bold" }}>₹ 2,60,829</p>
            </div>
          ))}
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
            <BarChart width={600} height={200} data={bookingData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#332f2b" />
            </BarChart>
            <h3 style={{ marginTop: "20px" }}>Booking Trends</h3>
            <LineChart width={600} height={200} data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
            </LineChart>
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
              Rent Status
            </h3>
            <PieChart
              width={300}
              height={300}
              style={{
                justifyContent: "center",
              }}
            >
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
            <ul
              style={{ fontSize: "14px", marginTop: "10px", color: "#41372D" }}
            >
              <li>🟢 Hired - 52%</li>
              <li>🟡 Pending - 27%</li>
              <li>🔴 Cancelled - 21%</li>
            </ul>
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
                <h4 style={{ marginBottom: "20px", textAlign: "center", color: "#41372D" }}>Add New Car Type</h4>
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
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#4a8a5c")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#58A06E")}
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
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#c44a44")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DA524E")}
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
