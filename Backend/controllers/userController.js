const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER || "miralibajadeja90@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "umef hzna ugio tazp",
  },
});

// Verify transporter connection
transporter.verify((error, success) => {
  if (error) {
    console.error("Mail transporter error:", error);
  } else {
    console.log("Mail server is ready to send emails");
  }
});

exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Hash password
    const verificationToken = crypto.randomBytes(20).toString("hex");

    // Create user
    const newUser = new User({
      email,
      password: password,
      isVerified: false,
      emailVerificationToken: verificationToken,
      tokenExpires: Date.now() + 24 * 3600 * 1000, // 24 hours expiration
    });

    await newUser.save();

    // Send verification email
    const verificationUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/users/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: '"Zuvo Car Rental" <miralibajadeja90@gmail.com>',
      to: email,
      subject: "Welcome to Zuvo - Confirm Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to Zuvo Car Rental! 🚗</h2>
          <p>Thank you for registering with us. Please verify your email address to complete your registration.</p>
          <a href="${verificationUrl}" 
             style="display: inline-block; padding: 10px 20px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0;">
            Verify Email Address
          </a>
          <p>If you didn't create an account with Zuvo, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">This link will expire in 24 hours.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message:
        "Registration successful! Please check your email to verify your account.",
    });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      emailVerificationToken: token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: "Invalid or expired verification token" });
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.tokenExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully! You can now login.",
    });
  } catch (err) {
    console.error("Verification Error:", err);
    res.status(500).json({ error: "Server error during verification" });
  }
};
