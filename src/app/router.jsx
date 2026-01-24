import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import LoginPage from "../features/auth/pages/LoginPage";
import SignUpPage from "../features/auth/pages/SignUpPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import UserProfilePage from "../features/profile/pages/UserProfilePage";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/profile", element: <ProfilePage /> },
  { path: "/profile-view", element: <UserProfilePage /> },
]);
