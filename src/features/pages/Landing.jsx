import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Sparkles, Zap } from "lucide-react";
import Footer from "../../components/Footer";
import NodesBackground from "../../components/NodesBackground";
import HowItWorksSection from "./HowItWorksSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion as Motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Icons ────────────────────────────────────────────────────────────────────

const MenuIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);
const XIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Navbar = forwardRef(function Navbar(_, forwardedRef) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navRef = useRef(null);
  useImperativeHandle(forwardedRef, () => navRef.current);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (!navRef.current) return;
      gsap.from(navRef.current, {
        y: -60,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      gsap.from(".landing-nav-link", {
        opacity: 0,
        y: -16,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.07,
        delay: 0.25,
      });
    },
    { scope: navRef },
  );

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/85 backdrop-blur-xl border-b border-black/5 shadow-sm py-1" : "bg-transparent py-2"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-13 md:h-14">
          <Link to="/" className="landing-nav-link flex items-center gap-2.5">
            <img
              src="/campussync-icon.png"
              alt="CampusSync"
              className="h-8 w-auto object-contain"
            />
            <span className="hidden sm:inline text-[17px] font-bold tracking-tight text-amber-500">
              CampusSync
            </span>
          </Link>

          <div
            className="hidden md:flex items-center gap-1"
            onMouseLeave={() => setHoveredLink(null)}
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                className="relative landing-nav-link text-[14px] font-medium px-4 py-2 rounded-full text-black/70 hover:text-black transition-colors duration-150"
              >
                <span className="relative z-10">{link.label}</span>
                <Motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }}
                  className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-amber-400 origin-center rounded-full"
                  transition={{ type: "spring", stiffness: 140, damping: 22 }}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden sm:inline-block text-[14px] font-medium px-4 py-2 text-black/70 hover:text-black transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-[14px] font-bold px-5 py-2.5 rounded-full bg-black text-white hover:bg-black/80 transition-all hover:shadow-lg hover:-translate-y-px"
            >
              Sign up
            </Link>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? (
                <XIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden px-0 pt-4 pb-6 border-t border-black/5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block py-3 px-4 text-[15px] font-medium text-black/70 rounded-xl hover:text-black"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-4 mt-2 border-t border-black/5">
              <Link
                to="/login"
                className="flex-1 text-center py-3 rounded-xl border border-black/10 text-[15px] font-medium"
                onClick={() => setIsMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center py-3 rounded-xl bg-black text-white text-[15px] font-bold"
                onClick={() => setIsMobileOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

// ─── Student profile cards data ───────────────────────────────────────────────

// To use real photos, drop square images into public/avatars/ matching the
// `img` paths below. Missing/broken images fall back to the colored initials.
const STUDENT_CARDS = [
  {
    init: "AA",
    name: "Abdelrahman Amr",
    major: "AI",
    tags: ["Backend", "IOT"],
    reason: "Same hands-on study style",
    match: 88,
    bg: "#14213D",
    best: false,
    img: "/avatars/abdelrahman.jpg",
  },
  {
    init: "YN",
    name: "Youssef Nabil",
    major: "CS",
    tags: ["AI", "Front-end"],
    reason: "Shares your interest in AI & design",
    match: 94,
    bg: "#FCA311",
    best: false,
    img: "/avatars/youssef-nabil.jpg",
  },

  {
    init: "RM",
    name: "Raghad Mohamed",
    major: "Data Science",
    tags: ["Product", "Research"],
    reason: "Aligned on academic goals",
    match: 97,
    bg: "#FCA311",
    best: true,
    img: "/avatars/raghad.jpg",
  },
  {
    init: "YM",
    name: "Youssef Mohammed",
    major: "Front-end, AI",
    tags: ["Python", "ML"],
    reason: "Matches your project interests",
    match: 85,
    bg: "#14213D",
    best: false,
    img: "/avatars/youssef-mohammed.jpg",
  },
  {
    init: "HA",
    name: "Hadeer Abdelhady",
    major: "IS",
    tags: ["AI", "NLP"],
    reason: "Similar values & vibe",
    match: 91,
    bg: "#E89310",
    best: false,
    img: "/avatars/hadeer.jpg",
  },
];

// Fan geometry: rotation (deg), x offset from center (px), y raise (px), scale
const FAN = [
  { r: -18, x: -280, y: 50, s: 0.86 },
  { r: -9, x: -140, y: 18, s: 0.93 },
  { r: 0, x: 0, y: 0, s: 1.0 },
  { r: 9, x: 140, y: 18, s: 0.93 },
  { r: 18, x: 280, y: 50, s: 0.86 },
];

function StudentCard({ card, fan, index }) {
  const centerZ = STUDENT_CARDS.length - Math.abs(index - 2);
  return (
    <div
      className="sc absolute bottom-0"
      style={{
        width: 188,
        left: "50%",
        transformOrigin: "bottom center",
        transform: `translateX(calc(-50% + ${fan.x}px)) translateY(${fan.y}px) rotate(${fan.r}deg) scale(${fan.s})`,
        zIndex: centerZ,
      }}
    >
      <div className="group relative bg-white rounded-3xl p-4 shadow-soft border border-neutral-200/60 overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:shadow-soft-lg">
        {/* Best Match badge — centered at the top */}
        {card.best && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 bg-secondary px-2.5 py-0.5 rounded-full flex items-center gap-1 z-10 shadow-sm">
            <Sparkles className="w-2.5 h-2.5 text-white" />
            <span className="text-[9px] font-bold text-white">Best match</span>
          </div>
        )}

        {/* Avatar + identity */}
        <div
          className={`flex flex-col items-center mb-3 ${card.best ? "pt-7" : "pt-2.5"}`}
        >
          <div className="relative mb-2.5">
            <div
              className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-neutral-50 shadow-sm"
              style={{ background: card.bg }}
            >
              {/* initials fallback layer (shown if image is missing or fails) */}
              <span className="absolute inset-0 flex items-center justify-center text-xl font-black text-white">
                {card.init}
              </span>
              {card.img && (
                <img
                  src={card.img}
                  alt={card.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => e.currentTarget.remove()}
                />
              )}
            </div>
            {/* online dot */}
            <div className="absolute -bottom-1.5 -right-1.5 bg-white p-0.5 rounded-full shadow-sm">
              <div className="bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
          </div>
          <h3 className="text-[14px] font-bold text-primary leading-tight">
            {card.name}
          </h3>
          <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
            <Briefcase className="w-3 h-3" /> {card.major}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-3">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-secondary/15 text-secondary text-[10px] font-bold rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Why this match */}
        <div className="bg-background rounded-xl p-2.5 flex items-center gap-2 border border-neutral-100">
          <div className="p-1 bg-secondary/10 rounded-md shrink-0">
            <Zap className="w-3 h-3 text-secondary" />
          </div>
          <span className="text-[10px] font-medium text-primary/70 leading-tight">
            {card.reason}
          </span>
        </div>

        {/* Compatibility */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-secondary"
              style={{ width: `${card.match}%` }}
            />
          </div>
          <span className="text-[11px] font-bold text-primary tabular-nums">
            {card.match}%
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

const Hero = forwardRef(function Hero(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-label", { y: 18, opacity: 0, duration: 0.5 })
        .from(".hero-line-1", { y: 60, opacity: 0, duration: 0.8 }, "-=0.25")
        .from(".hero-line-2", { y: 60, opacity: 0, duration: 0.8 }, "-=0.65")
        .from(".hero-sub", { y: 28, opacity: 0, duration: 0.6 }, "-=0.55");
      // CTA buttons use a CSS entrance (.hero-cta-row) so they can never be left
      // hidden by a re-run of this timeline.

      // Cards fly in from below with stagger from center outward
      gsap.from(".sc", {
        y: 500,
        opacity: 0,
        duration: 1.1,
        stagger: { amount: 0.45, from: "center" },
        ease: "power4.out",
        delay: 0.7,
      });

      gsap.from(".hero-proof", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        delay: 1.4,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full min-h-screen overflow-hidden flex flex-col items-center justify-center pt-28 pb-10"
      style={{ background: "#f7f7f5" }}
    >
      {/* Flying connected nodes — visible ambient network */}
      <NodesBackground
        className="z-0 opacity-80"
        maxNodes={68}
        connectRadius={190}
      />

      {/* Top text block */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Label */}
        <div className="hero-label inline-flex items-center gap-2 text-[12px] font-bold tracking-widest text-black/40 uppercase mb-8">
          <span className="w-4 h-px bg-black/20" />
          Student Connection Platform
          <span className="w-4 h-px bg-black/20" />
        </div>

        {/* Big title — massive, black, bold */}
        <h1
          className="font-black tracking-[-0.04em] leading-[1.0] text-black"
          style={{ fontSize: "clamp(52px, 9vw, 104px)" }}
        >
          <span className="hero-line-1 block">Find Your</span>
          <span className="hero-line-2 block text-amber-400">People.</span>
        </h1>

        <p className="hero-sub text-[17px] sm:text-[19px] text-black/45 font-medium mt-6 max-w-lg leading-relaxed">
          Connect with students who share your exact interests, values, and
          academic goals.
        </p>

        {/* CTAs */}
        <div className="hero-cta-row flex flex-col sm:flex-row items-center gap-4 mt-8">
          <Link to="/signup" className="hero-cta shiny-cta group">
            <span className="relative z-10 flex items-center gap-2.5 text-white text-[15px] font-bold tracking-wide">
              Start matching
              <ArrowRight
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                strokeWidth={2.5}
              />
            </span>
          </Link>
          <a
            href="#features"
            className="hero-cta group inline-flex items-center gap-2 bg-white text-black text-[15px] font-bold tracking-wide px-7 py-4 rounded-full border border-black/10 shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.14)] hover:-translate-y-0.5 transition-all duration-300"
          >
            See how it works
            <ArrowRight
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={2.5}
            />
          </a>
        </div>
      </div>

      {/* Card fan stage */}
      <div className="relative z-10 mx-auto w-full max-w-5xl mt-8 sm:mt-10 h-[360px] sm:h-[420px] scale-[0.58] sm:scale-90 md:scale-100 origin-top">
        {/* The cards */}
        {STUDENT_CARDS.map((card, i) => (
          <StudentCard key={card.init} card={card} fan={FAN[i]} index={i} />
        ))}
      </div>

      {/* Social proof below cards */}
      <div className="hero-proof relative z-10 flex items-center justify-center gap-3 mt-6">
        <div className="flex -space-x-2">
          {STUDENT_CARDS.map((c, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full border-2 border-[#f7f7f5] flex items-center justify-center text-[9px] font-black text-white shadow-sm"
              style={{ background: c.bg }}
            >
              {c.init[0]}
            </div>
          ))}
        </div>
        <p className="text-[13px] font-medium text-black/40">
          <span className="text-black font-bold">1,000+</span> students already
          connected
        </p>
      </div>
    </section>
  );
});

// ─── Marquee ──────────────────────────────────────────────────────────────────

const MARQUEE_ITEMS = [
  "AI-Powered Matching",
  "Personality Alignment",
  "Smart Communities",
  "Real-Time Chat",
  "Team Formation",
  "Event Discovery",
  "Safe & Moderated",
  "Academic Goals",
  "Find Your Tribe",
];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="relative overflow-hidden bg-black py-4 select-none">
      <div
        className="flex gap-14 whitespace-nowrap"
        style={{ animation: "marqueeRoll 32s linear infinite" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-[12px] font-bold text-white/30 tracking-widest uppercase"
          >
            <span className="text-amber-400 text-[8px]">✦</span>
            {item}
          </span>
        ))}
      </div>
      <style>{`@keyframes marqueeRoll { from { transform: translateX(0) } to { transform: translateX(-33.333%) } }`}</style>
    </div>
  );
}

// ─── Story ────────────────────────────────────────────────────────────────────

const storyChapters = [
  {
    label: "The Problem",
    text: "As first-year college students, we faced a harsh reality — the campus felt enormous, and despite being surrounded by thousands of students, finding people who truly understood us seemed impossible.",
  },
  {
    label: "The Struggle",
    text: "When project time came around, it was even worse. We either worked with classmates we barely knew or desperately hoped for compatible teammates.",
  },
  {
    label: "The Realization",
    text: "We believed there had to be a better way. What if there was a platform that truly understood us? One that intelligently matched us with students who shared our values, interests, and goals?",
  },
  {
    label: "Our Mission",
    text: "We're building a community where every student can find their people, build lasting friendships, and collaborate on projects that matter. When you're surrounded by the right people, belonging becomes reality.",
  },
];

const STATS = [
  { value: 1000, suffix: "+", label: "Students Connected" },
  { value: 500, suffix: "+", label: "Teams Formed" },
  { value: 50, suffix: "+", label: "Universities" },
];

const Story = forwardRef(function Story(_, forwardedRef) {
  const sectionRef = useRef(null);
  const threadRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      const reduce = window.matchMedia?.(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      const els = sectionRef.current?.querySelectorAll("[data-stat-count]");
      els?.forEach((el) => {
        const value = parseInt(el.dataset.statCount, 10);
        const suffix = el.dataset.suffix || "";
        if (reduce) {
          el.textContent = `${value}${suffix}`;
          return;
        }
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          duration: 1.5,
          ease: "power1.out",
          onUpdate: () =>
            (el.textContent = `${Math.round(counter.val)}${suffix}`),
        });
      });

      const nodes = gsap.utils.toArray(".story-node");
      if (reduce) {
        if (threadRef.current) threadRef.current.style.transform = "scaleY(1)";
        nodes.forEach((n) => n.classList.add("is-active"));
        return;
      }

      if (threadRef.current) {
        gsap.fromTo(
          threadRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".story-thread",
              start: "top 65%",
              end: "bottom 70%",
              scrub: 0.6,
            },
          },
        );
      }
      nodes.forEach((node) => {
        ScrollTrigger.create({
          trigger: node,
          start: "top 72%",
          onEnter: () => node.classList.add("is-active"),
          onLeaveBack: () => node.classList.remove("is-active"),
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-28 px-6 bg-white overflow-hidden"
    >
      <style>{`
        .story-node-dot { transition: background-color .5s cubic-bezier(.16,1,.3,1), border-color .5s, box-shadow .5s, transform .5s cubic-bezier(.16,1,.3,1); }
        .story-node-label, .story-node-text { transition: color .5s ease; }
        .story-node.is-active .story-node-dot { background:#FCA311; border-color:#FCA311; transform:scale(1.06); box-shadow:0 10px 30px rgba(252,163,17,.4); }
        .story-node.is-active .story-node-num { color:#fff; }
        .story-node.is-active .story-node-label { color:#000; }
        .story-node.is-active .story-node-text { color:rgba(0,0,0,.62); }
      `}</style>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/8 to-transparent" />
      <div className="max-w-3xl mx-auto">
        <Motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-amber-500 text-[11px] font-black tracking-widest uppercase mb-4">
            Our Story
          </p>
          <h2
            className="font-black text-black tracking-[-0.03em] leading-[0.95]"
            style={{ fontSize: "clamp(34px, 6vw, 62px)" }}
          >
            From <span className="text-black/30">isolation</span>
            <br />
            to{" "}
            <span className="relative whitespace-nowrap">
              belonging
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 200 10"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 7C40 3 160 3 198 7"
                  stroke="#FCA311"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h2>
          <p className="text-black/40 text-lg mt-6 max-w-xl font-medium">
            We've been there. Four moments turned a problem we lived into the
            platform we built.
          </p>
        </Motion.div>

        {/* Connected thread — the journey from isolation (grey) to belonging (amber) */}
        <div className="story-thread relative pl-16 sm:pl-20">
          <div
            className="absolute left-[27px] sm:left-[31px] top-3 bottom-3 w-[2px] bg-black/[0.07] rounded-full"
            aria-hidden="true"
          />
          <div
            ref={threadRef}
            className="absolute left-[27px] sm:left-[31px] top-3 bottom-3 w-[2px] rounded-full origin-top"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.18), #FCA311 55%, #E89310)",
            }}
            aria-hidden="true"
          />

          <div className="space-y-14">
            {storyChapters.map((ch, i) => (
              <Motion.div
                key={ch.label}
                className="story-node relative"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5 }}
              >
                <div
                  className="story-node-dot absolute -left-16 sm:-left-20 top-0 w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-white border-2 border-black/10 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="story-node-num font-black text-black/25 tabular-nums text-[15px] sm:text-base">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="story-node-label text-[13px] font-black tracking-[0.12em] uppercase text-amber-500/80">
                  {ch.label}
                </p>
                <p className="story-node-text text-black/45 text-lg leading-relaxed mt-2 font-medium">
                  {ch.text}
                </p>
              </Motion.div>
            ))}
          </div>
        </div>

        {/* Resolution — the belief the journey lands on */}
        <Motion.blockquote
          className="relative mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="block font-black text-amber-300/60 leading-none select-none"
            style={{ fontSize: "clamp(48px, 8vw, 80px)" }}
            aria-hidden="true"
          >
            "
          </span>
          <p className="text-2xl sm:text-3xl font-black text-black tracking-[-0.02em] leading-snug -mt-6 max-w-2xl mx-auto">
            Everyone deserves to find their tribe.
          </p>
          <p className="text-black/35 text-[13px] mt-4 font-bold tracking-widest uppercase">
            What we believe
          </p>
        </Motion.blockquote>

        <Motion.div
          className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-black/8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center group cursor-default">
              <span
                className="block font-black text-amber-400 tabular-nums transition-transform duration-300 group-hover:scale-110"
                style={{ fontSize: "clamp(28px, 4vw, 48px)" }}
                data-stat-count={s.value}
                data-suffix={s.suffix}
              >
                0{s.suffix}
              </span>
              <p className="text-black/35 text-sm font-semibold mt-2">
                {s.label}
              </p>
            </div>
          ))}
        </Motion.div>
      </div>
    </section>
  );
});

