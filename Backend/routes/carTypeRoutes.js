const express = require("express");
const router = express.Router();
const CarType = require("../models/CarType");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  },
});

const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { brand, name, totalUnits, bookedUnits, pricePerDay } = req.body;

    let parsedTotalUnits = Number(totalUnits);
    let parsedBookedUnits = Number(bookedUnits);

    if (isNaN(parsedTotalUnits) || isNaN(parsedBookedUnits)) {
      return res
        .status(400)
        .send({ error: "Invalid totalUnits or bookedUnits" });
    }

    const percent =
      parsedTotalUnits === 0 ? 0 : (parsedBookedUnits / parsedTotalUnits) * 100;

    const newCar = new CarType({
      brand,
      name,
      totalUnits: parsedTotalUnits,
      bookedUnits: parsedBookedUnits,
      img: req.file.filename, // save image filename
      pricePerDay,
      percent,
    });

    await newCar.save();
    res.send({ message: "Car added" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

router.get("/car-types", async (req, res) => {
  const cars = await CarType.find();
  res.send(cars);
});

module.exports = router;
