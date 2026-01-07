import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../store/authSlice';
import { RootState, AppDispatch } from '../store';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Link as MuiLink,
} from '@mui/material';

const LoginPage: React.FC = () => {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login({ login: loginValue, password })).unwrap();
    navigate(from, { replace: true });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '4rem' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Sign In
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
            id="login"
            label="Login"
            name="login"
            autoComplete="login"
            autoFocus
            value={loginValue}
            onChange={(e) => setLoginValue(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            style={{ margin: '1rem 0' }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Dont have an account?
            <MuiLink component={Link} to="/register">
              Sign up
            </MuiLink>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
