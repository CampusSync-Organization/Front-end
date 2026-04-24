import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Wraps app routes that require authentication.
 * Redirects to /login if user is not set (with return url in state).
 */
export default function AuthGuard() {
  const { user, token } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!user.assessment_completed) {
    return <Navigate to="/assessment" replace />;
  }

  return <Outlet />;
}
