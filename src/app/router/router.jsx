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
import RecommendationPage from "../../features/recommendation/pages/RecommendationPage.jsx";
import EventsAndCommunitiesLayoutPage from "../../features/events-communities/pages/EventsAndCommunitiesLayoutPage.jsx";
import EventDetailsPage from "../../features/events-communities/pages/EventDetailsPage.jsx";
import MyEventsPage from "../../features/events-communities/pages/MyEventsPage.jsx";
import MyCommunitiesPage from "../../features/events-communities/pages/MyCommunitiesPage.jsx";
import GuestGuard from "../../components/GuestGuard.jsx";

export const router = createBrowserRouter([
  { path: "/", element: <Landing></Landing> },
  {
    path: "/login",
    element: (
      <GuestGuard>
        {" "}
        <LoginPage />{" "}
      </GuestGuard>
    ),
  },
  {
    path: "/signup",
    element: (
      <GuestGuard>
        <SignUpPage />
      </GuestGuard>
    ),
  },
  { path: "/assessment", element: <AssessmentPage /> },
  {
    element: <AuthGuard />,
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { path: "home", element: <HomePage /> },
          {
            path: "events-communities",
            element: <EventsAndCommunitiesLayoutPage />,
          },
          { path: "events/:eventId", element: <EventDetailsPage /> },
          { path: "my-events", element: <MyEventsPage /> },
          { path: "my-communities", element: <MyCommunitiesPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "user-profile/:id", element: <UserProfilePage /> },
          { path: "Recommendation-Page", element: <RecommendationPage /> },
          { path: "Chat-Main-Page", element: <ChatMainPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);
