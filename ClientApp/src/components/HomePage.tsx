import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { 
  Container, 
  Typography, 
  Button, 
  Box,
  Grid,
  Paper
} from '@mui/material';

const HomePage: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} style={{ padding: '2rem', textAlign: 'center' }}>
            <Typography variant="h3" gutterBottom>
              Meeting Room Booking System
            </Typography>
            <Typography variant="h6" color="textSecondary" paragraph>
              Book meeting rooms easily and efficiently
            </Typography>
            
            <Box mt={2}>
              {isAuthenticated ? (
                <>
                  <Typography variant="h6">Welcome, {user?.name}!</Typography>
                  <Box mt={2}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      style={{ margin: '0.5rem' }}
                      component={Link} 
                      to="/rooms"
                    >
                      Browse Rooms
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large" 
                      style={{ margin: '0.5rem' }}
                      component={Link} 
                      to="/my-bookings"
                    >
                      My Bookings
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="secondary" 
                      size="large" 
                      style={{ margin: '0.5rem' }}
                      component={Link} 
                      to="/profile"
                    >
                      Profile
                    </Button>
                    {user?.role === 'Admin' && (
                      <>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          size="large" 
                          style={{ margin: '0.5rem' }}
                          component={Link} 
                          to="/create-room"
                        >
                          Create Room
                        </Button>
                        <Button 
                          variant="contained" 
                          color="secondary" 
                          size="large" 
                          style={{ margin: '0.5rem' }}
                          component={Link} 
                          to="/all-bookings"
                        >
                          All Bookings
                        </Button>
                      </>
                    )}
                  </Box>
                </>
              ) : (
                <>
                  <Typography variant="h6">Please sign in to access the system</Typography>
                  <Box mt={2}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="large" 
                      style={{ margin: '0.5rem' }}
                      component={Link} 
                      to="/login"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outlined" 
                      color="primary" 
                      size="large" 
                      style={{ margin: '0.5rem' }}
                      component={Link} 
                      to="/register"
                    >
                      Sign Up
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1.5rem', height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              For Users
            </Typography>
            <Typography variant="body1" paragraph>
              Browse available meeting rooms, check their amenities, and book a room for your next meeting.
            </Typography>
            <Typography variant="body1" paragraph>
              View your active bookings and manage your reservations.
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: '1.5rem', height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              For Administrators
            </Typography>
            <Typography variant="body1" paragraph>
              Create and manage meeting rooms, update their details and availability.
            </Typography>
            <Typography variant="body1" paragraph>
              View all bookings across the organization and manage reservations.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;