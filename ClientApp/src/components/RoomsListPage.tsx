import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRooms } from '../store/roomsSlice';
import { RootState, AppDispatch } from '../store';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
} from '@mui/material';

const RoomsListPage: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { rooms, loading, error } = useSelector(
    (state: RootState) => state.rooms
  );

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" style={{ marginTop: '2rem' }}>
      <Typography variant="h4" gutterBottom>
        Available Meeting Rooms
      </Typography>

      {error && (
        <Alert severity="error" style={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Typography>Loading rooms...</Typography>
      ) : (
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.id}>
              <Paper elevation={3}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {room.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Location:</strong> {room.location}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Capacity:</strong> {room.capacity} people
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Description:</strong> {room.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Amenities:</strong> {room.amenities.join(', ')}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      component={Link}
                      to={`/rooms/${room.id}`}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default RoomsListPage;
