import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMyProfile,
  getProfileByUserId,
  updateMyProfile as updateMyProfileApi,
} from "../api/profileApi";

const getProfileError = (err, fallback) => {
  const detail = err.response?.data?.detail;

  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || item).join(", ");
  }

  if (typeof detail === "string") {
    return detail;
  }

  return err.response?.data?.error || err.message || fallback;
};

const isProfileNotFound = (err) =>
  err.response?.status === 404;

const buildInitialProfile = (user) => ({
  name: user?.name || user?.email?.split("@")[0] || "Student",
  cgpa: user?.cgpa ?? user?.gpa ?? 0,
  bio: null,
  avatar_url: null,
  projects: [],
  tags: [],
});

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, { getState, rejectWithValue }) => {
    try {
      return await getMyProfile();
    } catch (err) {
      if (isProfileNotFound(err)) {
        try {
          const authUser = getState().auth?.user;
          return await updateMyProfileApi(buildInitialProfile(authUser));
        } catch (createErr) {
          return rejectWithValue(
            getProfileError(createErr, "Failed to initialize profile"),
          );
        }
      }

      return rejectWithValue(getProfileError(err, "Profile not found"));
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  "profile/updateMyProfile",
  async (updates, { rejectWithValue }) => {
    try {
      return await updateMyProfileApi(updates);
    } catch (err) {
      return rejectWithValue(getProfileError(err, "Failed to update profile"));
    }
  },
);

export const fetchProfileByUserId = createAsyncThunk(
  "profile/fetchProfileByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      return await getProfileByUserId(userId);
    } catch (err) {
      return rejectWithValue(getProfileError(err, "Profile not found"));
    }
  },
);

const initialState = {
  me: null,
  viewedProfile: null,
  status: "idle",
  updateStatus: "idle",
  viewedStatus: "idle",
  error: null,
  updateError: null,
  viewedError: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
      state.updateError = null;
      state.viewedError = null;
    },
    resetViewedProfile(state) {
      state.viewedProfile = null;
      state.viewedStatus = "idle";
      state.viewedError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.me = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.updateStatus = "loading";
        state.updateError = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.updateStatus = "succeeded";
        state.me = action.payload;

        if (state.viewedProfile?.user_id === action.payload.user_id) {
          state.viewedProfile = action.payload;
        }
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.updateStatus = "failed";
        state.updateError = action.payload;
      })
      .addCase(fetchProfileByUserId.pending, (state) => {
        state.viewedStatus = "loading";
        state.viewedError = null;
      })
      .addCase(fetchProfileByUserId.fulfilled, (state, action) => {
        state.viewedStatus = "succeeded";
        state.viewedProfile = action.payload;
      })
      .addCase(fetchProfileByUserId.rejected, (state, action) => {
        state.viewedStatus = "failed";
        state.viewedError = action.payload;
      });
  },
});

export const { clearProfileError, resetViewedProfile } = profileSlice.actions;

export const selectMyProfile = (state) => state.profile.me;
export const selectViewedProfile = (state) => state.profile.viewedProfile;
export const selectProfileStatus = (state) => state.profile.status;
export const selectProfileUpdateStatus = (state) => state.profile.updateStatus;
export const selectViewedProfileStatus = (state) => state.profile.viewedStatus;
export const selectProfileError = (state) => state.profile.error;
export const selectProfileUpdateError = (state) => state.profile.updateError;
export const selectViewedProfileError = (state) => state.profile.viewedError;

export default profileSlice.reducer;
