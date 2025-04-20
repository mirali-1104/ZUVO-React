import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadScript } from '@razorpay/checkout';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please login to view your profile');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        const errorMessage = error.response?.data?.message || 
                           error.message || 
                           'Failed to load profile. Please try again.';
        setError(errorMessage);
        alert(errorMessage);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError('No file selected');
      alert('No file selected');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, or GIF)');
      alert('Please select an image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      alert('Image size should be less than 2MB');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      const token = localStorage.getItem('token');

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload image
      const response = await axios.post(
        'http://localhost:5000/api/users/profile/picture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (!response.data || !response.data.profileImage) {
        throw new Error('No response data received');
      }

      // Update only the profileImage in user state
      setUser(prevUser => ({
        ...prevUser,
        profileImage: response.data.profileImage
      }));
      
      alert('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to upload image. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUser(response.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLink = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      
      // Create order
      const orderResponse = await axios.post(
        'http://localhost:5000/api/payment/create-order',
        {
          amount: 100, // Amount in rupees
          currency: 'INR'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const order = orderResponse.data;

      // Load Razorpay script
      const script = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ZUVO',
        description: 'Wallet Linking',
        order_id: order.id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyResponse = await axios.post(
              'http://localhost:5000/api/payment/verify',
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`
                }
              }
            );

            if (verifyResponse.data.success) {
              setUser(verifyResponse.data.user);
              alert('Wallet linked successfully!');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               'Error verifying payment. Please try again.';
            setError(errorMessage);
            alert(errorMessage);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#3399cc'
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Error initiating payment:', error);
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error initiating payment. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <h1>Profile</h1>
      <div className="profile-info">
        <div className="profile-image-container">
          <img 
            src={user.profileImage || '/default-profile.png'} 
            alt="Profile" 
            className="profile-image"
          />
          <label className="upload-button">
            {uploading ? 'Uploading...' : 'Change Image'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
        </div>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Wallet Status: {user.walletLinked ? 'Linked' : 'Not Linked'}</p>
        {user.walletId && <p>Wallet ID: {user.walletId}</p>}
      </div>
      
      {!user.walletLinked && (
        <button 
          onClick={handleWalletLink} 
          disabled={loading}
          className="link-wallet-btn"
        >
          {loading ? 'Processing...' : 'Link Wallet'}
        </button>
      )}
    </div>
  );
};

export default ProfilePage; 