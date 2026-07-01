import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  acceptConnection as acceptConnectionApi,
  createConnection as createConnectionApi,
  getConnections as getConnectionsApi,
  getPendingConnectionRequests as getPendingConnectionRequestsApi,
} from "../api/connectionsApi";
import { getProfileByUserId } from "../../../features/profile/api/profileApi";

const getErrorMessage = (err, fallback) =>
  err.response?.data?.error ||
  err.response?.data?.detail ||
  err.message ||
  fallback;

const getFallbackProfile = (id) => ({
  user_id: id,
  name: `Student ${id}`,
  cgpa: 0,
  tags: [],
  bio: "Profile unavailable",
  avatar_url: null,
});

const hydrateProfiles = async (ids) =>
  Promise.all(
    ids.map(async (id) => {
      try {
        return await getProfileByUserId(id);
      } catch (profileErr) {
        return getFallbackProfile(id);
      }
    })
  );

export const fetchConnections = createAsyncThunk(
  "connections/fetchConnections",
  async (_userId, { rejectWithValue }) => {
    try {
      const response = await getConnectionsApi();
      return response.connected_user_ids || [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch connections"));
    }
  }
);

export const fetchConnectionsWithHydration = createAsyncThunk(
  "connections/fetchConnectionsWithHydration",
  async (_userId, { rejectWithValue }) => {
    try {
      const response = await getConnectionsApi();
      const ids = response.connected_user_ids || [];
      const profiles = await hydrateProfiles(ids);
      return { ids, profiles };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch connections"));
    }
  }
);

export const fetchPendingConnectionRequests = createAsyncThunk(
  "connections/fetchPendingConnectionRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingConnectionRequestsApi();
      return response.pending_requester_ids || [];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch pending requests"));
    }
  }
);

export const fetchPendingConnectionRequestsWithHydration = createAsyncThunk(
  "connections/fetchPendingConnectionRequestsWithHydration",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPendingConnectionRequestsApi();
      const ids = response.pending_requester_ids || [];
      const profiles = await hydrateProfiles(ids);
      return { ids, profiles };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to fetch pending requests"));
    }
  }
);

export const addConnection = createAsyncThunk(
  "connections/addConnection",
  async (connectedUserId, { rejectWithValue }) => {
    try {
      const response = await createConnectionApi(connectedUserId);
      return response;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to create connection"));
    }
  }
);

export const acceptConnectionRequest = createAsyncThunk(
  "connections/acceptConnectionRequest",
  async (requesterId, { rejectWithValue }) => {
    try {
      return await acceptConnectionApi(requesterId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, "Failed to accept connection request"));
    }
  }
);

const initialState = {
  connectedUserIds: [],
  hydratedConnections: [],
  pendingRequesterIds: [],
  hydratedPendingRequesters: [],
  declinedRequesterIds: [],
  sentRequestUserIds: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  pendingStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  pendingError: null,
  createStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  createError: null,
  acceptStatus: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  acceptError: null,
};

const connectionsSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    clearConnectionErrors(state) {
      state.error = null;
      state.pendingError = null;
      state.createError = null;
      state.acceptError = null;
    },
    resetConnectionsState(state) {
      state.connectedUserIds = [];
      state.hydratedConnections = [];
      state.pendingRequesterIds = [];
      state.hydratedPendingRequesters = [];
      state.declinedRequesterIds = [];
      state.sentRequestUserIds = [];
      state.status = "idle";
      state.error = null;
      state.pendingStatus = "idle";
      state.pendingError = null;
      state.createStatus = "idle";
      state.createError = null;
      state.acceptStatus = "idle";
      state.acceptError = null;
    },
    dismissPendingConnectionRequest(state, action) {
      const requesterId = action.payload;
      if (!state.declinedRequesterIds.includes(requesterId)) {
        state.declinedRequesterIds.push(requesterId);
      }
      state.pendingRequesterIds = state.pendingRequesterIds.filter(
        (id) => id !== requesterId
      );
      state.hydratedPendingRequesters = state.hydratedPendingRequesters.filter(
        (profile) => profile.user_id !== requesterId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConnections
      .addCase(fetchConnections.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connectedUserIds = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchConnectionsWithHydration
      .addCase(fetchConnectionsWithHydration.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchConnectionsWithHydration.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.connectedUserIds = action.payload.ids;
        state.hydratedConnections = action.payload.profiles;
      })
      .addCase(fetchConnectionsWithHydration.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // fetchPendingConnectionRequests
      .addCase(fetchPendingConnectionRequests.pending, (state) => {
        state.pendingStatus = "loading";
        state.pendingError = null;
      })
      .addCase(fetchPendingConnectionRequests.fulfilled, (state, action) => {
        state.pendingStatus = "succeeded";
        state.pendingRequesterIds = action.payload.filter(
          (id) => !state.declinedRequesterIds.includes(id)
        );
      })
      .addCase(fetchPendingConnectionRequests.rejected, (state, action) => {
        state.pendingStatus = "failed";
        state.pendingError = action.payload;
      })

      // fetchPendingConnectionRequestsWithHydration
      .addCase(fetchPendingConnectionRequestsWithHydration.pending, (state) => {
        state.pendingStatus = "loading";
        state.pendingError = null;
      })
      .addCase(fetchPendingConnectionRequestsWithHydration.fulfilled, (state, action) => {
        state.pendingStatus = "succeeded";
        state.pendingRequesterIds = action.payload.ids.filter(
          (id) => !state.declinedRequesterIds.includes(id)
        );
        state.hydratedPendingRequesters = action.payload.profiles.filter(
          (profile) => !state.declinedRequesterIds.includes(profile.user_id)
        );
      })
      .addCase(fetchPendingConnectionRequestsWithHydration.rejected, (state, action) => {
        state.pendingStatus = "failed";
        state.pendingError = action.payload;
      })

      // addConnection
      .addCase(addConnection.pending, (state) => {
        state.createStatus = "loading";
        state.createError = null;
      })
      .addCase(addConnection.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        // Sending a request creates a pending connection, not an accepted one.
        const newId = action.payload.connected_user_id;
        if (newId && !state.sentRequestUserIds.includes(newId)) {
          state.sentRequestUserIds.push(newId);
        }
      })
      .addCase(addConnection.rejected, (state, action) => {
        state.createStatus = "failed";
        state.createError = action.payload;
      })

      // acceptConnectionRequest
      .addCase(acceptConnectionRequest.pending, (state) => {
        state.acceptStatus = "loading";
        state.acceptError = null;
      })
      .addCase(acceptConnectionRequest.fulfilled, (state, action) => {
        state.acceptStatus = "succeeded";
        const requesterId = action.payload.user_id || action.meta.arg;
        const acceptedProfile = state.hydratedPendingRequesters.find(
          (profile) => profile.user_id === requesterId
        );
        state.pendingRequesterIds = state.pendingRequesterIds.filter(
          (id) => id !== requesterId
        );
        state.hydratedPendingRequesters = state.hydratedPendingRequesters.filter(
          (profile) => profile.user_id !== requesterId
        );
        state.declinedRequesterIds = state.declinedRequesterIds.filter(
          (id) => id !== requesterId
        );
        if (requesterId && !state.connectedUserIds.includes(requesterId)) {
          state.connectedUserIds.push(requesterId);
        }
        if (
          acceptedProfile &&
          !state.hydratedConnections.some((profile) => profile.user_id === requesterId)
        ) {
          state.hydratedConnections.push(acceptedProfile);
        }
      })
      .addCase(acceptConnectionRequest.rejected, (state, action) => {
        state.acceptStatus = "failed";
        state.acceptError = action.payload;
      });
  },
});

export const {
  clearConnectionErrors,
  dismissPendingConnectionRequest,
  resetConnectionsState,
} = connectionsSlice.actions;

export const selectConnectedUserIds = (state) => state.connections.connectedUserIds;
export const selectHydratedConnections = (state) => state.connections.hydratedConnections;
export const selectPendingRequesterIds = (state) => state.connections.pendingRequesterIds;
export const selectHydratedPendingRequesters = (state) =>
  state.connections.hydratedPendingRequesters;
export const selectDeclinedRequesterIds = (state) => state.connections.declinedRequesterIds;
export const selectSentRequestUserIds = (state) => state.connections.sentRequestUserIds;
export const selectConnectionsStatus = (state) => state.connections.status;
export const selectConnectionsError = (state) => state.connections.error;
export const selectPendingConnectionsStatus = (state) => state.connections.pendingStatus;
export const selectPendingConnectionsError = (state) => state.connections.pendingError;
export const selectConnectionsCreateStatus = (state) => state.connections.createStatus;
export const selectConnectionsCreateError = (state) => state.connections.createError;
export const selectConnectionsAcceptStatus = (state) => state.connections.acceptStatus;
export const selectConnectionsAcceptError = (state) => state.connections.acceptError;

export default connectionsSlice.reducer;
