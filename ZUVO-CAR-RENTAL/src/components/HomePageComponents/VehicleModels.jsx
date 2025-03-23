import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import { FreeMode, Pagination } from "swiper/modules";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaHeart, FaGasPump, FaCogs, FaChair } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "F:/RP - ZUVO/ZUVO-React/ZUVO-CAR-RENTAL/src/styles/HomePageStyles/VehicleModel.css";

// Sample Vehicle Data
const VehicleM = [
  {
    title: "Baleno 2020",
    price: "234/hr",
    transmission: "Manual",
    seats: "5 seats",
    fuel: "Petrol",
    image: "/Model1.png",
  },
  {
    title: "Maruti Suzuki Ertiga",
    price: "235/hr",
    transmission: "Manual",
    seats: "7 seats",
    fuel: "Petrol",
    image: "/Model2.png",
  },
  {
    title: "Maruti Suzuki Swift 2020",
    price: "145/hr",
    transmission: "Manual",
    seats: "5 seats",
    fuel: "Petrol",
    image: "/Model3.png",
  },
  {
    title: "Maruti Suzuki Swift 2020",
    price: "145/hr",
    transmission: "Manual",
    seats: "5 seats",
    fuel: "Petrol",
    image: "/Model4.png",
  },
  {
    title: "Maruti Suzuki Swift 2020",
    price: "145/hr",
    transmission: "Manual",
    seats: "5 seats",
    fuel: "Petrol",
    image: "/Model4.png",
  },
];

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    // Implement your search logic here
    console.log("Search query:", searchQuery);
  };

  const handleImageClick = (vehicle) => {
    // Navigate to the CarBuy page with the selected vehicle data
    navigate("/car-buy", { state: { vehicle } });
  };

  return (
    <section id="vehicle-models" className="vehicle-models-section">
      <div className="Vehicle-model-section">
        <div className="flex items-center justify-center flex-col h-screen bg-[#D6BFC4] p-8">
          <h2 className="text-2xl font-bold mb-6">Vehicle Models</h2>

          <div className="flex items-center mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search vehicles..."
              className="px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none"
            >
              Search
            </button>
          </div>

          <Swiper
            breakpoints={{
              340: { slidesPerView: 1, spaceBetween: 15 },
              700: { slidesPerView: 2, spaceBetween: 15 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
            }}
            freeMode={true}
            pagination={{ clickable: true }}
            modules={[FreeMode, Pagination]}
            className="w-full max-w-5xl"
          >
            {VehicleM.map((item, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="card"
                  onClick={() => handleImageClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="like-button">
                    <FaHeart />
                  </div>
                  <img src={item.image} alt={item.title} className="card-img" />
                  <div className="card-body">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-price">Rs. {item.price}</p>
                    <div className="card-info">
                      <span>
                        <FaCogs /> {item.transmission}
                      </span>
                      <span>
                        <FaGasPump /> {item.fuel}
                      </span>
                      <span>
                        <FaChair /> {item.seats}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default App;
