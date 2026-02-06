import { createSlice } from "@reduxjs/toolkit";

let initialState = { user: null };
if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem("campussync_user");
    if (stored) initialState.user = JSON.parse(stored);
  } catch {
    localStorage.removeItem("campussync_user");
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("campussync_user", JSON.stringify(action.payload));
      }
    },
    clearUser(state) {
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("campussync_user");
      }
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
