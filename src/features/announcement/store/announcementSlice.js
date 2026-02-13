import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { announcementService } from "../service/announcementService";

export const fetchAnnouncements = createAsyncThunk(
  "announcements/fetchAnnouncements",
  async () => {
    const response = await announcementService.fetchannouncement();
    return response;
  },
);

export const fetchByCategory = createAsyncThunk(
  "announcements/fetchByCategory",
  async (category) => {
    const response = await announcementService.fetchByCategory({ category });
    return response;
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
      .addCase(fetchByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectAllAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementStatus = (state) => state.announcements.status;
export const selectAnnouncementError = (state) => state.announcements.error;

export default announcementSlice.reducer;
