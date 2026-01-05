import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRoom } from '../store/roomsSlice';
import { 
 Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  OutlinedInput
} from '@mui/material';

const CreateRoomPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 1,
    description: '',
    isAvailable: true, // Add default value
    amenities: [] as string[],
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Available amenities options
 const amenitiesOptions = [
    'Projector',
    'Whiteboard',
    'Video Conference',
    'Air Conditioning',
    'Coffee Machine',
    'Sound System',
    'Wi-Fi'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 };

  const handleAmenitiesChange = (e: any) => {
    const {
      target: { value },
    } = e;
    setFormData(prev => ({
      ...prev,
      amenities: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await dispatch(createRoom(formData) as any).unwrap();
      navigate('/rooms');
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Create New Meeting Room
        </Typography>
        
        {error && (
          <Alert severity="error" style={{ marginBottom: '1rem' }}>
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="name"
            label="Room Name"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem' }}
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="location"
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem' }}
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="capacity"
            label="Capacity"
            name="capacity"
            type="number"
            value={formData.capacity}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem' }}
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="description"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            style={{ marginBottom: '1rem' }}
          />
          
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <InputLabel id="amenities-label">Amenities</InputLabel>
            <Select
              labelId="amenities-label"
              id="amenities"
              name="amenities"
              multiple
              value={formData.amenities}
              onChange={handleAmenitiesChange}
              input={<OutlinedInput label="Amenities" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as string[]).map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {amenitiesOptions.map((amenity) => (
                <MenuItem key={amenity} value={amenity}>
                  {amenity}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={() => navigate('/rooms')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Room'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
 );
};

export default CreateRoomPage;