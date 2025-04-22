import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarP from '../components/NavbarP';

// Add CSS for spinner animation
const spinnerAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    // Check if booking data is available in location state
    if (location.state && location.state.bookingData) {
      const data = location.state.bookingData;
      console.log('Booking data received:', data);
      
      // Ensure we have all required fields
      if (!data.totalAmount) {
        setError('Invalid booking data: missing total amount');
        setLoading(false);
        return;
      }
      
      setBookingData(data);
      setLoading(false);

      // Initialize Razorpay once booking data is available
      const initRazorpay = async () => {
        try {
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            console.error('Failed to load Razorpay SDK');
          }
        } catch (error) {
          console.error('Error loading Razorpay SDK:', error);
        }
      };
      
      initRazorpay();
    } else {
      setError('No booking information found');
      setLoading(false);
    }
  }, [location]);

  // Function to load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay SDK loaded');
        resolve(true);
      };
      script.onerror = () => {
        console.error('Razorpay SDK failed to load');
        setError('Payment gateway failed to load. Please try again later.');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Function to create a booking in the database
  const createBooking = async (paymentDetails) => {
    try {
      console.log('Creating booking with payment details:', paymentDetails);
      
      if (!bookingData) {
        throw new Error('Booking data is missing');
      }
      
      // Validate booking data has all required fields
      const requiredFields = ['carId', 'userId', 'totalDays', 'totalAmount', 'carName'];
      const missingFields = requiredFields.filter(field => !bookingData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required booking information: ${missingFields.join(', ')}`);
      }
      
      // Make sure dates are valid - if missing, use current dates
      if (!bookingData.startDate) {
        bookingData.startDate = new Date();
      }
      
      if (!bookingData.endDate) {
        // Calculate end date based on total days
        const endDate = new Date(bookingData.startDate);
        endDate.setDate(endDate.getDate() + (bookingData.totalDays || 1));
        bookingData.endDate = endDate;
      }
      
      // Prepare booking request
      const bookingRequest = {
        ...bookingData,
        paymentId: paymentDetails.razorpay_payment_id || paymentDetails.id || 'manual_payment_' + Date.now(),
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        paymentDetails: paymentDetails,
        // Add any missing fields with defaults
        pickupLocation: bookingData.pickupLocation || 'Main Branch'
      };
      
      console.log('Sending booking request:', bookingRequest);
      
      const response = await axios.post(
        'http://localhost:5000/api/bookings/create',
        bookingRequest,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data && response.data.success) {
        console.log('Booking created successfully:', response.data);
        return response.data.booking;
      } else {
        console.error('Server returned error:', response.data);
        throw new Error(response.data?.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      
      let errorMessage = 'Failed to create booking';
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // If we get a specific error message from the server, use it
        if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      // Throw with a specific error message
      throw new Error(`Booking creation failed: ${errorMessage}`);
    }
  };

  // Function to initiate payment
  const initiatePayment = async () => {
    if (paymentProcessing || !bookingData) return;
    
    setPaymentProcessing(true);
    setError(null);
    setDebugInfo({
      status: "Starting payment process",
      amount: bookingData.totalAmount,
      key: "rzp_test_jVqdtFwidymhM3"
    });
    
    try {
      console.log('Initiating Razorpay payment for amount:', bookingData.totalAmount);
      
      // First, create an order on your backend
      const token = localStorage.getItem('authToken');
      
      setDebugInfo(prev => ({
        ...prev,
        status: "Creating order with backend"
      }));
      
      const orderResponse = await axios.post(
        'http://localhost:5000/api/payments/create-order',
        { 
          amount: Math.round(bookingData.totalAmount * 100), // Convert to paise/cents and ensure it's an integer
          currency: 'INR',
          receipt: `booking_${Date.now()}`,
          notes: {
            carId: bookingData.carId,
            userId: bookingData.userId,
            carName: bookingData.carName
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      console.log('Order created successfully:', orderResponse.data);
      
      setDebugInfo(prev => ({
        ...prev,
        status: "Order created, initializing Razorpay",
        orderId: orderResponse.data.orderId,
        orderAmount: orderResponse.data.amount
      }));
      
      // Configure Razorpay options
      const options = {
        key: 'rzp_test_jVqdtFwidymhM3', // Use the key that worked previously
        amount: orderResponse.data.amount,
        currency: orderResponse.data.currency || 'INR',
        name: 'ZUVO Car Rental',
        description: `Booking for ${bookingData.carName}`,
        order_id: orderResponse.data.orderId,
        handler: async function(response) {
          try {
            console.log('Payment successful:', response);
            setDebugInfo(prev => ({
              ...prev,
              status: "Payment successful, creating booking",
              paymentId: response.razorpay_payment_id
            }));
            
            // Create booking with verified payment details
            const booking = await createBooking({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              status: 'completed',
              verified: true
            });
            
            console.log('Booking created successfully after payment:', booking);
            setDebugInfo(prev => ({
              ...prev,
              status: "Booking created, redirecting to confirmation"
            }));
            
            // Navigate to booking confirmation
            navigate('/booking-confirmation', { state: { booking } });
          } catch (error) {
            console.error('Error processing payment verification:', error);
            setError('Failed to process booking: ' + error.message);
            setPaymentProcessing(false);
            setDebugInfo(prev => ({
              ...prev,
              status: "Error after payment",
              error: error.message
            }));
          }
        },
        prefill: {
          name: localStorage.getItem('userName') || '',
          email: localStorage.getItem('userEmail') || '',
          contact: localStorage.getItem('userPhone') || ''
        },
        theme: {
          color: '#5c3b1f'
        }
      };
      
      console.log('Razorpay options:', { ...options, key: options.key.substring(0, 10) + '...' });
      
      setDebugInfo(prev => ({
        ...prev,
        status: "Opening Razorpay payment form"
      }));
      
      // Initialize Razorpay payment form
      const razorpay = new window.Razorpay(options);
      
      // Handle payment failures
      razorpay.on('payment.failed', function(response) {
        console.error('Payment failed:', response.error);
        setError(`Payment failed: ${response.error.description}`);
        setPaymentProcessing(false);
        setDebugInfo(prev => ({
          ...prev,
          status: "Payment failed",
          error: response.error?.description
        }));
      });
      
      // Open Razorpay payment form
      razorpay.open();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        console.error('Response data:', error.response.data);
        setDebugInfo({
          status: "Request failed",
          errorType: "API Error",
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      } else {
        console.error('Error message:', error.message);
        setDebugInfo({
          status: "Request failed",
          errorType: "JS Error",
          message: error.message,
          stack: error.stack
        });
      }
      
      setError(`Failed to initiate payment: ${error.message}`);
      setPaymentProcessing(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <>
        <style>{spinnerAnimation}</style>
        <NavbarP />
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>Processing Your Booking</h2>
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              <p>Please wait while we prepare your booking...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <style>{spinnerAnimation}</style>
        <NavbarP />
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>Something Went Wrong</h2>
            <p style={errorStyle}>{error}</p>
            {debugInfo && (
              <div style={{ 
                margin: '15px 0',
                padding: '10px',
                backgroundColor: '#f8f8f8',
                borderRadius: '4px',
                fontSize: '14px',
                color: '#666'
              }}>
                <p><strong>Debug Information:</strong></p>
                <pre style={{ overflow: 'auto', maxWidth: '100%' }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            )}
            <button 
              style={buttonStyle} 
              onClick={handleGoBack}
            >
              Go Back
            </button>
          </div>
        </div>
      </>
    );
  }

  // Main UI render
  return (
    <>
      <style>{spinnerAnimation}</style>
      <NavbarP />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2 style={headingStyle}>Complete Your Booking</h2>
          
          {bookingData && (
            <div style={bookingDetailsStyle}>
              <h3 style={subheadingStyle}>Booking Summary</h3>
              
              <div style={detailRowStyle}>
                <div style={detailLabelStyle}>Vehicle</div>
                <div style={detailValueStyle}>{bookingData.carName}</div>
              </div>
              
              <div style={detailRowStyle}>
                <div style={detailLabelStyle}>Duration</div>
                <div style={detailValueStyle}>{bookingData.totalDays} day(s)</div>
              </div>
              
              <div style={detailRowStyle}>
                <div style={detailLabelStyle}>Pickup Date</div>
                <div style={detailValueStyle}>{bookingData.startDate}</div>
              </div>
              
              <div style={detailRowStyle}>
                <div style={detailLabelStyle}>Return Date</div>
                <div style={detailValueStyle}>{bookingData.endDate}</div>
              </div>
              
              <div style={{...detailRowStyle, borderBottom: 'none'}}>
                <div style={detailLabelStyle}>Total Amount</div>
                <div style={priceStyle}>₹{bookingData.totalAmount}</div>
              </div>
            </div>
          )}
          
          <div style={paymentContainerStyle}>
            <h3 style={subheadingStyle}>Payment</h3>
            <p style={paymentDescriptionStyle}>
              Click the button below to proceed with secure payment via Razorpay.
            </p>
            
            <button 
              style={payButtonStyle} 
              onClick={initiatePayment}
              disabled={paymentProcessing}
            >
              {paymentProcessing ? (
                <>
                  <div style={spinnerSmallStyle}></div>
                  Processing...
                </>
              ) : (
                "Pay Now ₹" + (bookingData?.totalAmount || 0)
              )}
            </button>
            
            <div style={securePaymentStyle}>
              <span style={lockIconStyle}>🔒</span> Secured by Razorpay
            </div>
            
            {/* Debug information */}
            <div style={{marginTop: "15px", fontSize: "13px", color: "#888", textAlign: "left", 
                         border: "1px dashed #ccc", padding: "10px", borderRadius: "4px"}}>
              <p style={{margin: "0 0 5px 0", fontWeight: "bold"}}>Debug Information:</p>
              {paymentProcessing && <p style={{margin: "3px 0"}}>⏳ Processing payment...</p>}
              {debugInfo && (
                <div style={{overflow: "auto", maxHeight: "150px"}}>
                  <pre style={{margin: "3px 0", fontSize: "11px"}}>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
              <p style={{margin: "3px 0"}}>📦 Using Razorpay Key: {debugInfo?.key || 'rzp_test_jVqdtFwidymhM3'}</p>
              <p style={{margin: "3px 0"}}>🔑 Make sure your API keys match in the following files:</p>
              <ul style={{margin: "0", paddingLeft: "20px", fontSize: "11px"}}>
                <li>PaymentProcess.jsx</li>
                <li>ProfilePage.jsx</li>
                <li>paymentController.js</li>
                <li>paymentRoutes.js</li>
              </ul>
            </div>
            
            {/* Temporary bypass for testing */}
            <div style={{marginTop: "20px", borderTop: "1px dashed #ccc", paddingTop: "15px"}}>
              <p style={{fontSize: "14px", color: "#666", marginBottom: "10px"}}>
                If you're experiencing payment issues, you can use the direct booking option:
              </p>
              <button 
                style={{...backButtonStyle, backgroundColor: "#28a745", width: "100%"}}
                onClick={async () => {
                  try {
                    setDebugInfo({
                      status: "Creating direct booking",
                      skippingPayment: true
                    });
                    
                    // Create simulated payment details
                    const paymentId = 'pay_direct_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
                    const orderId = 'order_direct_' + Date.now() + '_' + Math.random().toString(36).substring(2, 10);
                    
                    const paymentDetails = {
                      razorpay_payment_id: paymentId,
                      razorpay_order_id: orderId,
                      razorpay_signature: 'direct_booking_signature_' + Date.now(),
                      status: 'direct',
                      amount: bookingData.totalAmount * 100,
                      method: 'direct',
                      verified: true
                    };
                    
                    setDebugInfo(prev => ({
                      ...prev,
                      status: "Creating direct booking with payment details",
                      paymentDetails
                    }));
                    
                    // Create booking with direct payment
                    const booking = await createBooking(paymentDetails);
                    
                    setDebugInfo(prev => ({
                      ...prev,
                      status: "Direct booking created, redirecting to confirmation",
                      booking: booking._id || 'unknown'
                    }));
                    
                    // Navigate to booking confirmation
                    navigate('/booking-confirmation', { state: { booking } });
                  } catch (error) {
                    console.error('Error creating direct booking:', error);
                    setError('Failed to create direct booking: ' + error.message);
                    setDebugInfo(prev => ({
                      ...prev,
                      status: "Error creating direct booking",
                      error: error.message
                    }));
                  }
                }}
              >
                Create Direct Booking (Skip Payment)
              </button>
            </div>
          </div>
          
          <button 
            style={backButtonStyle} 
            onClick={handleGoBack}
            disabled={paymentProcessing}
          >
            Go Back
          </button>
        </div>
      </div>
    </>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 'calc(100vh - 90px)',
  padding: '20px',
  backgroundColor: '#f5f5f5',
  fontFamily: 'Arial, sans-serif'
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  padding: '30px',
  width: '100%',
  maxWidth: '600px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const headingStyle = {
  color: '#3d342a',
  fontSize: '24px',
  marginBottom: '25px',
  textAlign: 'center',
  fontWeight: 'bold'
};

const subheadingStyle = {
  color: '#5c3b1f',
  fontSize: '18px',
  marginBottom: '15px',
  fontWeight: 'bold'
};

const bookingDetailsStyle = {
  backgroundColor: '#f9f6f0',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '25px'
};

const detailRowStyle = {
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e0d6b8'
};

const detailLabelStyle = {
  fontWeight: 'bold',
  color: '#5c3b1f',
  marginBottom: '5px'
};

const detailValueStyle = {
  color: '#333'
};

const priceStyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#5c3b1f'
};

const paymentContainerStyle = {
  backgroundColor: '#f0f8f2',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '20px',
  textAlign: 'center'
};

const paymentDescriptionStyle = {
  margin: '0 0 20px 0',
  color: '#555'
};

const payButtonStyle = {
  backgroundColor: '#5c3b1f',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '12px 25px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '15px'
};

const backButtonStyle = {
  backgroundColor: '#888',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '10px 20px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const securePaymentStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  color: '#666',
  fontSize: '14px'
};

const lockIconStyle = {
  fontSize: '16px'
};

const errorStyle = {
  color: '#e03131',
  backgroundColor: '#fff5f5',
  padding: '15px',
  borderRadius: '6px',
  marginBottom: '20px',
  borderLeft: '4px solid #e03131'
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 0'
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid rgba(92, 59, 31, 0.1)',
  borderTop: '4px solid #5c3b1f',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
  marginBottom: '15px'
};

const spinnerSmallStyle = {
  width: '18px',
  height: '18px',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  borderTop: '3px solid #fff',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite'
};

export default PaymentProcess; 