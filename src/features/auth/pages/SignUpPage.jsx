import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, Check, Loader2, Eye, EyeOff } from "lucide-react";
import { setUser } from "../store/authSlice";
import { register } from "../api/authApi";
import { toast } from "sonner";
import gsap from "gsap";

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".brand-panel", { x: -30, opacity: 0, duration: 0.6 })
        .from(".brand-logo", { y: -20, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".brand-text", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".form-card", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".form-title", { y: 15, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(
          ".form-field",
          { y: 15, opacity: 0, stagger: 0.08, duration: 0.4 },
          "-=0.2",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name =
      form.querySelector('input[name="name"]')?.value?.trim() || "New User";
    const email =
      form.querySelector('input[name="email"]')?.value?.trim() || "";
    const password = form.querySelector('input[name="password"]')?.value ?? "";
    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsLoading(true);
    try {
      const user = await register({ email, name, password });
      dispatch(setUser({ ...user, name }));
      requestAnimationFrame(() => {
        navigate("/assessment", { replace: true });
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ??
        err.response?.data?.detail ??
        err.message ??
        "Registration failed";
      toast.error(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    "AI-powered matching",
    "Find study groups",
    "Build project teams",
    "Safe community",
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex bg-[#fbfbfd] overflow-hidden"
    >
      {/* Left: Premium branding panel */}
      <div className="brand-panel hidden lg:flex lg:w-1/2 bg-[#1d1d1f] relative overflow-hidden shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f] via-[#2d2d2f] to-[#1d1d1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,rgba(252,163,17,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(252,163,17,0.06),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-10">
          <Link
            to="/"
            className="brand-logo inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center shadow-lg shadow-[#FCA311]/20">
              <span className="text-[#1d1d1f] font-semibold text-sm">CS</span>
            </div>
            <span className="text-lg font-medium tracking-tight">
              CampusSync
            </span>
          </Link>
          <div className="brand-text">
            <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold text-white tracking-[-0.02em] leading-tight max-w-md">
              Find your people.
              <span className="block bg-gradient-to-r from-[#FCA311] to-[#FFD700] bg-clip-text text-transparent">
                Build your future.
              </span>
            </h2>
            <p className="mt-4 text-white/50 text-base max-w-sm leading-relaxed">
              Join thousands of students building meaningful connections on
              campus.
            </p>
            <ul className="mt-6 space-y-2">
              {features.map((feature, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-3 text-white/70 text-[14px]"
                >
                  <div className="w-4 h-4 rounded-full bg-[#FCA311]/20 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#FCA311]" />
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-[12px] text-white/30">
            © {new Date().getFullYear()} CampusSync
          </p>
        </div>
      </div>

      {/* Right: Form - same visual size as signup */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-6 min-h-0 shrink-0 overflow-y-auto">
        <div className="w-full max-w-[420px] sm:max-w-[480px]">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2.5 mb-5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
              <span className="text-[#1d1d1f] font-semibold text-xs">CS</span>
            </div>
            <span className="text-[17px] font-semibold text-[#1d1d1f]">
              CampusSync
            </span>
          </Link>

          <div className="form-card">
            <div className="mb-4">
              <h1 className="form-title text-[24px] font-semibold text-[#1d1d1f] tracking-tight">
                Create account
              </h1>
              <p className="mt-1 text-[#86868b] text-[14px]">
                Quick assessment after signup
              </p>
            </div>

            <form
              id="signup-form"
              onSubmit={handleSubmit}
              className="space-y-3"
            >
              {/* Name + Email side by side on sm+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-field space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-[13px] font-medium text-[#1d1d1f]"
                  >
                    Name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Youssef"
                      required
                      autoComplete="name"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-[#FCA311]/20 focus:border-[#FCA311]"
                    />
                  </div>
                </div>
                <div className="form-field space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-[#1d1d1f]"
                  >
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="youssef@gmail.com"
                      required
                      autoComplete="email"
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-[#FCA311]/20 focus:border-[#FCA311]"
                    />
                  </div>
                </div>
              </div>

              <div className="form-field space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-[13px] font-medium text-[#1d1d1f]"
                >
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 8 characters"
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="w-full h-11 pl-10 pr-11 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-2 focus:ring-[#FCA311]/20 focus:border-[#FCA311]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="form-button w-full h-11 rounded-xl bg-[#FCA311] text-[#1d1d1f] font-semibold text-[15px] transition-all hover:bg-[#E89310] active:scale-[0.99] flex items-center justify-center gap-2 mt-1 shadow-lg shadow-[#FCA311]/20 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign up
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center gap-3 mt-3 my-3">
              <div className="flex-1 h-px bg-[#d2d2d7]" />
              <span className="text-[11px] text-[#86868b] uppercase tracking-wide">
                or
              </span>
              <div className="flex-1 h-px bg-[#d2d2d7]" />
            </div>

            <button
              type="button"
              className="w-full h-11 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] font-medium text-[14px] transition-all hover:bg-[#f5f5f7] flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <p className="mt-3 text-center text-[13px] text-[#86868b]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[#FCA311] hover:text-[#E89310] transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <p className="mt-3 text-center text-[11px] text-[#86868b]">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-[#1d1d1f]">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-[#1d1d1f]">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
