import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavbarP from '../components/NavbarP';
import { FaCheck, FaCalendarAlt, FaCar, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.state && location.state.booking) {
      setBooking(location.state.booking);
      setIsLoading(false);
      
      // Send a confirmation email (this would normally be done on the backend)
      console.log('Booking confirmed, email would be sent here');
      
      // Clear booking state from session storage in case it's still there
      sessionStorage.removeItem('bookingState');
    } else {
      setIsLoading(false);
    }
  }, [location]);

  const handleViewBookings = () => {
    navigate('/my-bookings');
  };

  const handleGoHome = () => {
    navigate('/home-after-login');
  };

  if (isLoading) {
    return (
      <>
        <NavbarP />
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={loadingStyle}>
              <div style={spinnerStyle}></div>
              <p>Loading your booking confirmation...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <NavbarP />
        <div style={containerStyle}>
          <div style={cardStyle}>
            <h2 style={headingStyle}>Booking Not Found</h2>
            <p style={{ textAlign: 'center', marginBottom: '20px' }}>
              We couldn't find your booking information. Please check your bookings page for details.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
              <button style={buttonStyle} onClick={handleViewBookings}>
                View My Bookings
              </button>
              <button 
                style={{ ...buttonStyle, backgroundColor: '#888' }} 
                onClick={handleGoHome}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarP />
      <div style={containerStyle}>
        <div style={cardStyle}>
          <div style={successIconContainerStyle}>
            <div style={successIconStyle}>
              <FaCheck size={32} color="white" />
            </div>
          </div>
          
          <h2 style={headingStyle}>Booking Confirmed!</h2>
          
          <p style={messageStyle}>
            Thank you for booking with ZUVO Car Rental. Your payment has been processed successfully.
          </p>
          
          <div style={bookingDetailsStyle}>
            <h3 style={subheadingStyle}>Booking Details</h3>
            
            <div style={detailRowStyle}>
              <div style={detailLabelStyle}>
                <FaCar style={iconStyle} /> Vehicle
              </div>
              <div style={detailValueStyle}>
                {booking.carName}
              </div>
            </div>
            
            <div style={detailRowStyle}>
              <div style={detailLabelStyle}>
                <FaCalendarAlt style={iconStyle} /> Pickup Date
              </div>
              <div style={detailValueStyle}>
                {new Date(booking.startDate).toLocaleDateString()}
              </div>
            </div>
            
            <div style={detailRowStyle}>
              <div style={detailLabelStyle}>
                <FaCalendarAlt style={iconStyle} /> Return Date
              </div>
              <div style={detailValueStyle}>
                {new Date(booking.endDate).toLocaleDateString()}
              </div>
            </div>
            
            <div style={detailRowStyle}>
              <div style={detailLabelStyle}>
                <FaMapMarkerAlt style={iconStyle} /> Pickup Location
              </div>
              <div style={detailValueStyle}>
                {booking.pickupLocation || "ZUVO Car Rental, Main Branch"}
              </div>
            </div>
            
            <div style={{ ...detailRowStyle, borderBottom: 'none' }}>
              <div style={detailLabelStyle}>
                <FaEnvelope style={iconStyle} /> Confirmation
              </div>
              <div style={detailValueStyle}>
                A confirmation email has been sent to your registered email address.
              </div>
            </div>
          </div>
          
          <div style={paymentDetailsStyle}>
            <h3 style={subheadingStyle}>Payment Details</h3>
            <div style={detailRowStyle}>
              <div>Payment ID</div>
              <div style={{ fontWeight: 'bold' }}>{booking.paymentId}</div>
            </div>
            <div style={{ ...detailRowStyle, borderBottom: 'none' }}>
              <div>Amount Paid</div>
              <div style={{ fontWeight: 'bold' }}>₹{booking.totalAmount}</div>
            </div>
          </div>
          
          <div style={buttonsContainerStyle}>
            <button 
              style={{ ...buttonStyle, backgroundColor: '#888', marginRight: '15px' }} 
              onClick={handleGoHome}
            >
              Go Home
            </button>
            <button 
              style={buttonStyle} 
              onClick={handleViewBookings}
            >
              View My Bookings
            </button>
          </div>
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

const successIconContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '25px'
};

const successIconStyle = {
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: '#2f9e44',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(47, 158, 68, 0.3)'
};

const headingStyle = {
  color: '#3d342a',
  fontSize: '24px',
  marginBottom: '15px',
  textAlign: 'center',
  fontWeight: 'bold'
};

const messageStyle = {
  textAlign: 'center',
  fontSize: '16px',
  color: '#666',
  marginBottom: '30px'
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

const paymentDetailsStyle = {
  backgroundColor: '#f0f8f2',
  padding: '20px',
  borderRadius: '6px',
  marginBottom: '30px'
};

const detailRowStyle = {
  display: 'flex',
  flexDirection: 'column',
  marginBottom: '15px',
  paddingBottom: '15px',
  borderBottom: '1px solid #e0d6b8'
};

const detailLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  fontWeight: 'bold',
  color: '#5c3b1f',
  marginBottom: '5px'
};

const detailValueStyle = {
  color: '#333',
  paddingLeft: '25px'
};

const iconStyle = {
  marginRight: '8px',
  color: '#5c3b1f'
};

const buttonsContainerStyle = {
  display: 'flex',
  justifyContent: 'center'
};

const buttonStyle = {
  backgroundColor: '#5c3b1f',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  padding: '12px 20px',
  fontSize: '16px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'background-color 0.3s'
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
  borderRadius: '50%',
  border: '3px solid #f3f3f3',
  borderTop: '3px solid #5c3b1f',
  animation: 'spin 1s linear infinite',
  marginBottom: '20px'
};

export default BookingConfirmation; 