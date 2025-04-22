import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const AddCarButton = () => {
  return (
    <Link to="/add-car" style={{ textDecoration: 'none' }}>
      <div style={{
        width: '300px',
        height: '340px',
        border: '2px dashed #ddd',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        color: '#666',
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          backgroundColor: '#e9ecef',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '15px'
        }}>
          <FaPlus size={30} color="#007bff" />
        </div>
        <h3 style={{ margin: '0', fontSize: '18px', color: '#007bff' }}>Add New Car</h3>
        <p style={{ fontSize: '14px', margin: '10px 0 0 0', textAlign: 'center', padding: '0 20px' }}>
          List your car on ZUVO and start earning
        </p>
      </div>
    </Link>
  );
};

export default AddCarButton; 