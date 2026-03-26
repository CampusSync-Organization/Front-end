import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
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

const MenuIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Navbar = forwardRef(function Navbar(_, forwardedRef) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const navRef = useRef(null);

  useImperativeHandle(forwardedRef, () => navRef.current);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(() => {
    if (!navRef.current) return;
    gsap.from(navRef.current, { y: -60, opacity: 0, duration: 0.8, ease: "power3.out" });
    gsap.from(".landing-nav-link", { opacity: 0, y: -18, duration: 0.6, ease: "power3.out", stagger: 0.08, delay: 0.2 });
  }, { scope: navRef });

  const isLight = true;
  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Features", href: "#features" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <nav ref={navRef} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm ${isScrolled ? "py-1" : "py-2"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          <Link to="/" className="landing-nav-link flex items-center gap-2.5">
            <img src="/campussync-icon.png" alt="CampusSync" className="h-8 w-auto object-contain" />
            <span className={`hidden sm:inline text-[17px] font-semibold tracking-tight ${isLight ? "text-amber-500" : "text-amber-400"}`}>CampusSync</span>
          </Link>

          <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} onMouseEnter={() => setHoveredLink(link.label)} className={`relative landing-nav-link text-[15px] font-medium px-4 py-2.5 rounded-full transition-colors duration-150 ${isLight ? "text-slate-900" : "text-white"}`}>
                <span className="relative z-10">{link.label}</span>
                <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: hoveredLink === link.label ? 1 : 0 }} className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] z-0 origin-center" transition={{ type: "spring", stiffness: 120, damping: 20 }} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link to="/login" className="hidden sm:inline-block text-[15px] font-medium px-4 py-2.5 rounded-full text-slate-900">Sign in</Link>
            <Link to="/signup" className="text-[15px] font-semibold px-5 py-2.5 rounded-full bg-amber-400 text-slate-900 transition-colors hover:bg-amber-300">Sign up</Link>
            <button type="button" className="md:hidden p-2.5 text-slate-900" onClick={() => setIsMobileOpen(!isMobileOpen)}>
              {isMobileOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileOpen && (
          <div className="md:hidden -mx-4 mt-0 px-4 pt-4 pb-6 rounded-b-2xl border-t bg-white border-slate-200">
            <div className="flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <a key={link.label} href={link.href} className="block text-[15px] font-medium py-3.5 px-4 rounded-xl text-slate-700" onClick={() => setIsMobileOpen(false)}>{link.label}</a>
              ))}
            </div>
            <div className="flex gap-3 pt-4 mt-2 border-t border-slate-200">
              <Link to="/login" className="flex-1 text-center text-[15px] font-medium py-3.5 rounded-xl border border-slate-200 text-slate-800" onClick={() => setIsMobileOpen(false)}>Sign in</Link>
              <Link to="/signup" className="flex-1 text-center text-[15px] font-semibold py-3.5 rounded-xl bg-amber-400 text-slate-900" onClick={() => setIsMobileOpen(false)}>Sign up</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
});

