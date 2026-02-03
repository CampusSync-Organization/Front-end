import { createBrowserRouter } from "react-router-dom";
import Landing from "../../features/pages/Landing";
import LoginPage from "../../features/auth/pages/LoginPage";
import SignUpPage from "../../features/auth/pages/SignUpPage";
import ProfilePage from "../../features/profile/pages/ProfilePage";
import UserProfilePage from "../../features/profile/pages/UserProfilePage";
import ChatMainPage from "../../features/Chat/pages/ChatMainPage";

export const router = createBrowserRouter([
    { path: "/", element: <Landing /> },
    { path: "/login", element: <LoginPage /> },
    { path: "/signup", element: <SignUpPage /> },
    { path: "/Profile-Page", element: <ProfilePage /> },
    { path: "/User-profile", element: <UserProfilePage /> },
    { path: "/Chat-Main-Page", element: <ChatMainPage /> }
]);
