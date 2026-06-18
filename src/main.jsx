import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "./app/store";
import { router } from "./app/router/router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TransitionProvider } from "./shared/context/TransitionContext";
import "./index.css";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <Provider store={store}>
        <TransitionProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-right" />
        </TransitionProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
