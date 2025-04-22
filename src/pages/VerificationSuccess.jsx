import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from "axios";

const VerificationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // You can now upload this file to your server
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Email Verified Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Your email has been verified. You can now log in to your account.
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          You will be redirected to the login page in 5 seconds...
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
};

export default VerificationSuccess; 