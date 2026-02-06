import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Wraps app routes that require authentication.
 * Redirects to /login if user is not set (with return url in state).
 */
export default function AuthGuard() {
  const user = useSelector((state) => state.auth?.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
}
