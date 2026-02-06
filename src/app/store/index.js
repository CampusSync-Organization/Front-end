import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/store/authSlice";
import profileReducer from "../../features/profile/store/profileSlice";
import dashboardReducer from "../../features/dashboard/store/dashboardSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    dashboard: dashboardReducer,
  },
});
