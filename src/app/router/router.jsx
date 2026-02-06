import { createBrowserRouter, Navigate } from "react-router-dom";
import AppLayout from "../../components/AppLayout.jsx";
import AuthGuard from "../../components/AuthGuard.jsx";
import Landing from "../../features/pages/Landing.jsx";
import LoginPage from "../../features/auth/pages/LoginPage.jsx";
import SignUpPage from "../../features/auth/pages/SignUpPage.jsx";
import AssessmentPage from "../../features/assessment/pages/AssessmentPage.jsx";
import HomePage from "../../features/home/pages/HomePage.jsx";
import ProfilePage from "../../features/profile/pages/ProfilePage.jsx";
import UserProfilePage from "../../features/profile/pages/UserProfilePage.jsx";
import ChatMainPage from "../../features/chat/pages/ChatMainPage.jsx";
import EventsAndCommunitiesLayoutPage from "../../features/events-communities/pages/EventsAndCommunitiesLayoutPage.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignUpPage /> },
  { path: "/assessment", element: <AssessmentPage /> },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          { path: "events-communities", element: <EventsAndCommunitiesLayoutPage /> },
          { path: "Profile-Page", element: <ProfilePage /> },
          { path: "User-profile", element: <UserProfilePage /> },
          { path: "Chat-Main-Page", element: <ChatMainPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
