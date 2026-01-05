import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchRoom, selectRoom } from '../store/roomsSlice';
import { createBooking } from '../store/bookingsSlice';
import { RootState } from '../store';
import {
  Container,
  Paper,
  Typography,
  Button,
  Grid,
 Box,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
 const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedRoom, loading, error } = useSelector((state: RootState) => state.rooms);
  const { user } = useSelector((state: RootState) => state.auth);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    title: '',
    description: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchRoom(Number(id)) as any);
    }
  }, [dispatch, id]);

  const handleBookRoom = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOpenBookingDialog(true);
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRoom || !user) return;
    
    const bookingToCreate = {
      roomId: selectedRoom.id,
      userId: user.id,
      startDate: bookingData.startDate,
      endDate: bookingData.endDate,
      title: bookingData.title,
      description: bookingData.description,
      createdAt: new Date().toISOString(), // Add required field
      isActive: true // Add required field
    };
    
    try {
      await dispatch(createBooking(bookingToCreate) as any).unwrap();
      setOpenBookingDialog(false);
      setBookingData({
        startDate: '',
        endDate: '',
        title: '',
        description: ''
      });
      alert('Room booked successfully!');
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
 };

  if (loading) {
    return <div>Loading room details...</div>;
  }

  if (error) {
    return (
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!selectedRoom) {
    return (
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Alert severity="error">Room not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          {selectedRoom.name}
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Details
            </Typography>
            <Typography><strong>Location:</strong> {selectedRoom.location}</Typography>
            <Typography><strong>Capacity:</strong> {selectedRoom.capacity} people</Typography>
            <Typography><strong>Description:</strong> {selectedRoom.description}</Typography>
            
            <Typography variant="h6" style={{ marginTop: '1rem' }} gutterBottom>
              Amenities
            </Typography>
            <ul>
              {selectedRoom.amenities.map((amenity, index) => (
                <li key={index}>{amenity}</li>
              ))}
            </ul>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                onClick={handleBookRoom}
                disabled={!selectedRoom.isAvailable}
              >
                {selectedRoom.isAvailable ? 'Book Room' : 'Not Available'}
              </Button>
              
              {!selectedRoom.isAvailable && (
                <Typography variant="body2" color="error" style={{ marginTop: '0.5rem' }}>
                  This room is currently not available
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Booking Dialog */}
      <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)}>
        <DialogTitle>Book Room: {selectedRoom.name}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleBookingSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Booking Title"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingData.title}
              onChange={handleInputChange}
              required
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              type="text"
              fullWidth
              variant="outlined"
              value={bookingData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              style={{ marginBottom: '1rem' }}
            />
            <TextField
              margin="dense"
              name="startDate"
              label="Start Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={bookingData.startDate}
              onChange={handleInputChange}
              required
              style={{ marginBottom: '1rem' }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              name="endDate"
              label="End Date"
              type="datetime-local"
              fullWidth
              variant="outlined"
              value={bookingData.endDate}
              onChange={handleInputChange}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBookingDialog(false)}>Cancel</Button>
          <Button onClick={handleBookingSubmit} variant="contained" color="primary">
            Book Room
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoomDetailPage;
