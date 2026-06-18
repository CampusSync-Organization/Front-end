import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleGoogleSuccess } from "../handlers/handleGoogleSuccess";
import { ArrowRight, Loader2, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { loginUser } from "../store/authSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePageTransition } from "../../../shared/context/TransitionContext";
import { GoogleButton, AuthDivider, TermsLinks } from "../componenets";

// ---------- field ----------
function Field({ label, id, name, type = "text", placeholder, icon: Icon, autoComplete, required }) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (show ? "text" : "password") : type;

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-[#1d1d1f]">{label}</label>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c0c0c8] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
        )}
        <input
          id={id} name={name} type={inputType}
          placeholder={placeholder} required={required}
          autoComplete={autoComplete}
          className="w-full h-[46px] rounded-xl border border-[#e0e0e5] bg-[#fafafa] text-[#1d1d1f] placeholder:text-[#c0c0c8] text-[14px] transition-all focus:outline-none focus:bg-white focus:border-[#FCA311] focus:ring-4 focus:ring-[#FCA311]/10 pl-10 pr-4"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#c0c0c8] hover:text-[#1d1d1f] transition-colors">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ---------- password field with forgot-password link ----------
function PasswordField({ id, name, placeholder, icon: Icon, autoComplete, required }) {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-[13px] font-medium text-[#1d1d1f]">Password</label>
        <Link to="/forgot-password" className="text-[12px] text-[#86868b] hover:text-[#FCA311] transition-colors">
          Forgot password?
        </Link>
      </div>
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#c0c0c8] group-focus-within:text-[#FCA311] transition-colors pointer-events-none" />
        )}
        <input
          id={id} name={name} type={show ? "text" : "password"}
          placeholder={placeholder} required={required}
          autoComplete={autoComplete}
          className="w-full h-[46px] rounded-xl border border-[#e0e0e5] bg-[#fafafa] text-[#1d1d1f] placeholder:text-[#c0c0c8] text-[14px] transition-all focus:outline-none focus:bg-white focus:border-[#FCA311] focus:ring-4 focus:ring-[#FCA311]/10 pl-10 pr-10"
        />
        <button type="button" onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-[#c0c0c8] hover:text-[#1d1d1f] transition-colors">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

// ---------- left panel (identical theme to SignUpPage) ----------
function LeftPanel() {
  const benefits = [
    "Pick up exactly where you left off",
    "Your matched peers are waiting",
    "New events & announcements daily",
    "AI recommendations improve over time",
  ];

  return (
    <div className="hidden lg:flex lg:w-[52%] bg-[#14213D] relative overflow-hidden shrink-0 flex-col">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#FCA311]/8 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-15%] w-[400px] h-[400px] rounded-full bg-[#FCA311]/5 blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 flex flex-col h-full px-12 xl:px-16 py-10">
        <Link to="/" className="inline-flex items-center gap-3 text-white/80 hover:text-white transition-colors">
          <img src="/campussync-icon.png" alt="CampusSync" className="h-9 w-auto object-contain" />
          <span className="text-base font-semibold tracking-tight">CampusSync</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-[#FCA311] text-sm font-semibold tracking-widest uppercase mb-4">Welcome back</p>
            <h2 className="text-[clamp(30px,3.2vw,44px)] font-bold text-white leading-[1.15] tracking-tight mb-5">
              Good to see<br />
              <span className="text-[#FCA311]">you again.</span>
            </h2>
            <p className="text-white/45 text-[15px] leading-relaxed max-w-xs mb-10">
              Your campus connections, study groups, and events are all waiting for you.
            </p>

            <ul className="space-y-3">
              {benefits.map((b, i) => (
                <motion.li key={b}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/65 text-[13px]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FCA311]/15 border border-[#FCA311]/25 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#FCA311]" strokeWidth={3} />
                  </div>
                  {b}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <p className="text-[12px] text-white/20">© {new Date().getFullYear()} CampusSync · Privacy · Terms</p>
      </div>
    </div>
  );
}

// ---------- page ----------
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fadeOut, fadeIn } = usePageTransition();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.target;
    const email = form.querySelector('input[name="email"]')?.value?.trim() ?? "";
    const password = form.querySelector('input[name="password"]')?.value ?? "";

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setSubmitting(true);

    // Transition starts immediately — login API runs under the white overlay
    await fadeOut();

    const result = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(result)) {
      const destination = result.payload.user?.assessment_completed ? "/home" : "/assessment";
      navigate(destination, { replace: true });
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      fadeIn();
      return;
    }

    toast.error(result.payload ?? "Sign in failed");
    setSubmitting(false);
    fadeIn();
  };

  return (
    <div className="min-h-screen flex bg-[#fafafa] overflow-hidden">
      <LeftPanel />

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 py-10 min-h-screen overflow-y-auto"
      >
        <div className="w-full max-w-[400px]">
          <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-8">
            <img src="/campussync-icon.png" alt="CampusSync" className="h-8 w-auto" />
            <span className="text-[16px] font-semibold text-[#1d1d1f]">CampusSync</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-[26px] font-bold text-[#1d1d1f] tracking-tight">Sign in</h1>
            <p className="mt-1.5 text-[#86868b] text-[14px] leading-relaxed">
              Enter your credentials to access your campus.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field id="email" name="email" type="email" label="Email" placeholder="you@uni.edu" icon={Mail} autoComplete="email" required />
            <PasswordField id="password" name="password" placeholder="••••••••" icon={Lock} autoComplete="current-password" required />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] rounded-xl bg-[#FCA311] text-[#14213D] font-semibold text-[15px] transition-all hover:bg-[#FFB830] active:scale-[0.99] flex items-center justify-center gap-2 mt-1 shadow-lg shadow-[#FCA311]/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <AuthDivider className="my-4" />
          <GoogleButton
            onSuccess={(cred) => handleGoogleSuccess(cred, dispatch, navigate, toast)}
            onError={() => toast.error("Google sign in failed")}
          />

          <p className="mt-5 text-center text-[13px] text-[#86868b]">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#14213D] hover:text-[#FCA311] transition-colors">Sign up</Link>
          </p>
          <TermsLinks className="mt-4 text-[11px]" />
        </div>
      </motion.div>
    </div>
  );
}
