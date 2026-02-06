import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import NodesBackground from "../../components/NodesBackground";
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

const ChevronLeftIcon = ({ className }) => (
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
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = ({ className }) => (
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
      d="M9 5l7 7-7 7"
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
      setIsScrolled(window.scrollY > 10);
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
      /* Auth links (Sign in / Sign up) are not animated so they stay visible immediately */
    },
    { scope: navRef }
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        isScrolled
          ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
          : "bg-white/70 backdrop-blur-lg border-b border-slate-200/40"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <Link
            to="/"
            className="landing-nav-link flex items-center gap-3 group"
            aria-label="CampusSync home"
          >
            <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(20,33,61,0.12)] group-hover:shadow-[0_3px_10px_rgba(20,33,61,0.18)] transition-shadow duration-200">
              <span className="text-white font-bold text-xs tracking-tighter">
                CS
              </span>
            </div>
            <span className="hidden sm:inline text-[15px] font-semibold text-slate-800 tracking-tight">
              CampusSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="landing-nav-link relative text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-slate-100/80"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth: always visible – no animation so they are never hidden */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="text-[14px] font-medium text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100/80 transition-colors duration-200"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="text-[14px] font-semibold text-slate-900 bg-secondary hover:bg-amber-500 px-4 py-2 rounded-xl transition-all duration-200 shadow-[0_2px_6px_rgba(251,191,36,0.22)] hover:shadow-[0_3px_10px_rgba(251,191,36,0.28)] hover:-translate-y-0.5 shrink-0"
            >
              Sign up
            </Link>
            {/* Mobile Menu Toggle: show only when we need extra nav links */}
            <button
              type="button"
              aria-expanded={isMobileOpen}
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
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

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-sm -mx-4 px-4 pt-3 pb-5 rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-0.5 pt-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="landing-nav-link block text-[15px] font-medium text-slate-600 hover:text-slate-900 py-3 px-3 rounded-xl hover:bg-slate-100/80 transition-colors"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="flex gap-3 pt-4 mt-2 border-t border-slate-100">
              <Link
                to="/login"
                className="flex-1 text-center text-[15px] font-medium text-slate-700 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                onClick={() => setIsMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center text-[15px] font-semibold text-slate-900 py-3 rounded-xl bg-secondary hover:bg-amber-500 shadow-[0_2px_8px_rgba(251,191,36,0.25)] transition-all"
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
          "-=0.45"
        )
        .from(
          ".landing-hero-paragraph",
          { y: 30, opacity: 0, duration: 0.6 },
          "-=0.35"
        )
        .from(
          ".landing-hero-cta",
          { y: 20, opacity: 0, duration: 0.5, stagger: 0.08 },
          "-=0.4"
        );

    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <NodesBackground className="opacity-100" maxNodes={32} connectRadius={160} />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-slate-950/40 pointer-events-none" aria-hidden />
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

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/signup"
                className="landing-hero-cta bg-secondary text-primary px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-amber-400 transition-all shadow-accent hover:shadow-lg hover:shadow-secondary/30 text-center"
              >
                Get started
              </Link>
              <a
                href="#features"
                className="landing-hero-cta border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all text-center"
              >
                Explore
              </a>
              <a
                href="#contact"
                className="landing-hero-cta border-2 border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold text-base hover:bg-white/10 hover:border-white/50 transition-all text-center"
              >
                Contact us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

// Features Component
const featuresList = [
  {
    id: 1,
    title: "Personalized Assessment",
    description:
      "Tell us about yourself! Answer personalized questions about your interests, academic major, hobbies, and values. We use this to find your perfect match.",
    image: "/onboarding-form-questionnaire.jpg",
  },
  {
    id: 2,
    title: "AI-Powered Matching",
    description:
      "Our intelligent recommendation engine analyzes your profile and connects you with compatible students based on shared interests and goals.",
    image: "/ai-matching-algorithm-network.jpg",
  },
  {
    id: 3,
    title: "Safe & Moderated Chat",
    description:
      "Connect with your matches through our secure chat platform. Our AI monitors conversations to ensure a safe, respectful community.",
    image: "/chat-messaging-communication.jpg",
  },
  {
    id: 4,
    title: "Build Project Teams",
    description:
      "Find collaborators for your academic projects and extracurricular activities. Form teams that actually work together.",
    image: "/team-collaboration-project.jpg",
  },
];

