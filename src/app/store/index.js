import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/store/authSlice";
import profileReducer from "../../features/profile/store/profileSlice";
import dashboardReducer from "../../features/dashboard/store/dashboardSlice";
import announcementReducer from "../../features/announcement/store/announcementSlice";
import recommendationReducer from "../../features/recommendation/store/recommendationSlice";
import connectionsReducer from "../../services/connections/store/connectionsSlice";

const appReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  dashboard: dashboardReducer,
  announcements: announcementReducer,
  recommendations: recommendationReducer,
  connections: connectionsReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "auth/clearUser") {
    // Reset all state to undefined, which forces reducers to use their initial state
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});
