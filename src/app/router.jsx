import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import AuthPage from "../features/auth/pages/AuthPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import UserProfilePage from "../features/profile/pages/UserProfilePage";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/signup", element: <AuthPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile-view", element: <UserProfilePage /> },
]);
