import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const VerificationSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

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