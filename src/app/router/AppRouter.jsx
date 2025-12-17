import { createBrowserRouter } from "react-router-dom";
import DashboardPage from "../../features/dashboard/pages/DashboardPage";
import LoginPage from "../../features/auth/pages/LoginPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import UserProfilePage from "../../features/profile/pages/UserProfilePage";

export const router = createBrowserRouter([
  { path: "/", element: <DashboardPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <div>Signup</div> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile-view", element: <UserProfilePage /> },
]);
