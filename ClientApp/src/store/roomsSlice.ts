import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Room } from '../types';

interface RoomsState {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoomsState = {
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
};

// Async thunk for fetching all rooms
export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/rooms');
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch rooms');
      }
      const roomsData = await response.json();
      return roomsData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching a single room
export const fetchRoom = createAsyncThunk(
 'rooms/fetchRoom',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/rooms/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to fetch room');
      }
      const roomData = await response.json();
      return roomData;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for creating a room (admin only)
export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData: Omit<Room, 'id'>, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to create room');
      }
      const createdRoom = await response.json();
      return createdRoom;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for updating a room (admin only)
export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, roomData }: { id: number; roomData: Room }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to update room');
      }
      const updatedRoom = await response.json();
      return updatedRoom;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for deleting a room (admin only)
export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.message || 'Failed to delete room');
      }
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    selectRoom: (state, action: PayloadAction<number>) => {
      state.selectedRoom = state.rooms.find(room => room.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rooms cases
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action: PayloadAction<Room[]>) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch room cases
      .addCase(fetchRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Create room cases
      .addCase(createRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update room cases
      .addCase(updateRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        const index = state.rooms.findIndex(room => room.id === action.payload.id);
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
        state.selectedRoom = action.payload;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete room cases
      .addCase(deleteRoom.fulfilled, (state, action: PayloadAction<number>) => {
        state.rooms = state.rooms.filter(room => room.id !== action.payload);
        if (state.selectedRoom && state.selectedRoom.id === action.payload) {
          state.selectedRoom = null;
        }
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError, selectRoom } = roomsSlice.actions;
export default roomsSlice.reducer;