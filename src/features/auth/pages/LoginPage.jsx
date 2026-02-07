import { useRef, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { setUser } from "../store/authSlice";
import { login } from "../api/authApi";
import { getErrorMessage } from "../utils/getErrorMessage";
import { toast } from "sonner";
import gsap from "gsap";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/home";
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".brand-panel", { x: -30, opacity: 0, duration: 0.6 })
        .from(".brand-logo", { y: -20, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".brand-text", { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
        .from(".form-card", { y: 30, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".form-title", { y: 15, opacity: 0, duration: 0.4 }, "-=0.3")
        .from(".form-field", { y: 15, opacity: 0, stagger: 0.1, duration: 0.4 }, "-=0.2");
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[type="email"]')?.value?.trim() ?? "";
    const password = form.querySelector('input[name="password"]')?.value ?? "";
    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }
    setIsLoading(true);
    try {
      const data = await login({ email, password });
      const user = data.user ?? data;
      const name = user.name ?? user.full_name ?? user.display_name ?? email.split("@")[0] ?? "User";
      dispatch(setUser({ ...user, name, email }));
      requestAnimationFrame(() => {
        navigate(from, { replace: true });
      });
    } catch (err) {
      toast.error(getErrorMessage(err, "Sign in failed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen flex bg-[#fbfbfd]">
      {/* Left: Premium branding panel */}
      <div className="brand-panel hidden lg:flex lg:w-1/2 bg-[#1d1d1f] relative overflow-hidden">
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1d1d1f] via-[#2d2d2f] to-[#1d1d1f]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_20%,rgba(252,163,17,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(252,163,17,0.05),transparent)]" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-between w-full px-16 py-12">
          {/* Logo */}
          <Link to="/" className="brand-logo inline-flex items-center gap-3 text-white/90 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center shadow-lg shadow-[#FCA311]/20">
              <span className="text-[#1d1d1f] font-semibold text-sm">CS</span>
            </div>
            <span className="text-lg font-medium tracking-tight">CampusSync</span>
          </Link>

          {/* Main content */}
          <div className="brand-text">
            <h2 className="text-[clamp(32px,4vw,44px)] font-semibold text-white tracking-[-0.02em] leading-tight max-w-md">
              Welcome back to your
              <span className="block bg-gradient-to-r from-[#FCA311] to-[#FFD700] bg-clip-text text-transparent">
                community
              </span>
            </h2>
            <p className="mt-6 text-white/50 text-lg max-w-sm leading-relaxed">
              Sign in to reconnect with your peers, discover events, and continue building meaningful connections.
            </p>
          </div>

          {/* Footer */}
          <p className="text-[13px] text-white/30">
            © {new Date().getFullYear()} CampusSync · Privacy · Terms
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-12">
        <div ref={formRef} className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FCA311] to-[#E89310] flex items-center justify-center">
              <span className="text-[#1d1d1f] font-semibold text-xs">CS</span>
            </div>
            <span className="text-[17px] font-semibold text-[#1d1d1f]">CampusSync</span>
          </Link>

          {/* Form Card */}
          <div className="form-card">
            {/* Header */}
            <div className="mb-8">
              <h1 className="form-title text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
                Sign in
              </h1>
              <p className="mt-2 text-[#86868b] text-[15px]">
                Enter your email and password to continue
              </p>
            </div>

            {/* Form */}
            <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="form-field space-y-2">
                <label htmlFor="email" className="block text-[13px] font-medium text-[#1d1d1f]">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    required
                    autoComplete="email"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FCA311]/10 focus:border-[#FCA311]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-field space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-[13px] font-medium text-[#1d1d1f]">
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[12px] font-medium text-[#FCA311] hover:text-[#E89310] transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-[#86868b] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] placeholder:text-[#86868b]/60 text-[15px] transition-all focus:outline-none focus:ring-4 focus:ring-[#FCA311]/10 focus:border-[#FCA311]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#86868b] hover:text-[#1d1d1f] hover:bg-slate-100 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="form-button w-full h-12 rounded-xl bg-[#1d1d1f] text-white font-medium text-[15px] transition-all hover:bg-[#1d1d1f]/90 active:scale-[0.99] flex items-center justify-center gap-2 mt-6 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#d2d2d7]" />
              <span className="text-[12px] text-[#86868b] uppercase tracking-wide">or</span>
              <div className="flex-1 h-px bg-[#d2d2d7]" />
            </div>

            {/* Social Login */}
            <button
              type="button"
              className="w-full h-12 rounded-xl border border-[#d2d2d7] bg-white text-[#1d1d1f] font-medium text-[15px] transition-all hover:bg-[#f5f5f7] flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Sign up link */}
            <p className="mt-8 text-center text-[14px] text-[#86868b]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#FCA311] hover:text-[#E89310] transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-[12px] text-[#86868b]">
            By continuing, you agree to our <a href="#" className="underline hover:text-[#1d1d1f]">Terms</a> and <a href="#" className="underline hover:text-[#1d1d1f]">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
