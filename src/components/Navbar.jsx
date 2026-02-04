import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, X, User, Settings, LogOut } from "lucide-react";

const MOCK_USER = { name: "Alex Johnson", role: "admin" };
const NOTIFICATION_COUNT = 3;

export default function Navbar() {
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const userRef = useRef(null);
  const location = useLocation();

  useEffect(() => setMobileOpen(false), [location.pathname]);

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

  const linkClass = (to) =>
    `text-sm font-medium transition-colors ${
      location.pathname === to
        ? "text-secondary"
        : "text-white/80 hover:text-white"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/10 bg-primary shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
              <span className="text-base font-bold text-primary">CS</span>
            </div>
            <span className="hidden text-lg font-bold text-white sm:inline">
              CampusSync
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-1">
            {appLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg transition-colors ${linkClass(link.to)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-2">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white transition-colors"
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
                <div className="absolute right-0 mt-1 w-72 rounded-lg border border-border bg-white py-2 shadow-lg">
                  <div className="px-3 py-2 text-sm font-semibold text-foreground border-b border-border">
                    Notifications
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <button type="button" className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted">
                      <p>New event: AI Workshop 2025</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted">
                      <p>You joined Data Science Club</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </button>
                    <button type="button" className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted">
                      <p>Reminder: Hackathon starts tomorrow</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={userRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                aria-label="User menu"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-medium text-primary">
                  {getInitials(MOCK_USER.name)}
                </span>
                <span className="text-sm max-w-[100px] truncate hidden lg:block">
                  {MOCK_USER.name.split(" ")[0]}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-1 w-56 rounded-lg border border-border bg-white py-2 shadow-lg">
                  <div className="border-b border-border px-3 py-2">
                    <p className="text-sm font-medium text-foreground">{MOCK_USER.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{MOCK_USER.role}</p>
                  </div>
                  <Link
                    to="/Profile-Page"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </button>
                  <div className="my-1 h-px bg-border" />
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isMobileOpen && (
          <div className="border-t border-white/10 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-1">
              {appLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`rounded-lg px-4 py-3 ${linkClass(link.to)}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-medium text-primary">
                {getInitials(MOCK_USER.name)}
              </span>
              <div>
                <p className="text-sm font-medium text-white">{MOCK_USER.name}</p>
                <p className="text-xs text-white/60 capitalize">{MOCK_USER.role}</p>
              </div>
            </div>
            <div className="mt-2 flex gap-2">
              <Link
                to="/login"
                className="flex-1 rounded-lg border border-white/30 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10"
                onClick={() => setMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 rounded-lg bg-secondary py-2.5 text-center text-sm font-medium text-primary hover:bg-secondary/90"
                onClick={() => setMobileOpen(false)}
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
