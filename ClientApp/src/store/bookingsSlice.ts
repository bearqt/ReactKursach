import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
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

export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAllBookings',
  async () => {
    const response = await axios.get('/api/bookings');
    return response.data;
  }
);

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId: number) => {
    const response = await axios.get(`/api/bookings/user/${userId}`);
    return response.data;
  }
);

export const fetchRoomBookings = createAsyncThunk(
  'bookings/fetchRoomBookings',
  async (roomId: number) => {
    const response = await axios.get(`/api/bookings/room/${roomId}`);
    return response.data;
  }
);

export const fetchBooking = createAsyncThunk(
  'bookings/fetchBooking',
  async (id: number) => {
    const response = await axios.get(`/api/bookings/${id}`);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData: Omit<Booking, 'id'>) => {
    const response = await axios.post('/api/bookings', bookingData);
    return response.data;
  }
);

export const updateBooking = createAsyncThunk(
  'bookings/updateBooking',
  async ({ id, bookingData }: { id: number; bookingData: Booking }) => {
    const response = await axios.put(`/api/bookings/${id}`, bookingData);
    return response.data;
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/deleteBooking',
  async (id: number) => {
    await axios.delete(`/api/bookings/${id}`);
    return id;
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
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.loading = false;
          state.bookings = action.payload;
        }
      )
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchUserBookings.fulfilled,
        (state, action: PayloadAction<Booking[]>) => {
          state.userBookings = action.payload;
        }
      )
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchRoomBookings.fulfilled, () => {})
      .addCase(fetchRoomBookings.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(fetchBooking.fulfilled, () => {})
      .addCase(fetchBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        createBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          state.bookings.push(action.payload);
          state.userBookings.push(action.payload);
        }
      )
      .addCase(createBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        updateBooking.fulfilled,
        (state, action: PayloadAction<Booking>) => {
          const index = state.bookings.findIndex(
            (booking) => booking.id === action.payload.id
          );
          if (index !== -1) {
            state.bookings[index] = action.payload;
          }
          const userIndex = state.userBookings.findIndex(
            (booking) => booking.id === action.payload.id
          );
          if (userIndex !== -1) {
            state.userBookings[userIndex] = action.payload;
          }
        }
      )
      .addCase(updateBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(
        deleteBooking.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.bookings = state.bookings.filter(
            (booking) => booking.id !== action.payload
          );
          state.userBookings = state.userBookings.filter(
            (booking) => booking.id !== action.payload
          );
        }
      )
      .addCase(deleteBooking.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bookingsSlice.actions;
export default bookingsSlice.reducer;