// ─── Team ─────────────────────────────────────────────────────────────────────

const TEAM = [
  {
    id: 1,
    name: "Raghad Mohamed",
    focus: "Product & Research",
    init: "RM",
    color: "#FCA311",
    img: "/avatars/raghad.jpg",
  },
  {
    id: 2,
    name: "Youssef Nabil",
    focus: "Frontend & Design",
    init: "YN",
    color: "#14213D",
    img: "/avatars/youssef-nabil.jpg",
  },
  {
    id: 3,
    name: "Hadeer Abdelhady",
    focus: "AI & NLP",
    init: "HA",
    color: "#FCA311",
    img: "/avatars/hadeer.jpg",
  },
  {
    id: 4,
    name: "Abdelrahman Amr",
    focus: "Backend & IoT",
    init: "AA",
    color: "#14213D",
    img: "/avatars/abdelrahman.jpg",
  },
  {
    id: 5,
    name: "Youssef Mohamed",
    focus: "Machine Learning",
    init: "YM",
    color: "#E89310",
    img: "/avatars/youssef-mohammed.jpg",
  },
];

// Drop the founding-team photo here as public/team-photo.jpg.
// Set TEAM_PHOTO_DATE to the real date (e.g. "Oct 2025") to stamp it; leave "" to hide the date.
const TEAM_PHOTO = "/avatars/team-photo.jpg";
const TEAM_PHOTO_DATE = "";

