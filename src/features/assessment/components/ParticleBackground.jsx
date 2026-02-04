import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Premium canvas-based particle background with mouse interactivity
 * Features: Aurora effect, interactive particles, depth layers
 */
export default function ParticleBackground() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef(null);
  const auroraRef = useRef({ offset: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Set canvas size
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    // Initialize particles with different depths
    const initParticles = () => {
      particlesRef.current = [];
      const particleCount = Math.min(80, Math.floor((width * height) / 15000));

      for (let i = 0; i < particleCount; i++) {
        const depth = Math.random();
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          baseX: 0,
          baseY: 0,
          size: (1 + depth * 3) * (width > 768 ? 1 : 0.7),
          depth,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -0.2 - Math.random() * 0.5,
          opacity: 0.1 + depth * 0.6,
          hue: 35 + Math.random() * 20, // Golden hues
        });
        particlesRef.current[i].baseX = particlesRef.current[i].x;
        particlesRef.current[i].baseY = particlesRef.current[i].y;
      }
    };

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    // Aurora wave animation
    gsap.to(auroraRef.current, {
      offset: Math.PI * 2,
      duration: 8,
      repeat: -1,
      ease: "none",
    });

    // Draw aurora effect
    const drawAurora = () => {
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "rgba(10, 18, 37, 0)");
      gradient.addColorStop(0.5, "rgba(252, 163, 17, 0.03)");
      gradient.addColorStop(1, "rgba(10, 18, 37, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Flowing aurora waves
      const waveCount = 3;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.moveTo(0, height * 0.3);

        for (let x = 0; x <= width; x += 5) {
          const y =
            height * 0.3 +
            Math.sin((x / width) * 4 + auroraRef.current.offset + w) * 50 +
            Math.sin((x / width) * 2 + auroraRef.current.offset * 0.5) * 30;
          ctx.lineTo(x, y);
        }

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();

        const auroraGradient = ctx.createLinearGradient(0, 0, 0, height);
        auroraGradient.addColorStop(0, `rgba(252, 163, 17, ${0.02 - w * 0.005})`);
        auroraGradient.addColorStop(0.5, `rgba(30, 50, 90, ${0.05 - w * 0.01})`);
        auroraGradient.addColorStop(1, "rgba(10, 18, 37, 0)");
        ctx.fillStyle = auroraGradient;
        ctx.fill();
      }
    };

    // Draw and update particles
    const drawParticles = () => {
      particlesRef.current.forEach((p) => {
        // Mouse attraction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150 * (1 + p.depth);

        if (distance < maxDistance) {
          const force = (1 - distance / maxDistance) * 0.02 * p.depth;
          p.x += dx * force;
          p.y += dy * force;
        }

        // Drift movement
        p.x += p.speedX * (1 + p.depth);
        p.y += p.speedY * (1 + p.depth);

        // Wrap around edges
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
        gradient.addColorStop(0, `hsla(${p.hue}, 80%, 60%, ${p.opacity})`);
        gradient.addColorStop(0.4, `hsla(${p.hue}, 70%, 50%, ${p.opacity * 0.5})`);
        gradient.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${p.opacity})`;
        ctx.fill();
      });
    };

    // Draw connections between nearby particles
    const drawConnections = () => {
      const maxDist = 120;
      ctx.strokeStyle = "rgba(252, 163, 17, 0.08)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDist) {
            const opacity = (1 - distance / maxDist) * 0.15;
            ctx.strokeStyle = `rgba(252, 163, 17, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Background gradient
      const bgGradient = ctx.createRadialGradient(
        width * 0.3,
        height * 0.3,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.8
      );
      bgGradient.addColorStop(0, "rgba(20, 33, 61, 0.3)");
      bgGradient.addColorStop(1, "rgba(10, 18, 37, 0)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      drawAurora();
      drawConnections();
      drawParticles();

      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Base background color */}
      <div className="absolute inset-0 bg-[#0a1225]" />
      
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ mixBlendMode: "screen" }}
      />

      {/* Subtle overlay mesh */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Vignette effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,18,37,0.4) 100%)",
        }}
      />
    </>
  );
}
