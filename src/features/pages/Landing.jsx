import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Footer from "../../components/Footer";
import NodesBackground from "../../components/NodesBackground";
import HowItWorksSection from "./HowItWorksSection";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Simple icon components using inline SVGs
const MenuIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
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
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Navbar Component
const Navbar = forwardRef(function Navbar(_, forwardedRef) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navRef = useRef(null);

  useImperativeHandle(forwardedRef, () => navRef.current);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
        y: -18,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
        delay: 0.2,
      });
    },
    { scope: navRef },
  );

  const isLight = isScrolled;
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white/255 transition-all duration-300 ease-out"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          <Link
            to="/"
            className="landing-nav-link flex items-center gap-2.5"
            aria-label="CampusSync home"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm tracking-tight transition-colors duration-150 ${
                isLight
                  ? "bg-slate-900 text-amber-400"
                  : "bg-white/15 text-amber-400 border border-white/20"
              }`}
            >
              CS
            </div>
            <span
              className={`hidden sm:inline text-[15px] font-semibold tracking-tight transition-colors duration-200 ${
                isLight ? "text-slate-900" : "text-white"
              }`}
            >
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
                className={`relative landing-nav-link text-[15px] font-medium px-4 py-2.5 rounded-full transition-colors duration-150 ${
                  isLight
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
              >
                <span className="relative z-10">{link.label}</span>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }}
                  className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-0 origin-center"
                  transition={{
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/login"
              className={`hidden sm:inline-block text-[15px] font-medium px-4 py-2.5 rounded-full transition-colors duration-150 ${
                isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/80 hover:text-white"
              }`}
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-[15px] font-semibold px-5 py-2.5 rounded-full bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors duration-150 shrink-0"
            >
              Sign up
            </Link>
            <button
              type="button"
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className={`md:hidden p-2.5 rounded-xl transition-colors duration-150 ${
                isLight
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-white/80 hover:text-white"
              }`}
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
          <div
            className={`md:hidden -mx-4 mt-0 px-4 pt-4 pb-6 rounded-b-2xl border-t transition-colors duration-300 ${
              isLight
                ? "bg-white border-slate-200"
                : "bg-slate-900 border-white/10"
            }`}
          >
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`landing-nav-link block text-[15px] font-medium py-3.5 px-4 rounded-xl transition-colors duration-150 ${
                    isLight
                      ? "text-slate-700 hover:text-slate-900"
                      : "text-white/90 hover:text-white"
                  }`}
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex gap-3 pt-4 mt-2 border-t border-slate-200">
              <Link
                to="/login"
                className={`flex-1 text-center text-[15px] font-medium py-3.5 rounded-xl transition-colors ${
                  isLight
                    ? "border border-slate-200 text-slate-800 hover:bg-slate-50"
                    : "border border-white/20 text-white hover:bg-white/10"
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center text-[15px] font-semibold py-3.5 rounded-xl bg-amber-400 text-slate-900 hover:bg-amber-300 transition-colors"
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

// Hero Component
const Hero = forwardRef(function Hero(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".landing-hero-heading", {
        y: 50,
        opacity: 0,
        duration: 0.8,
      })
        .from(
          ".landing-hero-subheading",
          { y: 30, opacity: 0, duration: 0.6 },
          "-=0.45",
        )
        .from(
          ".landing-hero-paragraph",
          { y: 30, opacity: 0, duration: 0.6 },
          "-=0.35",
        )
        .from(".landing-hero-cta", {
          y: 16,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative bg-slate-950 pt-28 lg:pt-36 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <NodesBackground
        className="opacity-100"
        maxNodes={32}
        connectRadius={160}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/40 pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950 pointer-events-none"
        aria-hidden
      />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <div className="space-y-8">
            <div className="space-y-3">
              <h1 className="landing-hero-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                CampusSync
              </h1>
              <h2 className="landing-hero-subheading text-xl sm:text-2xl font-medium text-amber-200/90 tracking-tight">
                Where Learning Meets Belonging
              </h2>
            </div>

            <p className="landing-hero-paragraph text-base sm:text-lg text-slate-300 leading-relaxed max-w-lg">
              <span className="font-semibold text-white/95">
                "I don't belong, and meeting people who are like me is just too
                hard!"
              </span>
              <br />
              <br />
              We get it. Campus life can feel isolating. Finding your people
              shouldn't feel like an impossible mission. CampusSync connects you
              with students who share your interests, values, and academic
              goals—making it easy to build genuine friendships and form
              meaningful project teams.
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 opacity-100">
              <Link
                to="/signup"
                className="landing-hero-cta group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 px-6 py-4 rounded-full text-[15px] font-semibold tracking-tight hover:from-amber-300 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-950 transition-all duration-300 shadow-[0_0_0_1px_rgba(251,191,36,0.2),0_4px_24px_-4px_rgba(251,191,36,0.35)] hover:shadow-[0_0_0_1px_rgba(251,191,36,0.3),0_8px_32px_-4px_rgba(251,191,36,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_0_0_1px_rgba(251,191,36,0.2)]"
              >
                Get started
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                  strokeWidth={2.25}
                />
              </Link>
              <span
                className="hidden sm:inline w-px h-6 bg-white/20 rounded-full"
                aria-hidden
              />
              <div className="flex flex-row gap-6 sm:gap-8">
                <a
                  href="#features"
                  className="landing-hero-cta inline-flex items-center justify-center text-white/90 text-[15px] font-medium hover:text-white transition-colors py-2.5 sm:py-3"
                >
                  Explore
                </a>
                <a
                  href="#contact"
                  className="landing-hero-cta inline-flex items-center justify-center text-white/90 text-[15px] font-medium hover:text-white transition-colors py-2.5 sm:py-3"
                >
                  Contact us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Story Component
const storyChapters = [
  {
    label: "The Problem",
    text: "As first-year college students, we faced a harsh reality—the campus felt enormous, and despite being surrounded by thousands of students, finding people who truly understood us seemed impossible. The traditional ways of meeting people weren't cutting it. We felt isolated.",
  },
  {
    label: "The Struggle",
    text: "When project time came around, it was even worse. We either worked with classmates we barely knew or desperately hoped for compatible teammates. Many of us found ourselves in groups with incompatible styles, misaligned goals, and poor communication—leading to wasted potential.",
  },
  {
    label: "The Realization",
    text: "We believed there had to be a better way. What if there was a platform that truly understood us? One that intelligently matched us with students who shared our values, interests, and goals? That's when CampusSync was born.",
  },
  {
    label: "Our Mission",
    text: "We're building a community where every student can find their people, build lasting friendships, and collaborate on projects that matter. When you're surrounded by the right people, belonging stops being a struggle and becomes your reality.",
  },
];

const stats = [
  { value: 1000, suffix: "+", label: "Students Connected" },
  { value: 500, suffix: "+", label: "Teams Formed" },
  { value: 50, suffix: "+", label: "Universities" },
];

const Story = forwardRef(function Story(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      const statsEl = sectionRef.current?.querySelectorAll("[data-stat-count]");
      if (!statsEl?.length) return;
      statsEl.forEach((el) => {
        const value = parseInt(el.dataset.statCount || "0", 10);
        const suffix = el.dataset.suffix || "";
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          duration: 1.4,
          ease: "power1.out",
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-3">
            Our Story
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
            From isolation to belonging
          </h2>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl">
            We've been there. Here's why we built CampusSync.
          </p>
        </motion.div>

        {/* Pull quote */}
        <motion.blockquote
          className="relative my-16 lg:my-24 pl-6 border-l-4 border-amber-400"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed italic">
            "Everyone deserves to find their tribe."
          </p>
          <p className="text-slate-500 text-sm mt-3">— What we believe</p>
        </motion.blockquote>

        {/* Chapters */}
        <div className="space-y-12 lg:space-y-16">
          {storyChapters.map((chapter, i) => (
            <motion.div
              key={chapter.label}
              className="group"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">
                {String(i + 1).padStart(2, "0")} — {chapter.label}
              </span>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-2">
                {chapter.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          className="text-slate-700 text-lg font-medium mt-16 lg:mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          Today, CampusSync is more than an app—it's a movement to make campus
          life feel less isolating and more inclusive.
        </motion.p>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-3 gap-6 lg:gap-8 mt-20 pt-16 border-t border-slate-200"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span
                className="block text-3xl sm:text-4xl font-bold text-amber-500 tabular-nums"
                data-stat-count={stat.value}
                data-suffix={stat.suffix}
              >
                0{stat.suffix}
              </span>
              <p className="text-slate-500 text-sm font-medium mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

// Team Component
const teamMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Team Lead & Co-Founder",
    image: "/professional-portrait.png",
  },
  {
    id: 2,
    name: "Maria Chen",
    role: "AI Engineer",
    image: "/professional-portrait.png",
  },
  {
    id: 3,
    name: "Jordan Smith",
    role: "Product Manager",
    image: "/professional-portrait.png",
  },
  {
    id: 4,
    name: "Priya Patel",
    role: "Backend Lead",
    image: "/professional-portrait.png",
  },
  {
    id: 5,
    name: "Marcus Williams",
    role: "Community Lead",
    image: "/professional-portrait.png",
  },
];

const Team = forwardRef(function Team(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.from(".landing-team-card", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
      });
      gsap.from(".landing-team-highlight", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
        scale: 0.9,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="team"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#14213D] mb-4">
            Meet Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            The passionate people behind CampusSync, dedicated to making campus
            feel like home
          </p>
        </div>

        <div className="flex flex-col items-center gap-16">
          <div className="flex justify-center gap-16 flex-wrap max-w-2xl">
            {teamMembers.slice(0, 2).map((member) => (
              <div
                key={member.id}
                className="landing-team-card group text-center"
              >
                <div className="landing-team-highlight relative mb-6 overflow-hidden rounded-full shadow-lg w-40 h-40 mx-auto bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-semibold">
                      View Profile
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#14213D]">
                    {member.name}
                  </h3>
                  <p className="text-[#FCA311] font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-16 flex-wrap max-w-3xl">
            {teamMembers.slice(2).map((member) => (
              <div
                key={member.id}
                className="landing-team-card group text-center"
              >
                <div className="landing-team-highlight relative mb-6 overflow-hidden rounded-full shadow-lg w-40 h-40 mx-auto bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
                  <span className="text-6xl">👤</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#14213D] to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <span className="text-white font-semibold">
                      View Profile
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[#14213D]">
                    {member.name}
                  </h3>
                  <p className="text-[#FCA311] font-medium">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

// Main Landing Page Component
function Landing() {
  const navRef = useRef(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const storyRef = useRef(null);
  const teamRef = useRef(null);

  return (
    <div className="min-h-screen bg-white">
      <Navbar ref={navRef} />
      <Hero ref={heroRef} />
      <HowItWorksSection ref={featuresRef} />
      <Story ref={storyRef} />
      <Team ref={teamRef} />
      <Footer />
    </div>
  );
}

export default Landing;
