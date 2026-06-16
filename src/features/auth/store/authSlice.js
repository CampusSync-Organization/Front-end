import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, register, googleLogin } from "../api/authApi.js"; // your existing api file

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await login({ email, password });
    } catch (err) {
      return rejectWithValue("Email or password incorrect");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, name, password }, { rejectWithValue }) => {
    try {
      return await register({ email, name, password });
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Registration failed",
      );
    }
  },
);

export const googleLoginUser = createAsyncThunk(
  "auth/googleLoginUser",
  async (credentialResponse, { rejectWithValue }) => {
    try {
      return await googleLogin(credentialResponse);
    } catch (err) {
      const detail = err.response?.data?.detail;
      let message = "Google login failed";

      if (Array.isArray(detail)) {
        message = detail.map((d) => d.msg || d).join(", ");
      } else if (typeof detail === "string") {
        message = detail;
      } else if (detail && typeof detail === "object" && detail.msg) {
        message = detail.msg;
      }

      return rejectWithValue(message);
    }
  },
);

// ─── Initial State ─────────────────────────────────────────────────────────────
let initialState = { user: null, token: null, loading: false, error: null };
if (typeof window !== "undefined") {
  try {
    const storedUser = localStorage.getItem("campussync_user");
    const storedToken = localStorage.getItem("campussync_token");
    if (storedUser) initialState.user = JSON.parse(storedUser);
    if (storedToken) initialState.token = storedToken;
  } catch {
    localStorage.removeItem("campussync_user");
    localStorage.removeItem("campussync_token");
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

// called on every fulfilled action to avoid repeating the same logic 3 times
function handleFulfilled(state, action) {
  state.loading = false;
  state.error = null;

  // Extract user and token separately
  const token = action.payload.token || action.payload.access_token;
  const user = action.payload.user;

  state.user = user; // Only store the user object
  if (token) {
    state.token = token; // Store token separately
  }

  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("campussync_user", JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem("campussync_token", token);
    }
  }
}
// ─── Slice ─────────────────────────────────────────────────────────────────────

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
    setToken(state, action) {
      state.token = action.payload;
      if (typeof window !== "undefined" && action.payload) {
        localStorage.setItem("campussync_token", action.payload);
      }
    },
    clearUser(state) {
      state.user = null;
      state.error = null;
      state.token = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("campussync_user");
        localStorage.removeItem("campussync_token");
      }
    },
  },
  extraReducers: (builder) => {
    const thunks = [loginUser, registerUser, googleLoginUser];

    thunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, handleFulfilled)
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });
  },
});

export const { setUser, setToken, clearUser } = authSlice.actions;
export default authSlice.reducer;
