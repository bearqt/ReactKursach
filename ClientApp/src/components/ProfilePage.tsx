import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Container,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          User Profile
        </Typography>

        {user ? (
          <Box>
            <List>
              <ListItem>
                <ListItemText primary="ID" secondary={user.id} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Login" secondary={user.login} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Name" secondary={user.name} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Role" secondary={user.role} />
              </ListItem>
            </List>
          </Box>
        ) : (
          <Typography variant="h6" color="error">
            User not found
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default ProfilePage;
