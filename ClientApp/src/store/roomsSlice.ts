import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
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

export const fetchRooms = createAsyncThunk('rooms/fetchRooms', async () => {
  const response = await axios.get('/api/rooms');
  return response.data;
});

export const fetchRoom = createAsyncThunk(
  'rooms/fetchRoom',
  async (id: number) => {
    const response = await axios.get(`/api/rooms/${id}`);
    return response.data;
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (roomData: Omit<Room, 'id'>) => {
    const response = await axios.post('/api/rooms', roomData);
    return response.data;
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, roomData }: { id: number; roomData: Room }) => {
    const response = await axios.put(`/api/rooms/${id}`, roomData);
    return response.data;
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: number) => {
    await axios.delete(`/api/rooms/${id}`);
    return id;
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
      state.selectedRoom =
        state.rooms.find((room) => room.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.selectedRoom = action.payload;
      })
      .addCase(fetchRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        state.rooms.push(action.payload);
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateRoom.fulfilled, (state, action: PayloadAction<Room>) => {
        const index = state.rooms.findIndex(
          (room) => room.id === action.payload.id
        );
        if (index !== -1) {
          state.rooms[index] = action.payload;
        }
        state.selectedRoom = action.payload;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteRoom.fulfilled, (state, action: PayloadAction<number>) => {
        state.rooms = state.rooms.filter((room) => room.id !== action.payload);
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