const Team = forwardRef(function Team(_, forwardedRef) {
  const sectionRef = useRef(null);
  const [photoOk, setPhotoOk] = useState(true);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
        return;
      gsap.from(".team-card", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="team" className="py-28 px-6 bg-[#f7f7f5]">
      <div className="max-w-5xl mx-auto">
        <Motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-amber-500 text-[11px] font-black tracking-widest uppercase mb-4">
            People
          </p>
          <h2
            className="font-black text-black tracking-[-0.03em]"
            style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
          >
            Meet the team.
          </h2>
          <p className="text-black/40 text-lg mt-4 font-medium">
            Five students who lived the problem, then built the fix.
          </p>
        </Motion.div>

        {photoOk && (
          <Motion.figure
            className="relative max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-[24px] ring-1 ring-black/[0.08] shadow-[0_30px_60px_-22px_rgba(20,33,61,0.4)]">
              <img
                src={TEAM_PHOTO}
                alt="The CampusSync team at their first meeting"
                onError={() => setPhotoOk(false)}
                className="w-full aspect-[16/10] object-cover [filter:grayscale(0.22)_contrast(1.04)]"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-2/3 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to top, rgba(20,33,61,0.82), rgba(20,33,61,0.05) 70%, transparent)",
                }}
                aria-hidden="true"
              />
              <figcaption className="absolute inset-x-5 bottom-4 flex items-end justify-between gap-4 sm:inset-x-7 sm:bottom-5">
                <span className="text-white/90 text-[13px] sm:text-[15px] font-bold leading-snug max-w-sm">
                  Where it started — the five of us, the day we decided to build
                  it.
                </span>
                <span className="shrink-0 flex items-center gap-2 text-amber-300 text-[10px] font-black tracking-[0.18em] uppercase whitespace-nowrap">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-amber-400"
                    aria-hidden="true"
                  />
                  First Discussion
                  {TEAM_PHOTO_DATE ? ` · ${TEAM_PHOTO_DATE}` : ""}
                </span>
              </figcaption>
            </div>
          </Motion.figure>
        )}
      </div>
    </section>
  );
});

