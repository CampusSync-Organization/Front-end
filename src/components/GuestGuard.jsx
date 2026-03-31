// GuestGuard.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function GuestGuard({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    return <Navigate to="/home" replace />;
  }

  return children;
}
