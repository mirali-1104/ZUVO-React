import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCarSide, FaSignOutAlt, FaCog, FaHome, FaHistory } from 'react-icons/fa';

const SideNav = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication related data
    localStorage.removeItem('hostData');
    localStorage.removeItem('host');
    localStorage.removeItem('authToken');
    
    // Redirect to login
    navigate('/host-login');
  };

  const getLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: isActive ? '#007bff' : '#333',
    textDecoration: 'none',
    borderLeft: isActive ? '4px solid #007bff' : '4px solid transparent',
    backgroundColor: isActive ? '#f0f7ff' : 'transparent',
    transition: 'all 0.3s ease',
    margin: '5px 0',
    borderRadius: '0 5px 5px 0',
    ':hover': {
      backgroundColor: '#f0f7ff',
    }
  });

  const iconStyle = {
    marginRight: '12px',
    fontSize: '18px'
  };

  // Determine current path to highlight active link
  const path = window.location.pathname;

  return (
    <div style={{
      width: '250px',
      height: '100vh',
      position: 'fixed',
      top: 0,
      left: 0,
      backgroundColor: '#ffffff',
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: '10px',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          Z
        </div>
        <h2 style={{ margin: 0 }}>ZUVO Host</h2>
      </div>

      <div style={{ flexGrow: 1, padding: '20px 0' }}>
        <Link to="/host-dashboard" style={getLinkStyle(path === '/host-dashboard')}>
          <FaHome style={iconStyle} />
          Dashboard
        </Link>
        <Link to="/host-page" style={getLinkStyle(path === '/host-page')}>
          <FaCarSide style={iconStyle} />
          My Cars
        </Link>
        <Link to="/bookings" style={getLinkStyle(path === '/bookings')}>
          <FaHistory style={iconStyle} />
          Bookings
        </Link>
        <Link to="/host-profile" style={getLinkStyle(path === '/host-profile')}>
          <FaUserCircle style={iconStyle} />
          Profile
        </Link>
        <Link to="/host-settings" style={getLinkStyle(path === '/host-settings')}>
          <FaCog style={iconStyle} />
          Settings
        </Link>
      </div>

      <div style={{ padding: '20px', borderTop: '1px solid #e0e0e0' }}>
        <button 
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            padding: '12px 20px',
            color: '#dc3545',
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontSize: '16px'
          }}
        >
          <FaSignOutAlt style={iconStyle} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default SideNav; 