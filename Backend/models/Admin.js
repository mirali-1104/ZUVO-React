const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    default: "admin",
    enum: ["admin", "superadmin"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
  return candidatePassword === this.password;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin; 