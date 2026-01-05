import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserBookings } from '../store/bookingsSlice';
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

const UserBookingsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { userBookings, loading, error } = useSelector((state: RootState) => state.bookings);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings(user.id) as any);
    }
  }, [dispatch, user]);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          My Active Bookings
        </Typography>
        
        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Typography>Loading bookings...</Typography>
        ) : userBookings.length > 0 ? (
          <List>
            {userBookings.map((booking) => (
              <ListItem key={booking.id} divider>
                <ListItemText
                  primary={booking.title}
                  secondary={
                    <>
                      <div>Room ID: {booking.roomId}</div>
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
          <Typography>No active bookings found.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default UserBookingsPage;