const Hero = forwardRef(function Hero(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from(".landing-hero-heading", { y: 30, opacity: 0, duration: 0.8 })
      .from(".landing-hero-paragraph", { y: 20, opacity: 0, duration: 0.6 }, "-=0.5")
      .from(".landing-hero-cta", { y: 16, opacity: 0, duration: 0.5, stagger: 0.1 }, "-=0.4");
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="home" className="relative w-full min-h-screen bg-[#fafafa] flex flex-col xl:flex-row overflow-hidden pt-16 sm:pt-20">
      <div className="w-full xl:w-[45%] h-full min-h-[60vh] flex flex-col justify-center px-6 sm:px-12 lg:px-20 xl:px-28 z-10 pt-16 xl:pt-0 pb-12 xl:pb-0">
        
        <h1 className="landing-hero-heading text-[52px] sm:text-[76px] lg:text-[84px] xl:text-[96px] font-black text-[#0f172a] leading-[1.05] tracking-tight mb-8 max-w-[800px]">
          Where Learning <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
            Meets Belonging
          </span>
        </h1>

        <div className="landing-hero-paragraph max-w-xl mb-12">
          <p className="text-lg sm:text-[20px] text-slate-400 font-bold italic border-l-4 border-amber-400 pl-4 mb-5">
            "I don't belong, and meeting people who are like me is just too hard!"
          </p>
          <p className="text-base sm:text-lg text-slate-500 font-medium leading-[1.6]">
            <strong className="text-slate-700">We get it.</strong> Campus life can feel isolating. Finding your people shouldn't feel like an impossible mission. CampusSync connects you with students who share your interests, values, and academic goals—making it easy to build genuine friendships and form meaningful project teams.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 landing-hero-cta">
          <Link to="/signup" className="group relative inline-flex items-center justify-center bg-slate-900 text-white px-10 py-5 rounded-2xl text-[17px] font-bold tracking-wide transition-all shadow-[0_12px_24px_-8px_rgba(0,0,0,0.5)] hover:shadow-xl hover:-translate-y-1 hover:bg-slate-800 w-full sm:w-auto">
            Join the Network
            <ArrowRight className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      <div className="w-full xl:w-[55%] h-full min-h-[500px] xl:absolute xl:right-0 xl:top-0 xl:bottom-0 flex items-center justify-center p-4 sm:p-8 xl:p-12 mb-12 xl:mb-0">
        
        <div className="relative w-full max-w-[1000px] h-[500px] sm:h-[600px] xl:h-[85%] max-h-[900px] rounded-[32px] sm:rounded-[48px] bg-[#0B1120] border-[6px] sm:border-[8px] border-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] ring-1 ring-slate-200 overflow-hidden flex flex-col items-center justify-end transform transition-transform duration-700 hover:scale-[1.01] xl:translate-x-8">
          
          <div className="absolute top-6 sm:top-10 left-6 sm:left-10 z-20 flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
             <div className="flex h-2 w-2 relative">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
             </div>
             <span className="text-white/60 text-[10px] sm:text-[11px] font-black tracking-widest uppercase">Campus Engine</span>
          </div>

          <div className="absolute top-0 inset-x-0 h-[60%] bg-gradient-to-b from-amber-500/20 via-orange-500/5 to-transparent pointer-events-none z-10" />

          <NodesBackground className="absolute inset-0 opacity-100 z-0" maxNodes={24} connectRadius={220} />
                  {/* High-Fidelity Floating Social Sync Match Graphic */}
          <div className="relative z-20 w-full px-6 sm:px-12 mb-10 sm:mb-16 flex items-center justify-center gap-4 sm:gap-8">
             
             {/* User 1 Simulated Profile Component */}
             <div className="w-28 sm:w-36 flex flex-col items-center bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                <img src="https://i.pinimg.com/originals/f9/b4/52/f9b4527d55189fe46c2f0ad331832e80.webp" alt="Sarah" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-amber-400/80 mb-3 object-cover object-top shadow-[0_0_15px_rgba(251,191,36,0.2)]" />
                <span className="text-white font-bold text-sm sm:text-[15px]">Sarah</span>
                <span className="text-slate-400 text-[11px] sm:text-xs font-semibold mt-1">AI Major</span>
             </div>

             {/* Dynamic Central Connection Hub */}
             <div className="relative flex items-center justify-center w-16 sm:w-28 shrink-0">
                {/* Horizontal data beam */}
                <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-400 to-amber-500/0 opacity-70" />
                
                {/* Synchronization Badge */}
                <div className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex flex-col items-center justify-center border-4 border-[#0B1120] shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                  <span className="text-white text-[10px] uppercase font-black tracking-widest leading-none mt-1 sm:mt-1.5 opacity-90">Match</span>
                  <span className="text-white text-sm sm:text-[17px] font-black leading-tight">98%</span>
                </div>
             </div>

             {/* User 2 Simulated Profile Component */}
             <div className="w-28 sm:w-36 flex flex-col items-center bg-[#0f172a]/80 backdrop-blur-xl rounded-3xl border border-white/10 p-5 shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                <img src="https://i.pinimg.com/originals/57/c5/cd/57c5cda9b910b6de32d5e16e67259c98.png" alt="Omar" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-amber-400/80 mb-3 object-cover object-center shadow-[0_0_15px_rgba(251,191,36,0.2)]" />
                <span className="text-white font-bold text-sm sm:text-[15px]">Omar</span>
                <span className="text-slate-400 text-[11px] sm:text-xs font-semibold mt-1">CS Major</span>
             </div>

          </div>
        </div>
      </div>
    </section>
  );
});

