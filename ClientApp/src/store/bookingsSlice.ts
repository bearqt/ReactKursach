import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '../types';

interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingsState = {
  bookings: [],
  userBookings: [],
  loading: false,
  error: null,
};

// Async thunk for fetching all bookings (admin only)
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/bookings');
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch bookings');
      }
      const bookingsData = await response.json();
      return bookingsData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
 }
);

// Async thunk for fetching user bookings
export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/user/${userId}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch user bookings');
      }
      const bookingsData = await response.json();
      return bookingsData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
 }
);

// Async thunk for fetching room bookings
export const fetchRoomBookings = createAsyncThunk(
  'bookings/fetchRoomBookings',
  async (roomId: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/room/${roomId}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch room bookings');
      }
      const bookingsData = await response.json();
      return bookingsData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
 }
);

// Async thunk for fetching a single booking
export const fetchBooking = createAsyncThunk(
 'bookings/fetchBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch booking');
      }
      const bookingData = await response.json();
      return bookingData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for creating a booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create booking');
      }
      const createdBooking = await response.json();
      return createdBooking;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
 }
);

// Async thunk for updating a booking
export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }: { id: number; bookingData: Booking }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update booking');
      }
      const updatedBooking = await response.json();
      return updatedBooking;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting a booking
export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete booking');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
 }
);

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings cases
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user bookings cases
      .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch room bookings cases
      .addCase(fetchRoomBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        // We don't store room bookings separately in state for now
        // But we could if needed for specific UI purposes
      })
      .addCase(fetchRoomBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch booking cases
      .addCase(fetchBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        // We don't store single booking in state, but could if needed
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create booking cases
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.bookings.push(action.payload);
        state.userBookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update booking cases
      .addCase(updateBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        const index = state.bookings.findIndex(booking => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        const userIndex = state.userBookings.findIndex(booking => booking.id === action.payload.id);
        if (userIndex !== -1) {
          state.userBookings[userIndex] = action.payload;
        }
      })
      .addCase(updateBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete booking cases
      .addCase(deleteBooking.fulfilled, (state, action: PayloadAction<number>) => {
        state.bookings = state.bookings.filter(booking => booking.id !== action.payload);
        state.userBookings = state.userBookings.filter(booking => booking.id !== action.payload);
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;