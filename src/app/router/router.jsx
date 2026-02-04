import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout";
import Landing from "../../features/pages/Landing";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import AssessmentPage from "../../features/assessment/pages/AssessmentPage";
import HomePage from "../../features/home/pages/HomePage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import UserProfilePage from "../../features/profile/pages/UserProfilePage";
import ChatMainPage from "../../features/chat/pages/ChatMainPage";
import EventsAndCommunitiesLayoutPage from "../../features/events-communities/pages/EventsAndCommunitiesLayoutPage";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/assessment", element: <AssessmentPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/events-communities", element: <EventsAndCommunitiesLayoutPage /> },
      { path: "/Profile-Page", element: <ProfilePage /> },
      { path: "/User-profile", element: <UserProfilePage /> },
      { path: "/Chat-Main-Page", element: <ChatMainPage /> },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
