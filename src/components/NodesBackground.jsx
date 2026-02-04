import { useRef, useEffect } from "react";

const NAVY = "#0f172a";
const NAVY_SOFT = "#1e293b";
const GOLD_SOFT = "#fbbf24";
const GOLD_WARM = "#f59e0b";

function NodesBackground({ className = "", maxNodes = 28, connectRadius = 140 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);
  const lineRevealRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function initNodes() {
      nodesRef.current = [];
      for (let i = 0; i < maxNodes; i++) {
        nodesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (reducedMotion ? 0.1 : 0.2),
          vy: (Math.random() - 0.5) * (reducedMotion ? 0.1 : 0.2),
          radius: 2.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
      connectionsRef.current = [];
      const nodes = nodesRef.current;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < connectRadius) {
            connectionsRef.current.push({ i, j, dist, progress: 0 });
          }
        }
      }
      connectionsRef.current.sort(() => Math.random() - 0.5);
      lineRevealRef.current = 0;
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    }

    function gradient() {
      const g = ctx.createLinearGradient(0, 0, width, height);
      g.addColorStop(0, NAVY);
      g.addColorStop(0.35, NAVY_SOFT);
      g.addColorStop(0.6, "#334155");
      g.addColorStop(0.8, "#92400e");
      g.addColorStop(1, GOLD_WARM);
      return g;
    }

    let lastTime = 0;
    const revealSpeed = reducedMotion ? 0.001 : 0.004;

    function tick(t) {
      const dt = Math.min((t - lastTime) / 1000, 0.1);
      lastTime = t;

      ctx.fillStyle = gradient();
      ctx.fillRect(0, 0, width, height);

      const nodes = nodesRef.current;
      const time = t * 0.001;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        const drift = 0.3 * Math.sin(time + node.phase);
        node.x += drift;
        node.y += drift * 0.5;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      });

      lineRevealRef.current = Math.min(1, lineRevealRef.current + revealSpeed);

      const connections = connectionsRef.current;
      const totalConnections = connections.length;
      const toShow = Math.floor(lineRevealRef.current * totalConnections);

      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      for (let c = 0; c < toShow; c++) {
        const { i, j } = connections[c];
        const a = nodes[i];
        const b = nodes[j];
        const progress = totalConnections > 0 ? (c + 1) / totalConnections : 1;
        const alpha = 0.12 + 0.18 * progress;
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(251, 191, 36, 0.5)";
      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      nodes.slice(0, 5).forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(tick);
    }

    resize();
    animationRef.current = requestAnimationFrame(tick);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [maxNodes, connectRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full object-cover pointer-events-none ${className}`}
      aria-hidden
    />
  );
}

export default NodesBackground;
