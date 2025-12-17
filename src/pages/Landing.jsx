import { useEffect } from "react";

function Landing() {
  useEffect(() => {
    const root = document.getElementById("root");
    const bodyBg = window.getComputedStyle(document.body).backgroundColor;
    const mainContainer = document.querySelector("div.min-h-screen");
    const mainBg = mainContainer
      ? window.getComputedStyle(mainContainer).backgroundColor
      : null;

    fetch("http://127.0.0.1:7242/ingest/161409ee-1922-461a-a388-f32e495f9bb2", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "post-v4-1",
        hypothesisId: "H3",
        location: "src/pages/Landing.jsx:12",
        message: "Landing rendered and container styles snapshot",
        data: {
          path: window.location.pathname,
          rootClassName: root?.className ?? null,
          bodyBackgroundColor: bodyBg,
          mainHasMinHeightClass: !!mainContainer,
          mainBackgroundColor: mainBg,
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }, []);
  // #endregion
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <h1>Landing</h1>
    </div>
  );
}

export default Landing;
