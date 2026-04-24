import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getRecommendations } from "../api/recommendationApi";

export const fetchRecommendations = createAsyncThunk(
  "recommendations/fetchRecommendations",
  async (mode = null, { rejectWithValue }) => {
    try {
      return await getRecommendations(mode);
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to fetch recommendations",
      );
    }
  },
);

const recommendationSlice = createSlice({
  name: "recommendations",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    activeMode: "",
  },
  reducers: {
    setActiveMode(state, action) {
      state.activeMode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.recommendations;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setActiveMode } = recommendationSlice.actions;

export const selectRecommendations = (state) => state.recommendations.items;
export const selectRecommendationsStatus = (state) =>
  state.recommendations.status;
export const selectRecommendationsError = (state) =>
  state.recommendations.error;
export const selectActiveMode = (state) => state.recommendations.activeMode;

export default recommendationSlice.reducer;