const storyChapters = [
  { label: "The Problem", text: "As first-year college students, we faced a harsh reality—the campus felt enormous, and despite being surrounded by thousands of students, finding people who truly understood us seemed impossible. The traditional ways of meeting people weren't cutting it." },
  { label: "The Struggle", text: "When project time came around, it was even worse. We either worked with classmates we barely knew or desperately hoped for compatible teammates. Many found themselves in groups with incompatible styles." },
  { label: "The Realization", text: "We believed there had to be a better way. What if there was a platform that truly understood us? One that intelligently matched us with students who shared our values, interests, and goals?" },
  { label: "Our Mission", text: "We're building a community where every student can find their people, build lasting friendships, and collaborate on projects that matter. When you're surrounded by the right people, belonging becomes reality." },
];

const stats = [
  { value: 1000, suffix: "+", label: "Students Connected" },
  { value: 500, suffix: "+", label: "Teams Formed" },
  { value: 50, suffix: "+", label: "Universities" },
];

const Story = forwardRef(function Story(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(() => {
    const statsEl = sectionRef.current?.querySelectorAll("[data-stat-count]");
    if (!statsEl?.length) return;
    statsEl.forEach((el) => {
      const value = parseInt(el.dataset.statCount || "0", 10);
      const suffix = el.dataset.suffix || "";
      const counter = { val: 0 };
      gsap.to(counter, {
        val: value, scrollTrigger: { trigger: el, start: "top 90%", once: true },
        duration: 1.4, ease: "power1.out", onUpdate: () => el.textContent = `${Math.round(counter.val)}${suffix}`
      });
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="about" className="relative py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50/80 to-white" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <div className="relative max-w-4xl mx-auto">
        <motion.div className="mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-amber-500 text-sm font-medium tracking-widest uppercase mb-3">Our Story</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">From isolation to belonging</h2>
          <p className="text-slate-500 text-lg mt-4 max-w-2xl">We've been there. Here's why we built CampusSync.</p>
        </motion.div>

        <motion.blockquote className="relative my-16 lg:my-24 pl-6 border-l-4 border-amber-400" initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
          <p className="text-xl sm:text-2xl font-medium text-slate-800 leading-relaxed italic">"Everyone deserves to find their tribe."</p>
          <p className="text-slate-500 text-sm mt-3">— What we believe</p>
        </motion.blockquote>

        <div className="space-y-12 lg:space-y-16">
          {storyChapters.map((chapter, i) => (
            <motion.div key={chapter.label} className="group" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}>
              <span className="text-amber-500 text-xs font-semibold tracking-widest uppercase">{String(i + 1).padStart(2, "0")} — {chapter.label}</span>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mt-2">{chapter.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="grid grid-cols-3 gap-6 lg:gap-8 mt-20 pt-16 border-t border-slate-200" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <span className="block text-3xl sm:text-4xl font-bold text-amber-500 tabular-nums" data-stat-count={stat.value} data-suffix={stat.suffix}>0{stat.suffix}</span>
              <p className="text-slate-500 text-sm font-medium mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

const teamMembers = [
  { id: 1, name: "Raghad Mohamed", image: "/professional-portrait.png" },
  { id: 2, name: "Youssef Nabil", image: "/professional-portrait.png" },
  { id: 3, name: "Hadeer Abdelhady", image: "/professional-portrait.png" },
  { id: 4, name: "Abdelrahman Amr", image: "/professional-portrait.png" },
  { id: 5, name: "Youssef Mohamed", image: "/professional-portrait.png" },
];

const Team = forwardRef(function Team(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(() => {
    if (!sectionRef.current) return;
    gsap.from(".landing-team-card", { scrollTrigger: { trigger: sectionRef.current, start: "top 80%" }, y: 40, opacity: 0, duration: 0.6, stagger: 0.12, ease: "power3.out" });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} id="team" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#14213D] mb-4">Meet Our Team</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">The passionate people behind CampusSync.</p>
        </div>

        <div className="flex justify-center gap-16 flex-wrap max-w-4xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="landing-team-card group text-center">
              <div className="relative mb-6 overflow-hidden rounded-full shadow-lg w-40 h-40 mx-auto bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
                <span className="text-6xl">👤</span>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#14213D]">{member.name}</h3>
                <p className="text-[#FCA311] font-medium">Team Member</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

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
