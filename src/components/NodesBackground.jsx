import { useRef, useEffect } from "react";

function NodesBackground({ className = "", maxNodes = 72, connectRadius = 180 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let W = 0, H = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width;
      H = rect.height;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    };

    const buildNodes = () => {
      nodesRef.current = Array.from({ length: maxNodes }, (_, i) => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (reducedMotion ? 0.1 : 0.38),
        vy: (Math.random() - 0.5) * (reducedMotion ? 0.1 : 0.38),
        r: i < 8 ? 4.5 + Math.random() * 2 : 2 + Math.random() * 2,
        isHub: i < 8,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const parent = canvas.parentElement;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    parent?.addEventListener("mousemove", onMove);
    parent?.addEventListener("mouseleave", onLeave);

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const MAX_SPEED = reducedMotion ? 0.3 : 1.2;
    const MOUSE_R = 130;

    const tick = (t) => {
      ctx.clearRect(0, 0, W, H);
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const time = t * 0.001;

      nodes.forEach((n) => {
        // Drift
        n.x += n.vx + 0.18 * Math.sin(time * 0.4 + n.phase);
        n.y += n.vy + 0.12 * Math.cos(time * 0.4 + n.phase);

        // Mouse repulsion — nodes spread away from cursor
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_R && d > 0) {
          const force = (1 - d / MOUSE_R) * 0.06;
          n.vx += (dx / d) * force;
          n.vy += (dy / d) * force;
        }

        // Speed cap + friction
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > MAX_SPEED) { n.vx = (n.vx / speed) * MAX_SPEED; n.vy = (n.vy / speed) * MAX_SPEED; }
        n.vx *= 0.993;
        n.vy *= 0.993;

        // Wrap edges softly
        if (n.x < -20) n.x = W + 20;
        if (n.x > W + 20) n.x = -20;
        if (n.y < -20) n.y = H + 20;
        if (n.y > H + 20) n.y = -20;

        n.phase += 0.015;
      });

      // Draw edges
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectRadius) {
            const alpha = (1 - dist / connectRadius) * 0.7;
            const isGold = nodes[i].isHub || nodes[j].isHub;
            ctx.strokeStyle = isGold
              ? `rgba(252,163,17,${alpha})`
              : `rgba(232,147,16,${alpha * 0.7})`;
            ctx.lineWidth = isGold ? 1.8 : 1.1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.phase) * 0.3 + 0.85;
        const r = n.r * pulse;

        if (n.isHub) {
          // Outer glow ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(252,163,17,${0.12 * pulse})`;
          ctx.lineWidth = 4;
          ctx.stroke();

          // Inner glow ring
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(252,163,17,${0.22 * pulse})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.isHub
          ? `rgba(252,163,17,${Math.min(1, 1.0 * pulse)})`
          : `rgba(232,147,16,${0.85 * pulse})`;
        ctx.fill();
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      parent?.removeEventListener("mousemove", onMove);
      parent?.removeEventListener("mouseleave", onLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [maxNodes, connectRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      aria-hidden
    />
  );
}

export default NodesBackground;
