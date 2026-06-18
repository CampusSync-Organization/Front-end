import { createContext, useContext, useRef } from "react";

const TransitionContext = createContext({
  fadeOut: () => Promise.resolve(),
  fadeIn: () => Promise.resolve(),
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

const FADE_MS = 300;

export function TransitionProvider({ children }) {
  const overlayRef = useRef(null);
  const dotsRef = useRef(null);
  const busyRef = useRef(false);

  /** Fades the screen to white. Resolves when fully opaque. */
  const fadeOut = (color = "#ffffff") =>
    new Promise((resolve) => {
      const el = overlayRef.current;
      if (!el) { resolve(); return; }
      if (busyRef.current) { resolve(); return; }
      busyRef.current = true;

      el.style.background = color;
      el.style.pointerEvents = "all";

      // Hard-reset to 0 so the transition always starts from scratch
      el.style.transition = "none";
      el.style.opacity = "0";
      void el.offsetHeight; // force reflow to commit the reset

      el.style.transition = `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      el.style.opacity = "1";

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        // Show loading dots while the caller does async work (API calls, etc.)
        if (dotsRef.current) dotsRef.current.style.opacity = "1";
        resolve();
      };
      el.addEventListener("transitionend", (e) => {
        if (e.propertyName === "opacity") finish();
      }, { once: true });
      setTimeout(finish, FADE_MS + 80); // fallback
    });

  /** Fades the screen back to transparent. Resolves when fully clear. */
  const fadeIn = () =>
    new Promise((resolve) => {
      const el = overlayRef.current;
      if (!el) { resolve(); return; }

      if (dotsRef.current) dotsRef.current.style.opacity = "0";
      el.style.transition = `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`;
      el.style.opacity = "0";

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        el.style.pointerEvents = "none";
        busyRef.current = false;
        resolve();
      };
      el.addEventListener("transitionend", (e) => {
        if (e.propertyName === "opacity") finish();
      }, { once: true });
      setTimeout(finish, FADE_MS + 80); // fallback
    });

  return (
    <TransitionContext.Provider value={{ fadeOut, fadeIn }}>
      {children}

      {/* Persistent overlay — controlled imperatively, never by React state */}
      <div
        ref={overlayRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#ffffff",
          opacity: 0,
          pointerEvents: "none",
          transition: `opacity ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Loading indicator — shown while caller does async work */}
        <img
          src="/campussync-icon.png"
          alt=""
          aria-hidden
          style={{ height: 40, width: "auto", marginBottom: 4 }}
        />
        <div
          ref={dotsRef}
          style={{ display: "flex", gap: 8, opacity: 0, transition: "opacity 150ms" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "block",
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#FCA311",
                animation: `_csDot 1.2s ${i * 0.15}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes _csDot {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40%            { transform: translateY(-9px); opacity: 1; }
        }
      `}</style>
    </TransitionContext.Provider>
  );
}
