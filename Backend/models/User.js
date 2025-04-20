const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
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
    },
    mobile: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      trim: true,
    },
    dob: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    licenseNo: {
      type: String,
      trim: true,
    },
    issueDate: {
      type: String,
      trim: true,
    },
    expiryDate: {
      type: String,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    walletLinked: {
      type: Boolean,
      default: false,
    },
    walletId: {
      type: String,
      default: null,
    },
    walletStatus: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive",
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        id: String,
        car: String,
        amount: Number,
        mode: String,
        modelImage: String,
      },
    ],
    bookings: [
      {
        id: String,
        date: String,
        location: String,
        modelImage: String,
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    verificationTokenExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
