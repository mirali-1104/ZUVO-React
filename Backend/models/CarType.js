const mongoose = require("mongoose");

const CarTypeSchema = new mongoose.Schema({
  brand: String,
  name: String,
  totalUnits: Number,
  bookedUnits: Number,
  img: String,
  percent: Number,
  pricePerDay: Number,
});

module.exports = mongoose.model("CarType", CarTypeSchema);
