import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ============================================================================
// ICONS
// ============================================================================

const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ArrowIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
  </svg>
);

// ============================================================================
// NETWORK CANVAS — flying connected nodes
// ============================================================================

function NetworkCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const nodesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    setSize();
    window.addEventListener("resize", setSize);

    const parent = canvas.parentElement;
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    parent.addEventListener("mousemove", onMouseMove);
    parent.addEventListener("mouseleave", onMouseLeave);

    const buildNodes = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      nodesRef.current = Array.from({ length: 90 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        r: Math.random() * 1.8 + 1.2,
        gold: Math.random() > 0.52,
        phase: Math.random() * Math.PI * 2,
      }));
    };
    buildNodes();
    window.addEventListener("resize", buildNodes);

    const MAX_DIST = 155;
    const MOUSE_RADIUS = 120;
    const MAX_SPEED = 1.4;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;

      nodes.forEach((n) => {
        const dx = mouse.x - n.x;
        const dy = mouse.y - n.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MOUSE_RADIUS && d > 0) {
          n.vx += (dx / d) * 0.04;
          n.vy += (dy / d) * 0.04;
        }

        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > MAX_SPEED) {
          n.vx = (n.vx / speed) * MAX_SPEED;
          n.vy = (n.vy / speed) * MAX_SPEED;
        }

        // Friction
        n.vx *= 0.995;
        n.vy *= 0.995;

        n.x += n.vx;
        n.y += n.vy;
        n.phase += 0.018;

        if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); }
        if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx); }
        if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); }
        if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy); }
      });

      // Edges
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.28;
            const bothGold = nodes[i].gold && nodes[j].gold;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = bothGold
              ? `rgba(252,163,17,${alpha})`
              : `rgba(180,160,100,${alpha * 0.7})`;
            ctx.lineWidth = bothGold ? 0.9 : 0.5;
            ctx.stroke();
          }
        }
      }

      // Nodes
      nodes.forEach((n) => {
        const pulse = Math.sin(n.phase) * 0.35 + 0.75;
        const r = n.r * pulse;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.gold
          ? `rgba(252,163,17,${0.55 * pulse})`
          : `rgba(29,29,31,${0.18 * pulse})`;
        ctx.fill();

        // Glow ring on gold nodes
        if (n.gold && pulse > 1.0) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(252,163,17,${0.08 * (pulse - 0.65)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setSize);
      window.removeEventListener("resize", buildNodes);
      parent.removeEventListener("mousemove", onMouseMove);
      parent.removeEventListener("mouseleave", onMouseLeave);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
    />
  );
}

// ============================================================================
// NAVBAR
// ============================================================================

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (!navRef.current) return;
    gsap.from(navRef.current, { y: -20, opacity: 0, duration: 0.8, ease: "power3.out" });
  }, { scope: navRef });

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "About", href: "#about" },
    { label: "Team", href: "#team" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.05)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-gradient-to-br from-[#FCA311] to-[#E89310] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-semibold text-xs">CS</span>
            </div>
            <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">CampusSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/login" className="text-[13px] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors">
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-[13px] bg-[#1d1d1f] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#1d1d1f]/90 transition-all"
            >
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 -mr-2" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            {isMobileOpen ? <XIcon className="w-5 h-5 text-[#1d1d1f]" /> : <MenuIcon className="w-5 h-5 text-[#1d1d1f]" />}
          </button>
        </div>

        {isMobileOpen && (
          <div className="md:hidden py-4 border-t border-[#1d1d1f]/5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-2 text-[15px] text-[#1d1d1f]/80 hover:text-[#1d1d1f]"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-4 mt-2 border-t border-[#1d1d1f]/5">
              <Link to="/login" className="flex-1 text-center py-2 text-[#1d1d1f] text-[15px] border border-[#1d1d1f]/20 rounded-full">
                Sign in
              </Link>
              <Link to="/signup" className="flex-1 text-center py-2 bg-[#1d1d1f] text-white text-[15px] rounded-full">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ============================================================================
// HERO — with flying network canvas background
// ============================================================================

const AVATAR_INITIALS = ["AJ", "MC", "JS", "PP", "MW"];
const AVATAR_COLORS = ["#FCA311", "#E89310", "#D4820F", "#FCA311", "#E89310"];

function Hero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".hero-badge",     { y: 16, opacity: 0, duration: 0.5 })
      .from(".hero-title",     { y: 44, opacity: 0, duration: 0.9 }, "-=0.3")
      .from(".hero-subtitle",  { y: 30, opacity: 0, duration: 0.7 }, "-=0.55")
      .from(".hero-cta",       { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
      .from(".hero-proof",     { y: 12, opacity: 0, duration: 0.45 }, "-=0.3")
      .from(".hero-scroll",    { y: 10, opacity: 0, duration: 0.4 }, "-=0.2");
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-14 pb-24 overflow-hidden"
      style={{ background: "linear-gradient(160deg, #fbfbfd 0%, #f5f5f5 50%, #fbfbfd 100%)" }}
    >
      {/* Flying nodes canvas */}
      <NetworkCanvas />

      {/* Subtle radial glow behind content */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(252,163,17,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="hero-badge inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-[#FCA311]/30 rounded-full px-4 py-1.5 mb-8 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FCA311] animate-pulse" />
          <span className="text-[12px] font-medium text-[#1d1d1f]/70 tracking-wide">
            AI-powered student matching — now live
          </span>
        </div>

        {/* Eyebrow */}
        <p className="hero-eyebrow text-[#FCA311] text-sm font-medium tracking-widest uppercase mb-5 hidden">
          Student Connection Platform
        </p>

        {/* Title */}
        <h1 className="hero-title text-[clamp(46px,8.5vw,82px)] font-semibold text-[#1d1d1f] leading-[1.04] tracking-[-0.035em] mb-7">
          Where learning meets
          <br />
          <span
            style={{
              backgroundImage: "linear-gradient(90deg, #FCA311 0%, #E05C00 50%, #FCA311 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "shimmer 4s linear infinite",
            }}
          >
            belonging
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-[#86868b] text-[18px] sm:text-[20px] max-w-2xl mx-auto leading-relaxed mb-11">
          CampusSync connects you with students who share your interests, values, and goals.
          Build genuine friendships. Form meaningful project teams. Find your people.
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group relative inline-flex items-center gap-2 bg-[#FCA311] text-white px-9 py-4 rounded-full text-[17px] font-semibold hover:bg-[#E89310] transition-all duration-300 shadow-[0_8px_32px_rgba(252,163,17,0.35)] hover:shadow-[0_12px_40px_rgba(252,163,17,0.45)] hover:-translate-y-0.5"
          >
            Get started free
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-[#1d1d1f]/70 px-6 py-4 text-[17px] font-medium hover:text-[#FCA311] transition-colors duration-200"
          >
            Learn more
            <ChevronDownIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Social proof */}
        <div className="hero-proof flex items-center justify-center gap-3 mt-8">
          <div className="flex -space-x-2">
            {AVATAR_INITIALS.map((init, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-semibold shadow-sm"
                style={{ background: AVATAR_COLORS[i] }}
              >
                {init}
              </div>
            ))}
          </div>
          <p className="text-[#86868b] text-[13px]">
            <span className="text-[#1d1d1f] font-semibold">1,000+</span> students already connected
          </p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-[#1d1d1f]/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#1d1d1f]/40 rounded-full animate-bounce" />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </section>
  );
}

// ============================================================================
// MARQUEE — trust strip
// ============================================================================

const trustItems = [
  "AI-Powered Matching",
  "Smart Communities",
  "Real-Time Chat",
  "Team Formation",
  "Event Discovery",
  "Safe & Moderated",
  "Personality Alignment",
  "Academic Goals",
];

function Marquee() {
  return (
    <div className="relative overflow-hidden bg-[#1d1d1f] py-4 select-none">
      <div
        className="flex gap-12 whitespace-nowrap"
        style={{ animation: "marquee 28s linear infinite" }}
      >
        {[...trustItems, ...trustItems, ...trustItems].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 text-[13px] font-medium text-white/50">
            <span className="text-[#FCA311] text-[8px]">✦</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// FEATURES — bento grid
// ============================================================================

const features = [
  {
    id: 1,
    title: "Personalized Assessment",
    description: "Answer personalized questions about your interests, major, and values. We find your perfect match.",
    icon: "✨",
    size: "large",
    accent: "#FCA311",
  },
  {
    id: 2,
    title: "AI Matching",
    description: "Our intelligent engine connects you with compatible students instantly.",
    icon: "🎯",
    size: "small",
    accent: "#E89310",
  },
  {
    id: 3,
    title: "Safe Chat",
    description: "Secure, AI-moderated conversations in a respectful community.",
    icon: "💬",
    size: "small",
    accent: "#D4820F",
  },
  {
    id: 4,
    title: "Build Teams",
    description: "Find collaborators for academic projects and activities. Form teams that actually work.",
    icon: "👥",
    size: "large",
    accent: "#FCA311",
  },
];

function Features() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from(".features-title", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
    });
    gsap.from(".feature-card", {
      scrollTrigger: { trigger: ".features-grid", start: "top 85%" },
      y: 60, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="features" className="py-28 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#FCA311] text-sm font-medium tracking-widest uppercase mb-4">Platform</p>
          <h2 className="features-title text-[clamp(32px,5vw,52px)] font-semibold text-[#1d1d1f] tracking-[-0.025em]">
            Everything you need to connect
          </h2>
          <p className="text-[#86868b] text-lg mt-4 max-w-xl mx-auto">
            Four powerful features designed to help you find your people
          </p>
        </div>

        <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card group relative overflow-hidden rounded-3xl bg-[#f5f5f7] p-10 transition-all duration-500 cursor-default
                hover:bg-[#ebebed] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] hover:-translate-y-1
                ${feature.size === "large" ? "min-h-[300px]" : "min-h-[220px]"}`}
            >
              {/* Accent glow */}
              <div
                className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${feature.accent}18 0%, transparent 70%)` }}
              />

              <div className="text-[40px] mb-5 transition-transform duration-300 group-hover:scale-110 origin-left">
                {feature.icon}
              </div>
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">{feature.title}</h3>
              <p className="text-[#86868b] text-[15px] leading-relaxed max-w-sm">{feature.description}</p>

              <div className="absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: feature.accent }}
                >
                  <ArrowIcon className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Bottom line accent */}
              <div
                className="absolute bottom-0 left-8 right-8 h-[2px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${feature.accent}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STORY — editorial
// ============================================================================

function Story() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from(".story-heading", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40, opacity: 0, duration: 0.7,
    });
    gsap.from(".story-quote", {
      scrollTrigger: { trigger: ".story-quote", start: "top 85%" },
      y: 30, opacity: 0, duration: 0.6,
    });
    gsap.from(".story-paragraph", {
      scrollTrigger: { trigger: ".story-content", start: "top 80%" },
      y: 30, opacity: 0, stagger: 0.15, duration: 0.5,
    });

    const stats = gsap.utils.toArray("[data-count]");
    stats.forEach((stat) => {
      const value = parseInt(stat.dataset.count, 10);
      const suffix = stat.dataset.suffix || "";
      const counter = { val: 0 };
      gsap.to(counter, {
        val: value,
        scrollTrigger: { trigger: stat, start: "top 90%", once: true },
        duration: 1.5,
        ease: "power2.out",
        onUpdate: () => { stat.textContent = `${Math.round(counter.val)}${suffix}`; },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto">
        <div className="story-heading text-center mb-16">
          <p className="text-[#FCA311] text-sm font-medium tracking-widest uppercase mb-4">Our Story</p>
          <h2 className="text-[clamp(28px,4vw,44px)] font-semibold text-[#1d1d1f] tracking-[-0.025em]">
            Built by students, for students
          </h2>
        </div>

        <blockquote className="story-quote text-center mb-16">
          <p className="text-[clamp(24px,3.5vw,36px)] font-medium text-[#1d1d1f] leading-snug tracking-tight">
            "I don't belong, and meeting people who are like me is{" "}
            <span className="text-[#FCA311]">just too hard.</span>"
          </p>
          <p className="text-[#86868b] mt-4 text-sm">— Every first-year student, at some point</p>
        </blockquote>

        <div className="story-content space-y-6 text-[17px] text-[#1d1d1f]/80 leading-relaxed">
          <p className="story-paragraph">
            We get it. As first-year students, we faced a harsh reality — the campus felt enormous,
            and despite being surrounded by thousands, finding people who truly understood us seemed impossible.
          </p>
          <p className="story-paragraph">
            Traditional ways of meeting people weren't cutting it. We felt isolated, like outsiders
            trying to fit into an overwhelming machine. When project time came, it was even worse.
          </p>
          <p className="story-paragraph">
            That's when we asked: what if there was a platform that truly understood us? One that
            intelligently matched us with students who shared our values, interests, and goals.{" "}
            <strong className="text-[#1d1d1f]">That's when CampusSync was born.</strong>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-[#1d1d1f]/10">
          {[
            { count: 1000, suffix: "+", label: "Students Connected" },
            { count: 500, suffix: "+", label: "Teams Formed" },
            { count: 50, suffix: "+", label: "Universities" },
          ].map((stat) => (
            <div key={stat.label} className="text-center group">
              <div className="text-[clamp(32px,4vw,52px)] font-semibold text-[#FCA311] transition-transform duration-300 group-hover:scale-105">
                <span data-count={stat.count} data-suffix={stat.suffix}>0{stat.suffix}</span>
              </div>
              <p className="text-[#86868b] text-sm mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM
// ============================================================================

const teamMembers = [
  { id: 1, name: "Alex Johnson",    role: "Co-Founder & Lead",  initials: "AJ" },
  { id: 2, name: "Maria Chen",      role: "AI Engineer",         initials: "MC" },
  { id: 3, name: "Jordan Smith",    role: "Product Manager",     initials: "JS" },
  { id: 4, name: "Priya Patel",     role: "Backend Lead",        initials: "PP" },
  { id: 5, name: "Marcus Williams", role: "Community Lead",      initials: "MW" },
];

function Team() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from(".team-heading", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40, opacity: 0, duration: 0.7,
    });
    gsap.from(".team-card", {
      scrollTrigger: { trigger: ".team-grid", start: "top 85%" },
      y: 50, opacity: 0, stagger: 0.08, duration: 0.5, ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="team" className="py-28 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="team-heading text-center mb-16">
          <p className="text-[#FCA311] text-sm font-medium tracking-widest uppercase mb-4">People</p>
          <h2 className="text-[clamp(32px,5vw,52px)] font-semibold text-[#1d1d1f] tracking-[-0.025em]">
            Meet the team
          </h2>
          <p className="text-[#86868b] text-lg mt-4">The people making campus feel like home</p>
        </div>

        <div className="team-grid flex flex-wrap justify-center gap-10">
          {teamMembers.map((member) => (
            <div key={member.id} className="team-card group text-center">
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] flex items-center justify-center shadow-sm group-hover:shadow-[0_8px_24px_rgba(252,163,17,0.2)] transition-all duration-500 group-hover:scale-105">
                  <span className="text-2xl font-semibold text-[#1d1d1f]/60">{member.initials}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FCA311] rounded-full border-2 border-white shadow-sm" />
              </div>
              <h3 className="text-[17px] font-semibold text-[#1d1d1f] group-hover:text-[#FCA311] transition-colors duration-300">
                {member.name}
              </h3>
              <p className="text-[13px] text-[#86868b] mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// CTA
// ============================================================================

function CTA() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(".cta-content", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40, opacity: 0, duration: 0.7,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 bg-[#1d1d1f] overflow-hidden">
      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 60%, rgba(252,163,17,0.08) 0%, transparent 70%)" }}
      />

      <div className="cta-content relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-[#FCA311] text-sm font-medium tracking-widest uppercase mb-5">Join us</p>
        <h2 className="text-[clamp(32px,5vw,52px)] font-semibold text-white tracking-[-0.025em] mb-6">
          Ready to find your people?
        </h2>
        <p className="text-white/50 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Join thousands of students who've already discovered meaningful connections on campus.
        </p>
        <Link
          to="/signup"
          className="group inline-flex items-center gap-2 bg-[#FCA311] text-[#1d1d1f] px-10 py-4 rounded-full text-[17px] font-semibold hover:bg-[#FFB733] transition-all duration-300 shadow-[0_8px_32px_rgba(252,163,17,0.3)] hover:shadow-[0_12px_48px_rgba(252,163,17,0.4)] hover:-translate-y-0.5"
        >
          Get started — it's free
          <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
        <p className="text-white/25 text-[13px] mt-4">No credit card required</p>
      </div>
    </section>
  );
}

// ============================================================================
// LANDING
// ============================================================================

export default function Landing() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => { document.documentElement.style.scrollBehavior = "auto"; };
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <Hero />
      <Marquee />
      <Features />
      <Story />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
}
