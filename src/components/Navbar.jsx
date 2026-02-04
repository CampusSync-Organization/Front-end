import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

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

export default function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const appLinks = [
    { label: "Home", to: "/home" },
    { label: "Profile", to: "/Profile-Page" },
    { label: "Chat", to: "/Chat-Main-Page" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FCA311]">
              <span className="text-lg font-bold text-white">CS</span>
            </div>
            <span className="hidden text-xl font-bold text-[#14213D] sm:inline">
              CampusSync
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {appLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? "text-[#FCA311]"
                    : "text-[#14213D] hover:text-[#FCA311]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex md:items-center md:gap-4">
            <Link
              to="/login"
              className="font-medium text-[#14213D] transition-colors hover:text-[#FCA311]"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="rounded-lg bg-[#FCA311] px-6 py-2 font-medium text-white shadow-md transition-colors hover:bg-[#E89310] hover:shadow-lg"
            >
              Register
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle menu"
          >
            {isMobileOpen ? (
              <XIcon className="h-6 w-6 text-[#14213D]" />
            ) : (
              <MenuIcon className="h-6 w-6 text-[#14213D]" />
            )}
          </button>
        </div>

        {isMobileOpen && (
          <div className="space-y-4 pb-6 md:hidden">
            {appLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`block py-2 text-[#14213D] transition-colors hover:text-[#FCA311] ${
                  location.pathname === link.to ? "font-semibold text-[#FCA311]" : ""
                }`}
                onClick={() => setIsMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 pt-4">
              <Link
                to="/login"
                className="flex-1 rounded-lg border border-[#14213D] py-2 text-center font-medium text-[#14213D] transition-colors hover:bg-[#14213D] hover:text-white"
                onClick={() => setIsMobileOpen(false)}
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="flex-1 rounded-lg bg-[#FCA311] py-2 text-center font-medium text-white transition-colors hover:bg-[#E89310]"
                onClick={() => setIsMobileOpen(false)}
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
