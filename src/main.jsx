import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { store } from "./app/store";
import { router } from "./app/router/router";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right" />
    </Provider>
  </React.StrictMode>,
);

// #region agent log
fetch("http://127.0.0.1:7242/ingest/161409ee-1922-461a-a388-f32e495f9bb2", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    sessionId: "debug-session",
    runId: "pre-fix-1",
    hypothesisId: "H2",
    location: "src/main.jsx:12",
    message: "App boot and CSS import",
    data: {
      hasRoot: !!document.getElementById("root"),
      styleSheetsCount: document.styleSheets?.length ?? 0,
    },
    timestamp: Date.now(),
  }),
}).catch(() => {});
// #endregion
