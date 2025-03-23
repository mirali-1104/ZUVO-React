const express = require("express");
const dotenv = require("dotenv");
const app = express();



const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello! How are You ???");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
