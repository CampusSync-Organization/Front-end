import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, X, User, Settings, LogOut } from "lucide-react";
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

  useEffect(() => setMobileOpen(false), [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
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
    { label: "Events & Communities", to: "/events-communities" },
    { label: "Profile", to: "/Profile-Page" },
    { label: "Chat", to: "/Chat-Main-Page" },
  ];

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const linkClass = (to) => {
    const active = location.pathname === to;
    return `text-[14px] font-medium transition-colors duration-200 px-3 py-2 rounded-lg ${
      active
        ? "text-primary bg-primary/10"
        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
    }`;
  };

  const navBarClass = `fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-out ${
    isScrolled
      ? "bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_3px_rgba(15,23,42,0.04)]"
      : "bg-white/70 backdrop-blur-lg border-b border-slate-200/40"
  }`;

  return (
    <nav className={navBarClass}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo – same as landing */}
          <Link
            to="/"
            className="flex items-center gap-3 text-slate-800 hover:opacity-90 transition-opacity group"
          >
            <div className="relative w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_2px_6px_rgba(20,33,61,0.12)] group-hover:shadow-[0_3px_10px_rgba(20,33,61,0.18)] transition-shadow duration-200">
              <span className="text-white font-bold text-xs tracking-tighter">CS</span>
            </div>
            <span className="hidden sm:inline text-[15px] font-semibold text-slate-800 tracking-tight">
              CampusSync
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {appLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={linkClass(link.to)}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: notifications + user */}
          <div className="hidden md:flex items-center gap-1">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors duration-200"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {NOTIFICATION_COUNT > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-primary text-[10px] font-bold">
                    {NOTIFICATION_COUNT}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-1 w-72 rounded-xl border border-slate-200 bg-white py-2 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.15)]">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-800 border-b border-slate-100">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <button type="button" className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <p>New event: AI Workshop 2025</p>
                      <p className="text-xs text-slate-500 mt-0.5">2 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <p>You joined Data Science Club</p>
                      <p className="text-xs text-slate-500 mt-0.5">5 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                      <p>Reminder: Hackathon starts tomorrow</p>
                      <p className="text-xs text-slate-500 mt-0.5">1 day ago</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-colors duration-200"
                aria-label="User menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold shadow-[0_2px_6px_rgba(20,33,61,0.2)]">
                  {user ? getInitials(user.name) : "?"}
                </span>
                <span className="text-[14px] font-medium text-slate-700 max-w-[100px] truncate hidden lg:block">
                  {user ? user.name.split(" ")[0] : ""}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-[0_10px_40px_-10px_rgba(15,23,42,0.15)]">
                  <div className="border-b border-slate-100 px-3 py-2.5">
                    <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <Link
                    to="/Profile-Page"
                    className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="my-1 h-px bg-slate-100" />
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    onClick={() => {
                      dispatch(clearUser());
                      setUserMenuOpen(false);
                      navigate("/", { replace: true });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors duration-200"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu – same style as landing */}
        {isMobileOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur-sm -mx-4 px-4 pt-3 pb-5 rounded-b-2xl shadow-lg">
            <div className="flex flex-col gap-0.5 pt-1">
              {appLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block text-[15px] font-medium py-3 px-3 rounded-xl transition-colors ${
                    location.pathname === link.to
                      ? "text-primary bg-primary/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-4 mt-2 border-t border-slate-100 py-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white text-sm font-semibold shadow-[0_2px_6px_rgba(20,33,61,0.2)]">
                {user ? getInitials(user.name) : "?"}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              type="button"
              className="w-full text-[15px] font-medium text-red-600 py-3 rounded-xl border border-red-200 hover:bg-red-50 transition-colors"
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
