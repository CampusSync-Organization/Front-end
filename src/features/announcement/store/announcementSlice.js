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
export const fetchMyAnnouncements = createAsyncThunk(
  "announcements/fetchMyAnnouncements",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await announcementApi.getMyAnnouncements(filters);
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
    myItems: [], // ← add this
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    myStatus: "idle", // ← add this
    error: null,
  },
  reducers: {
    // Silent background refresh — replaces items without touching status/loading state
    silentRefreshAnnouncements: (state, action) => {
      state.items = action.payload;
    },
    silentRefreshMyAnnouncements: (state, action) => {
      state.myItems = action.payload;
    },
  },
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
        state.myItems.unshift(action.payload);
      })
      .addCase(updateAnnouncement.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        const myIndex = state.myItems.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (myIndex !== -1) {
          state.myItems[myIndex] = action.payload;
        }
      })

      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.myItems = state.myItems.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(fetchMyAnnouncements.pending, (state) => {
        state.myStatus = "loading";
      })
      .addCase(fetchMyAnnouncements.fulfilled, (state, action) => {
        state.myStatus = "succeeded";
        state.myItems = action.payload;
      })
      .addCase(fetchMyAnnouncements.rejected, (state, action) => {
        state.myStatus = "failed";
        state.error = action.error.message;
      });
  },
});

export const { silentRefreshAnnouncements, silentRefreshMyAnnouncements } = announcementSlice.actions;
export const selectAllAnnouncements = (state) => state.announcements.items;
export const selectAnnouncementStatus = (state) => state.announcements.status;
export const selectAnnouncementError = (state) => state.announcements.error;
export const selectMyAnnouncements = (state) => state.announcements.myItems;
export const selectMyAnnouncementStatus = (state) =>
  state.announcements.myStatus;
export default announcementSlice.reducer;
