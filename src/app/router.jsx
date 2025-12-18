import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import AuthPage from "../features/auth/pages/AuthPage";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <AuthPage /> },
  { path: "/signup", element: <AuthPage /> },
]);