const Features = forwardRef(function Features(_, forwardedRef) {
  const scrollRef = useRef(null);
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useGSAP(
    () => {
      if (!sectionRef.current) return;

      gsap.from(".landing-features-heading", {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      const cards = gsap.utils.toArray(".landing-feature-card");
      cards.forEach((card, index) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          y: 60,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.08,
          ease: "power3.out",
        });
      });
    },
    { scope: sectionRef }
  );

  useEffect(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const cards = () => Array.from(container.querySelectorAll(".landing-feature-card"));

    const updateScale = () => {
      const containerRect = container.getBoundingClientRect();
      const centerX = containerRect.left + containerRect.width / 2;
      cards().forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(centerX - cardCenter);
        const maxDistance = containerRect.width / 2;
        const scale = gsap.utils.clamp(
          0.94,
          1.05,
          gsap.utils.mapRange(0, maxDistance, 1.05, 0.94, distance)
        );
        gsap.to(card, {
          scale,
          duration: 0.3,
          ease: "power2.out",
        });
      });
    };

    updateScale();
    container.addEventListener("scroll", updateScale, { passive: true });
    window.addEventListener("resize", updateScale);

    return () => {
      container.removeEventListener("scroll", updateScale);
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14 lg:mb-16">
          <h2 className="landing-features-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-3 tracking-tight">
            How It Works
          </h2>
          <p className="text-base text-slate-600 max-w-xl mx-auto">
            Three simple steps to find your people and build meaningful
            connections
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            type="button"
            aria-label="Scroll left"
            className="absolute -left-10 top-1/2 -translate-y-1/2 z-10 bg-white text-primary p-3 rounded-full hover:bg-secondary hover:text-primary border border-slate-200 shadow-soft hidden lg:flex items-center justify-center transition-colors"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            type="button"
            aria-label="Scroll right"
            className="absolute -right-10 top-1/2 -translate-y-1/2 z-10 bg-white text-primary p-3 rounded-full hover:bg-secondary hover:text-primary border border-slate-200 shadow-soft hidden lg:flex items-center justify-center transition-colors"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollBehavior: "smooth" }}
          >
            {featuresList.map((feature) => (
              <div key={feature.id} className="flex-shrink-0 w-[min(100%,22rem)] snap-center px-0.5">
                <div className="landing-feature-card bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-slate-200 transition-all duration-300 overflow-hidden group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <div className="w-full h-full flex items-center justify-center text-5xl opacity-90">
                      {feature.id === 1 && "📝"}
                      {feature.id === 2 && "🤖"}
                      {feature.id === 3 && "💬"}
                      {feature.id === 4 && "👥"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-7 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-primary mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed flex-grow text-sm">
                      {feature.description}
                    </p>
                    <div className="mt-5 flex items-center text-secondary font-semibold text-sm group-hover:gap-2 transition-all">
                      Learn more <span className="ml-1">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <p className="text-center mt-6 text-slate-400 text-sm lg:hidden">
          ← Swipe to explore →
        </p>
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
      const paragraphs = gsap.utils.toArray(
        ".landing-story-paragraph"
      );
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
    { scope: sectionRef }
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
              <span className="font-semibold text-slate-800">The Problem:</span> As first-year
              college students, we faced a harsh reality—the campus felt
              enormous, and despite being surrounded by thousands of students,
              finding people who truly understood us seemed impossible. The
              traditional ways of meeting people (random roommates, club fairs,
              social events) weren't cutting it. We felt isolated, like
              outsiders trying to fit into an overwhelming machine.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">The Struggle:</span> When project
              time came around, it was even worse. We either had to work with
              classmates we barely knew or desperately hoped for compatible
              teammates. Many of us found ourselves in groups with incompatible
              working styles, misaligned goals, and poor communication—all
              leading to mediocre results and wasted potential.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">The Realization:</span> We
              believed there had to be a better way. What if there was a
              platform that truly understood us? One that didn't just throw
              random people together, but intelligently matched us with students
              who shared our values, interests, and goals? That's when
              CampusSync was born.
            </p>

            <p className="landing-story-paragraph">
              <span className="font-semibold text-slate-800">Our Mission:</span> We're building
              a community where every student can find their people, build
              lasting friendships, and collaborate on projects that matter. We
              believe that when you're surrounded by the right people, belonging
              stops being a struggle and becomes your reality.
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
    { scope: sectionRef }
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
              <div key={member.id} className="landing-team-card group text-center">
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
              <div key={member.id} className="landing-team-card group text-center">
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
      <Features ref={featuresRef} />
      <Story ref={storyRef} />
      <Team ref={teamRef} />
      <Footer />
    </div>
  );
}

export default Landing;
