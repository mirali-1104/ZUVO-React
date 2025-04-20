const nodemailer = require('nodemailer');
require('dotenv').config();

// Verify environment variables
console.log('Email configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'Set' : 'Not set');

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('Transporter verification failed:', error);
    } else {
        console.log('Transporter is ready to send emails');
    }
});

// Function to send verification email
const sendVerificationEmail = async (email, verificationToken) => {
    try {
        // Create verification URL
        const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/host/verify/${verificationToken}`;

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify Your Email - ZUVO Car Rental',
            html: `
                <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
                    <h1 style="color: #333; text-align: center;">Email Verification</h1>
                    <p style="color: #666; font-size: 16px;">Thank you for registering with ZUVO Car Rental. Please click the button below to verify your email address:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verificationUrl}" 
                           style="background-color: #4CAF50; 
                                  color: white; 
                                  padding: 12px 30px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  font-size: 16px;">
                            Verify Email
                        </a>
                    </div>
                    <p style="color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
                    <p style="color: #666; font-size: 14px;">If you did not create an account, please ignore this email.</p>
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #888; font-size: 12px;">
                        <p>ZUVO Car Rental</p>
                    </div>
                </div>
            `
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully to:', email);
        console.log('Message ID:', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending verification email:');
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        console.error('Error response:', error.response);
        return false;
    }
};

module.exports = { sendVerificationEmail }; 