// ─── CTA ──────────────────────────────────────────────────────────────────────

const CTA_FACES = [
  { src: "/avatars/raghad.jpg", init: "RM", bg: "#FCA311" },
  { src: "/avatars/youssef-nabil.jpg", init: "YN", bg: "#E89310" },
  { src: "/avatars/abdelrahman.jpg", init: "AA", bg: "#FCA311" },
  { src: "/avatars/hadeer.jpg", init: "HA", bg: "#E89310" },
  { src: "/avatars/youssef-mohammed.jpg", init: "YM", bg: "#FCA311" },
];

function CTA() {
  const sectionRef = useRef(null);
  useGSAP(
    () => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
        return;
      gsap.from(".cta-inner", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 0.7,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 bg-[#14213D] overflow-hidden"
    >
      <style>{`
        @keyframes ctaSeatPulse { 0%,100%{ box-shadow:0 0 0 0 rgba(252,163,17,.45);} 50%{ box-shadow:0 0 0 9px rgba(252,163,17,0);} }
        .cta-seat{ animation: ctaSeatPulse 2.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce){ .cta-seat{ animation:none; } }
      `}</style>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 42%, rgba(252,163,17,0.16) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(252,163,17,0.4), transparent)",
        }}
      />

      <div className="cta-inner relative z-10 max-w-3xl mx-auto text-center">
        {/* The circle you're invited to complete — real faces, one open seat */}
        <div className="flex items-center justify-center mb-9">
          <div className="flex -space-x-3.5">
            {CTA_FACES.map((f) => (
              <div
                key={f.init}
                className="relative w-12 h-12 rounded-full ring-[3px] ring-[#14213D] overflow-hidden shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
                style={{ background: f.bg }}
              >
                <span className="absolute inset-0 flex items-center justify-center text-[12px] font-black text-white/95">
                  {f.init}
                </span>
                <img
                  src={f.src}
                  alt=""
                  loading="lazy"
                  onError={(e) => (e.currentTarget.style.opacity = "0")}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="cta-seat relative w-12 h-12 rounded-full ring-[3px] ring-[#14213D] border-2 border-dashed border-amber-400 bg-amber-400/10 flex items-center justify-center">
              <span className="text-amber-300 text-[10px] font-black tracking-wide uppercase">
                You
              </span>
            </div>
          </div>
        </div>

        <p className="text-amber-400 text-[11px] font-black tracking-widest uppercase mb-6">
          One seat open
        </p>
        <h2
          className="font-black text-white tracking-[-0.04em] leading-[1.0] mb-8"
          style={{ fontSize: "clamp(36px, 6vw, 72px)" }}
        >
          Your people are
          <br />
          already here.
        </h2>
        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto font-medium leading-relaxed">
          Create your profile and we'll match you with the students who share
          your major, your goals, and your way of working.
        </p>
        <Link
          to="/signup"
          className="group inline-flex items-center gap-2.5 bg-amber-400 text-[#14213D] px-10 py-4 rounded-full text-[16px] font-black transition-all duration-300 shadow-[0_8px_32px_rgba(252,163,17,0.3)] hover:shadow-[0_14px_48px_rgba(252,163,17,0.5)] hover:bg-amber-300 hover:-translate-y-1"
        >
          Create your profile
          <ArrowRight
            className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={3}
          />
        </Link>
        <p className="text-white/25 text-[12px] font-semibold mt-5">
          Free to join — no card needed
        </p>
      </div>
    </section>
  );
}

// ─── Landing ──────────────────────────────────────────────────────────────────

function Landing() {
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar ref={navRef} />
      <Hero ref={heroRef} />
      <Marquee />
      <HowItWorksSection ref={featuresRef} />
      <Story ref={storyRef} />
      <Team ref={teamRef} />
      <CTA />
      <Footer />
    </div>
  );
}

export default Landing;
