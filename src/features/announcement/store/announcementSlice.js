import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { announcementApi } from "../api/announcementApi";

export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getGlobalFeed(filters);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const createAnnouncement = createAsyncThunk(
  "announcements/createAnnouncement",
  async (data, { rejectWithValue }) => {
    try {
      const response = await announcementApi.createAnnouncement(data);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const updateAnnouncement = createAsyncThunk(
  "announcements/updateAnnouncement",
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const response = await announcementApi.updateAnnouncement(id, updates);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

export const deleteAnnouncement = createAsyncThunk(
  "announcements/deleteAnnouncement",
  async (id, { rejectWithValue }) => {
    try {
      await announcementApi.deleteAnnouncement(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  },
);

const announcementSlice = createSlice({
  name: "announcements",
  initialState: {
    items: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnouncements.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectAllAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementStatus = (state) => state.announcements.status;
export const selectAnnouncementError = (state) => state.announcements.error;

export default announcementSlice.reducer;
