import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState, AppDispatch } from './store';
import { fetchCurrentUser } from './store/authSlice';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProfilePage from './components/ProfilePage';
import UserBookingsPage from './components/UserBookingsPage';
import RoomsListPage from './components/RoomsListPage';
import RoomDetailPage from './components/RoomDetailPage';
import NotFoundPage from './components/NotFoundPage';
import CreateRoomPage from './components/CreateRoomPage';
import AllBookingsPage from './components/AllBookingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e57373',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

const AppContent = () => {
  const dispatch: AppDispatch = useDispatch();
  const { loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <UserBookingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/rooms" element={<RoomsListPage />} />
      <Route path="/rooms/:id" element={<RoomDetailPage />} />
      <Route path="/not-found" element={<NotFoundPage />} />
      <Route
        path="/create-room"
        element={
          <AdminRoute>
            <CreateRoomPage />
          </AdminRoute>
        }
      />
      <Route
        path="/all-bookings"
        element={
          <AdminRoute>
            <AllBookingsPage />
          </AdminRoute>
        }
      />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
