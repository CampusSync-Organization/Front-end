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
// NAVBAR - Apple-style with frosted glass
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
    gsap.from(navRef.current, {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });
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
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 bg-gradient-to-br from-[#FCA311] to-[#E89310] rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-semibold text-xs">CS</span>
            </div>
            <span className="text-[15px] font-semibold text-[#1d1d1f] tracking-tight">
              CampusSync
            </span>
          </Link>

          {/* Desktop Navigation */}
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

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-[13px] text-[#1d1d1f]/80 hover:text-[#1d1d1f] transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-[13px] bg-[#1d1d1f] text-white px-4 py-1.5 rounded-full font-medium hover:bg-[#1d1d1f]/90 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <XIcon className="w-5 h-5 text-[#1d1d1f]" />
            ) : (
              <MenuIcon className="w-5 h-5 text-[#1d1d1f]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
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
              <Link
                to="/login"
                className="flex-1 text-center py-2 text-[#1d1d1f] text-[15px] border border-[#1d1d1f]/20 rounded-full"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center py-2 bg-[#1d1d1f] text-white text-[15px] rounded-full"
              >
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
// HERO - Cinematic Apple-style
// ============================================================================

function Hero() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".hero-eyebrow", { y: 20, opacity: 0, duration: 0.6 })
      .from(".hero-title", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
      .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".hero-cta", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(".hero-scroll", { y: 10, opacity: 0, duration: 0.4 }, "-=0.2");

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-14 pb-20 bg-[#fbfbfd]"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <p className="hero-eyebrow text-[#FCA311] text-sm font-medium tracking-wide uppercase mb-4">
          Student Connection Platform
        </p>

        {/* Main Title */}
        <h1 className="hero-title text-[clamp(44px,8vw,80px)] font-semibold text-[#1d1d1f] leading-[1.05] tracking-[-0.03em] mb-6">
          Where learning meets
          <br />
          <span className="bg-gradient-to-r from-[#FCA311] via-[#E89310] to-[#FCA311] bg-clip-text text-transparent">
            belonging
          </span>
        </h1>

        {/* Subtitle */}
        <p className="hero-subtitle text-[#86868b] text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          CampusSync connects you with students who share your interests, values, and goals. 
          Build genuine friendships. Form meaningful project teams. Find your people.
        </p>

        {/* CTA Buttons */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 bg-[#FCA311] text-white px-8 py-4 rounded-full text-[17px] font-medium hover:bg-[#E89310] transition-all shadow-lg shadow-[#FCA311]/20 hover:shadow-[#FCA311]/30"
          >
            Get started free
            <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 text-[#1d1d1f] px-6 py-4 text-[17px] font-medium hover:text-[#FCA311] transition-colors"
          >
            Learn more
            <ChevronDownIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-6 h-10 rounded-full border-2 border-[#1d1d1f]/20 flex justify-center pt-2">
          <div className="w-1 h-2 bg-[#1d1d1f]/40 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// FEATURES - Bento Grid Layout
// ============================================================================

const features = [
  {
    id: 1,
    title: "Personalized Assessment",
    description: "Answer personalized questions about your interests, major, and values. We find your perfect match.",
    icon: "✨",
    size: "large",
  },
  {
    id: 2,
    title: "AI Matching",
    description: "Our intelligent engine connects you with compatible students.",
    icon: "🎯",
    size: "small",
  },
  {
    id: 3,
    title: "Safe Chat",
    description: "Secure, moderated conversations in a respectful community.",
    icon: "💬",
    size: "small",
  },
  {
    id: 4,
    title: "Build Teams",
    description: "Find collaborators for academic projects and activities. Form teams that work.",
    icon: "👥",
    size: "large",
  },
];

function Features() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from(".features-title", {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
    });

    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: ".features-grid",
        start: "top 85%",
      },
      y: 60,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="features" className="py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="features-title text-[clamp(32px,5vw,48px)] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
            Everything you need to connect
          </h2>
          <p className="text-[#86868b] text-lg mt-4 max-w-xl mx-auto">
            Four powerful features designed to help you find your people
          </p>
        </div>

        {/* Bento Grid */}
        <div className="features-grid grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card group relative overflow-hidden rounded-3xl bg-[#f5f5f7] p-8 transition-all duration-300 hover:bg-[#ebebed] ${
                feature.size === "large" ? "md:col-span-1 min-h-[280px]" : "min-h-[200px]"
              }`}
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* Content */}
              <h3 className="text-[22px] font-semibold text-[#1d1d1f] mb-2">
                {feature.title}
              </h3>
              <p className="text-[#86868b] text-[15px] leading-relaxed max-w-sm">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-[#1d1d1f] flex items-center justify-center">
                  <ArrowIcon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// STORY - Editorial Typography
// ============================================================================

function Story() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from(".story-heading", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40,
      opacity: 0,
      duration: 0.7,
    });

    gsap.from(".story-quote", {
      scrollTrigger: { trigger: ".story-quote", start: "top 85%" },
      y: 30,
      opacity: 0,
      duration: 0.6,
    });

    gsap.from(".story-paragraph", {
      scrollTrigger: { trigger: ".story-content", start: "top 80%" },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.5,
    });

    // Stats counter animation
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
        onUpdate: () => {
          stat.textContent = `${Math.round(counter.val)}${suffix}`;
        },
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="py-32 px-6 bg-[#fbfbfd]">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="story-heading text-center mb-16">
          <p className="text-[#FCA311] text-sm font-medium tracking-wide uppercase mb-4">
            Our Story
          </p>
          <h2 className="text-[clamp(28px,4vw,40px)] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
            Built by students, for students
          </h2>
        </div>

        {/* Pull Quote */}
        <blockquote className="story-quote text-center mb-16">
          <p className="text-[clamp(24px,3.5vw,36px)] font-medium text-[#1d1d1f] leading-snug tracking-tight">
            "I don't belong, and meeting people who are like me is{" "}
            <span className="text-[#FCA311]">just too hard.</span>"
          </p>
          <p className="text-[#86868b] mt-4 text-sm">
            — Every first-year student, at some point
          </p>
        </blockquote>

        {/* Story Content */}
        <div className="story-content space-y-6 text-[17px] text-[#1d1d1f]/80 leading-relaxed">
          <p className="story-paragraph">
            We get it. As first-year students, we faced a harsh reality—the campus felt enormous, 
            and despite being surrounded by thousands, finding people who truly understood us seemed impossible.
          </p>
          <p className="story-paragraph">
            Traditional ways of meeting people weren't cutting it. We felt isolated, like outsiders 
            trying to fit into an overwhelming machine. When project time came, it was even worse.
          </p>
          <p className="story-paragraph">
            That's when we asked: what if there was a platform that truly understood us? One that 
            intelligently matched us with students who shared our values, interests, and goals? 
            <strong className="text-[#1d1d1f]"> That's when CampusSync was born.</strong>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-20 pt-16 border-t border-[#1d1d1f]/10">
          <div className="text-center">
            <div className="text-[clamp(32px,4vw,48px)] font-semibold text-[#FCA311]">
              <span data-count="1000" data-suffix="+">0+</span>
            </div>
            <p className="text-[#86868b] text-sm mt-1">Students Connected</p>
          </div>
          <div className="text-center">
            <div className="text-[clamp(32px,4vw,48px)] font-semibold text-[#FCA311]">
              <span data-count="500" data-suffix="+">0+</span>
            </div>
            <p className="text-[#86868b] text-sm mt-1">Teams Formed</p>
          </div>
          <div className="text-center">
            <div className="text-[clamp(32px,4vw,48px)] font-semibold text-[#FCA311]">
              <span data-count="50" data-suffix="+">0+</span>
            </div>
            <p className="text-[#86868b] text-sm mt-1">Universities</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// TEAM - Premium Cards
// ============================================================================

const teamMembers = [
  { id: 1, name: "Alex Johnson", role: "Co-Founder & Lead", initials: "AJ" },
  { id: 2, name: "Maria Chen", role: "AI Engineer", initials: "MC" },
  { id: 3, name: "Jordan Smith", role: "Product Manager", initials: "JS" },
  { id: 4, name: "Priya Patel", role: "Backend Lead", initials: "PP" },
  { id: 5, name: "Marcus Williams", role: "Community Lead", initials: "MW" },
];

function Team() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    gsap.from(".team-heading", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40,
      opacity: 0,
      duration: 0.7,
    });

    gsap.from(".team-card", {
      scrollTrigger: { trigger: ".team-grid", start: "top 85%" },
      y: 50,
      opacity: 0,
      stagger: 0.08,
      duration: 0.5,
      ease: "power3.out",
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="team" className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="team-heading text-center mb-16">
          <h2 className="text-[clamp(32px,5vw,48px)] font-semibold text-[#1d1d1f] tracking-[-0.02em]">
            Meet the team
          </h2>
          <p className="text-[#86868b] text-lg mt-4">
            The people making campus feel like home
          </p>
        </div>

        {/* Team Grid */}
        <div className="team-grid flex flex-wrap justify-center gap-8">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="team-card group text-center"
            >
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#f5f5f7] to-[#e8e8ed] flex items-center justify-center shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <span className="text-2xl font-semibold text-[#1d1d1f]/60">
                    {member.initials}
                  </span>
                </div>
                {/* Status dot */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#FCA311] rounded-full border-2 border-white" />
              </div>

              {/* Info */}
              <h3 className="text-[17px] font-semibold text-[#1d1d1f]">
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
// CTA Section
// ============================================================================

function CTA() {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.from(".cta-content", {
      scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      y: 40,
      opacity: 0,
      duration: 0.7,
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-[#1d1d1f]">
      <div className="cta-content max-w-3xl mx-auto text-center">
        <h2 className="text-[clamp(32px,5vw,48px)] font-semibold text-white tracking-[-0.02em] mb-6">
          Ready to find your people?
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto">
          Join thousands of students who've already discovered meaningful connections on campus.
        </p>
        <Link
          to="/signup"
          className="group inline-flex items-center gap-2 bg-[#FCA311] text-[#1d1d1f] px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-[#FFB733] transition-all"
        >
          Get started — it's free
          <ArrowIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN LANDING PAGE
// ============================================================================

export default function Landing() {
  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="min-h-screen bg-white antialiased">
      <Navbar />
      <Hero />
      <Features />
      <Story />
      <Team />
      <CTA />
      <Footer />
    </div>
  );
}
