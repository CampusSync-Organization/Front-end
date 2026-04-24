// GuestGuard.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function GuestGuard({ children }) {
  const { user, token } = useSelector((state) => state.auth);

  if (user && token) {
    if (user.assessment_completed) {
      return <Navigate to="/home" replace />;
    } else {
      return <Navigate to="/assessment" replace />;
    }
  }

  return children;
}
