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
    { scope: navRef }
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
      className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md transition-all duration-300 ease-out"
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

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`landing-nav-link text-[15px] font-medium px-4 py-2.5 rounded-full transition-colors duration-150 ${
                  isLight
                    ? "text-slate-600 hover:text-slate-900"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
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
                isLight ? "text-slate-600 hover:text-slate-900" : "text-white/80 hover:text-white"
              }`}
              onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
              {isMobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
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
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.25} />
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
const Story = forwardRef(function Story(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      const paragraphs = gsap.utils.toArray(".landing-story-paragraph");
      paragraphs.forEach((paragraph, index) => {
        gsap.from(paragraph, {
          scrollTrigger: {
            trigger: paragraph,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.05,
          ease: "power3.out",
        });
      });

      const stats = gsap.utils.toArray("[data-stat-count]");
      stats.forEach((stat) => {
        const value = parseInt(stat.dataset.statCount || "0", 10);
        const suffix = stat.dataset.suffix || "";
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
            once: true,
          },
          duration: 1.4,
          ease: "power1.out",
          onUpdate: () => {
            stat.textContent = `${Math.round(counter.val)}${suffix}`;
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
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/50"
    >
      <div className="max-w-3xl mx-auto">
        <div className="space-y-14">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary tracking-tight">
              Our Story
            </h2>
            <div className="h-0.5 w-14 bg-secondary mx-auto rounded-full" />
          </div>

          {/* Story content */}
          <div className="space-y-6 text-base text-slate-600 leading-relaxed">
            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">The Problem:</span>{" "}
              As first-year college students, we faced a harsh reality—the
              campus felt enormous, and despite being surrounded by thousands of
              students, finding people who truly understood us seemed
              impossible. The traditional ways of meeting people (random
              roommates, club fairs, social events) weren't cutting it. We felt
              isolated, like outsiders trying to fit into an overwhelming
              machine.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">
                The Struggle:
              </span>{" "}
              When project time came around, it was even worse. We either had to
              work with classmates we barely knew or desperately hoped for
              compatible teammates. Many of us found ourselves in groups with
              incompatible working styles, misaligned goals, and poor
              communication—all leading to mediocre results and wasted
              potential.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">
                The Realization:
              </span>{" "}
              We believed there had to be a better way. What if there was a
              platform that truly understood us? One that didn't just throw
              random people together, but intelligently matched us with students
              who shared our values, interests, and goals? That's when
              CampusSync was born.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">Our Mission:</span>{" "}
              We're building a community where every student can find their
              people, build lasting friendships, and collaborate on projects
              that matter. We believe that when you're surrounded by the right
              people, belonging stops being a struggle and becomes your reality.
            </p>

            <p className="landing-story-paragraph">
              Today, CampusSync is more than an app—it's a movement to make
              campus life feel less isolating and more inclusive. Because
              everyone deserves to find their tribe.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t-2 border-[#D9D9D9]">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                <span data-stat-count="1000" data-suffix="+">
                  0+
                </span>
              </div>
              <p className="text-gray-600 mt-2">Students Connected</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                <span data-stat-count="500" data-suffix="+">
                  0+
                </span>
              </div>
              <p className="text-gray-600 mt-2">Teams Formed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                <span data-stat-count="50" data-suffix="+">
                  0+
                </span>
              </div>
              <p className="text-gray-600 mt-2">Universities</p>
            </div>
          </div>
        </div>
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
