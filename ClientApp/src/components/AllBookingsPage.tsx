import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllBookings, deleteBooking } from '../store/bookingsSlice';
import { RootState, AppDispatch } from '../store';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Booking } from '../types';

const AllBookingsPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { bookings, loading, error } = useSelector(
    (state: RootState) => state.bookings
  );
  const { user } = useSelector((state: RootState) => state.auth);

  const [openDialog, setOpenDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleDeleteClick = (booking: Booking) => {
    setBookingToDelete(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setBookingToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (bookingToDelete) {
      dispatch(deleteBooking(bookingToDelete.id));
      handleCloseDialog();
    }
  };

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
              <ListItem
                key={booking.id}
                divider
                secondaryAction={
                  isAdmin && (
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(booking)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={booking.title}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        User ID: {booking.userId}, Room ID: {booking.roomId}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {new Date(booking.startDate).toLocaleString()} -{' '}
                        {new Date(booking.endDate).toLocaleString()}
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {booking.description}
                      </Typography>
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

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Deletion'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the booking &rdquo;
            {bookingToDelete?.title}&rdquo;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AllBookingsPage;
