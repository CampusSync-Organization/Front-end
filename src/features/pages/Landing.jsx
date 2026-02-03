import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
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
function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg"
          : "bg-gradient-to-b from-[#F5F5F5] to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FCA311] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">CS</span>
            </div>
            <span className="text-xl font-bold text-[#14213D] hidden sm:inline">
              CampusSync
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[#14213D] hover:text-[#FCA311] transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="text-[#14213D] font-medium hover:text-[#FCA311] transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="bg-[#FCA311] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#E89310] transition-colors shadow-md hover:shadow-lg"
            >
              Register
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <XIcon className="w-6 h-6 text-[#14213D]" />
            ) : (
              <MenuIcon className="w-6 h-6 text-[#14213D]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileOpen && (
          <div className="md:hidden pb-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-[#14213D] hover:text-[#FCA311] transition-colors py-2"
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-4">
              <Link
                to="/login"
                className="flex-1 text-[#14213D] font-medium border border-[#14213D] py-2 rounded-lg hover:bg-[#14213D] hover:text-white transition-colors text-center"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 bg-[#FCA311] text-white font-medium py-2 rounded-lg hover:bg-[#E89310] transition-colors text-center"
              >
                Register
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Hero Component
function Hero() {
  return (
    <section id="home" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold text-[#14213D] leading-tight">
                CampusSync
              </h1>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[#D9D9D9]">
                Where Learning Meets Belonging
              </h2>
            </div>

            <p className="text-lg text-[#14213D] leading-relaxed max-w-lg">
              <span className="font-semibold">
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

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#features"
                className="bg-[#FCA311] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#E89310] transition-all shadow-lg hover:shadow-xl transform hover:scale-105 text-center"
              >
                Explore
              </a>
              <a
                href="#contact"
                className="border-2 border-[#14213D] text-[#14213D] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#14213D] hover:text-white transition-all text-center"
              >
                Contact me
              </a>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              {/* Decorative shapes */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#FCA311] to-[#E89310] rounded-3xl shadow-2xl opacity-10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#FCA311] rounded-full opacity-20 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#14213D] rounded-full opacity-10 blur-3xl" />

              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4 z-10">
                  <div className="w-32 h-32 mx-auto bg-white rounded-2xl shadow-xl flex items-center justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#FCA311] to-[#E89310] rounded-xl flex items-center justify-center">
                      <span className="text-4xl">👥</span>
                    </div>
                  </div>
                  <p className="text-[#14213D] font-semibold">
                    Join your community
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features Component
const featuresList = [
  {
    id: 1,
    title: "Smart Onboarding",
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

function Features() {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#14213D] mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Three simple steps to find your people and build meaningful
            connections
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-12 top-1/2 -translate-y-1/2 z-10 bg-[#FCA311] text-white p-3 rounded-full hover:bg-[#E89310] transition-all shadow-lg hidden lg:flex items-center justify-center"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-12 top-1/2 -translate-y-1/2 z-10 bg-[#FCA311] text-white p-3 rounded-full hover:bg-[#E89310] transition-all shadow-lg hidden lg:flex items-center justify-center"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>

          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollBehavior: "smooth" }}
          >
            {featuresList.map((feature) => (
              <div key={feature.id} className="flex-shrink-0 w-96 snap-center">
                <div className="bg-gradient-to-br from-white to-[#F5F5F5] rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-[#D9D9D9]">
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      {feature.id === 1 && "📝"}
                      {feature.id === 2 && "🤖"}
                      {feature.id === 3 && "💬"}
                      {feature.id === 4 && "👥"}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-[#14213D] mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                    <div className="mt-6 flex items-center text-[#FCA311] font-semibold hover:gap-2 transition-all">
                      Learn more <span className="ml-2">→</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile scroll indicator */}
        <div className="text-center mt-8 text-gray-500 text-sm lg:hidden">
          ← Swipe to explore →
        </div>
      </div>
    </section>
  );
}

// Story Component
function Story() {
  return (
    <section
      id="about"
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-[#F5F5F5]"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl sm:text-5xl font-bold text-[#14213D]">
              Our Story
            </h2>
            <div className="h-1 w-20 bg-[#FCA311] mx-auto rounded-full" />
          </div>

          {/* Story content */}
          <div className="space-y-6 text-lg text-[#14213D] leading-relaxed">
            <p>
              <span className="font-semibold">The Problem:</span> As first-year
              college students, we faced a harsh reality—the campus felt
              enormous, and despite being surrounded by thousands of students,
              finding people who truly understood us seemed impossible. The
              traditional ways of meeting people (random roommates, club fairs,
              social events) weren't cutting it. We felt isolated, like
              outsiders trying to fit into an overwhelming machine.
            </p>

            <p>
              <span className="font-semibold">The Struggle:</span> When project
              time came around, it was even worse. We either had to work with
              classmates we barely knew or desperately hoped for compatible
              teammates. Many of us found ourselves in groups with incompatible
              working styles, misaligned goals, and poor communication—all
              leading to mediocre results and wasted potential.
            </p>

            <p>
              <span className="font-semibold">The Realization:</span> We
              believed there had to be a better way. What if there was a
              platform that truly understood us? One that didn't just throw
              random people together, but intelligently matched us with students
              who shared our values, interests, and goals? That's when
              CampusSync was born.
            </p>

            <p>
              <span className="font-semibold">Our Mission:</span> We're building
              a community where every student can find their people, build
              lasting friendships, and collaborate on projects that matter. We
              believe that when you're surrounded by the right people, belonging
              stops being a struggle and becomes your reality.
            </p>

            <p>
              Today, CampusSync is more than an app—it's a movement to make
              campus life feel less isolating and more inclusive. Because
              everyone deserves to find their tribe.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t-2 border-[#D9D9D9]">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                1000+
              </div>
              <p className="text-gray-600 mt-2">Students Connected</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                500+
              </div>
              <p className="text-gray-600 mt-2">Teams Formed</p>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-[#FCA311]">
                50+
              </div>
              <p className="text-gray-600 mt-2">Universities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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

function Team() {
  return (
    <section id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
              <div key={member.id} className="group text-center">
                <div className="relative mb-6 overflow-hidden rounded-full shadow-lg w-40 h-40 mx-auto bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
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
              <div key={member.id} className="group text-center">
                <div className="relative mb-6 overflow-hidden rounded-full shadow-lg w-40 h-40 mx-auto bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
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
}

// Main Landing Page Component
function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <Story />
      <Team />
      <Footer />
    </div>
  );
}

export default Landing;
