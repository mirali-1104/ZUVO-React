import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Button, Container } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';

const VerificationError = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'expired':
        return 'Your verification link has expired. Please request a new verification email.';
      case 'invalid':
        return 'Invalid verification link. Please check the link or request a new verification email.';
      case 'server':
        return 'An error occurred during verification. Please try again later.';
      default:
        return 'An error occurred during verification.';
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
        <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Verification Failed
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          {getErrorMessage()}
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

export default VerificationError; 