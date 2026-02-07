import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X, User, Settings, LogOut, ChevronDown } from "lucide-react";
import { clearUser } from "../features/auth/store/authSlice";

const NOTIFICATION_COUNT = 3;

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = useSelector((state) => state.auth?.user);
  const user = authUser ? { name: authUser.name ?? "User", role: authUser.role ?? "student" } : null;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const appLinks = [
    { label: "Home", to: "/home" },
    { label: "Recommendation", to: "/Recommendation-Page" },
    { label: "Events & Communities", to: "/events-communities" },
    { label: "Chat", to: "/Chat-Main-Page" },
  ];

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const navBarClass = `fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out ${
    isScrolled
      ? "bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]"
      : "bg-white/80 backdrop-blur-lg border-b border-slate-200/40"
  }`;

  return (
    <nav className={navBarClass}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 md:h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 hover:text-slate-700 transition-colors shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#14213D] flex items-center justify-center shadow-[0_2px_8px_rgba(20,33,61,0.15)]">
              <span className="text-[#FCA311] font-bold text-sm tracking-tight">CS</span>
            </div>
            <span className="hidden sm:inline text-[16px] font-semibold text-slate-900 tracking-tight">
              CampusSync
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-0.5">
            {appLinks.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-[14px] font-medium px-4 py-2 rounded-xl transition-colors duration-200 ${
                    active
                      ? "text-[#14213D] bg-slate-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right: notifications + user */}
          <div className="hidden md:flex items-center gap-1 shrink-0">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" strokeWidth={1.75} />
                {NOTIFICATION_COUNT > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#FCA311] text-[#14213D] text-[10px] font-bold px-1">
                    {NOTIFICATION_COUNT}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200/80 bg-white py-1 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)]">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">Notifications</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto py-1">
                    <button type="button" className="w-full px-4 py-3 text-left hover:bg-slate-50/80 transition-colors">
                      <p className="text-sm text-slate-800 font-medium">New event: AI Workshop 2025</p>
                      <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-4 py-3 text-left hover:bg-slate-50/80 transition-colors">
                      <p className="text-sm text-slate-800 font-medium">You joined Data Science Club</p>
                      <p className="text-xs text-slate-500 mt-0.5">5 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-4 py-3 text-left hover:bg-slate-50/80 transition-colors">
                      <p className="text-sm text-slate-800 font-medium">Hackathon starts tomorrow</p>
                      <p className="text-xs text-slate-500 mt-0.5">1 day ago</p>
                    </button>
                  </div>
                  <div className="border-t border-slate-100 px-4 py-2">
                    <button type="button" className="text-xs font-medium text-[#14213D] hover:underline">
                      View all
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative ml-1" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2.5 rounded-xl pl-2 pr-3 py-2 text-slate-700 hover:bg-slate-100 transition-all duration-200"
                aria-label="User menu"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#14213D] text-white text-sm font-semibold shadow-sm">
                  {user ? getInitials(user.name) : "?"}
                </span>
                <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate hidden lg:block">
                  {user ? user.name.split(" ")[0] : ""}
                </span>
                <ChevronDown className={`h-4 w-4 text-slate-500 hidden lg:block transition-transform duration-200 ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200/80 bg-white py-2 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.12)]">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize mt-0.5">{user?.role}</p>
                  </div>
                  <Link
                    to="/Profile-Page"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-slate-400" strokeWidth={1.75} />
                    Settings
                  </button>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      dispatch(clearUser());
                      setUserMenuOpen(false);
                      navigate("/", { replace: true });
                    }}
                  >
                    <LogOut className="h-4 w-4" strokeWidth={1.75} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-slate-200/60 -mx-4 px-4 pt-3 pb-6 bg-white/98 backdrop-blur-md rounded-b-2xl shadow-[0_20px_40px_-10px_rgba(15,23,42,0.1)]">
            <div className="flex flex-col gap-0.5 pt-1">
              {appLinks.map((link) => {
                const active = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block text-[15px] font-medium py-3.5 px-4 rounded-xl transition-colors ${
                      active ? "text-[#14213D] bg-slate-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="flex items-center gap-3 pt-4 mt-3 border-t border-slate-100">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#14213D] text-white text-sm font-semibold shrink-0">
                {user ? getInitials(user.name) : "?"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              className="w-full mt-3 text-[15px] font-medium text-red-600 py-3.5 rounded-xl border border-red-100 hover:bg-red-50 transition-colors"
              onClick={() => {
                dispatch(clearUser());
                setMobileOpen(false);
                navigate("/", { replace: true });
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
