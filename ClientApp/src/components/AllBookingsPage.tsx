import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings } from '../store/bookingsSlice';
import { RootState } from '../store';
import { 
  Container, 
  Paper, 
 Typography, 
  List, 
  ListItem, 
  ListItemText,
  Box,
  Alert
} from '@mui/material';

const AllBookingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { bookings, loading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    dispatch(fetchAllBookings() as any);
  }, [dispatch]);

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          All Bookings (Admin)
        </Typography>
        
        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Typography>Loading bookings...</Typography>
        ) : bookings.length > 0 ? (
          <List>
            {bookings.map((booking) => (
              <ListItem key={booking.id} divider>
                <ListItemText
                  primary={booking.title}
                  secondary={
                    <>
                      <div>User ID: {booking.userId}, Room ID: {booking.roomId}</div>
                      <div>
                        {new Date(booking.startDate).toLocaleString()} - {new Date(booking.endDate).toLocaleString()}
                      </div>
                      <div>{booking.description}</div>
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No bookings found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default AllBookingsPage;