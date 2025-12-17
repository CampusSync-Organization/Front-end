import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  { path: "/", element: <div>Landing</div> },
  { path: "/login", element: <div>Login</div> },
  { path: "/signup", element: <div>Signup</div> },
]);
