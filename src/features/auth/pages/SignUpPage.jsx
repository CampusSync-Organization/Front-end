import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { handleGoogleSuccess } from "../handlers/handleGoogleSuccess";
import { ArrowRight, Loader2, User, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";
import { registerUser, loginUser } from "../store/authSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { usePageTransition } from "../../../shared/context/TransitionContext";
import { GoogleButton, AuthDivider, TermsLinks } from "../componenets";

// ---------- field ----------
function Field({ label, id, name, type = "text", placeholder, icon: Icon, autoComplete, required, minLength }) {
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
          autoComplete={autoComplete} minLength={minLength}
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

// ---------- step pills ----------
const STEPS = [
  { n: 1, label: "Account" },
  { n: 2, label: "Assessment" },
  { n: 3, label: "Campus" },
];

function StepPills({ active }) {
  return (
    <div className="flex items-center gap-1 mb-7">
      {STEPS.map((s, i) => (
        <div key={s.n} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
              s.n < active ? "bg-[#14213D] text-white" :
              s.n === active ? "bg-[#FCA311] text-[#14213D] ring-4 ring-[#FCA311]/20" :
              "bg-[#f0f0f2] text-[#c0c0c8]"
            }`}>
              {s.n < active ? <Check className="h-3 w-3" strokeWidth={3} /> : s.n}
            </div>
            <span className={`text-[10px] font-semibold tracking-wide ${s.n === active ? "text-[#14213D]" : "text-[#c0c0c8]"}`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-px mb-4 transition-colors ${s.n < active ? "bg-[#14213D]/30" : "bg-[#e8e8ec]"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

// ---------- left panel ----------
function LeftPanel() {
  const features = [
    "AI-powered peer matching",
    "Study groups & project teams",
    "Campus events & communities",
    "Personalized recommendations",
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
            <p className="text-[#FCA311] text-sm font-semibold tracking-widest uppercase mb-4">Welcome to CampusSync</p>
            <h2 className="text-[clamp(30px,3.2vw,44px)] font-bold text-white leading-[1.15] tracking-tight mb-5">
              Find your people.<br />
              <span className="text-[#FCA311]">Build your future.</span>
            </h2>
            <p className="text-white/45 text-[15px] leading-relaxed max-w-xs mb-10">
              Join thousands of students building meaningful connections, forming study groups, and thriving on campus.
            </p>

            <ul className="space-y-3">
              {features.map((f, i) => (
                <motion.li key={f}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3 text-white/65 text-[13px]"
                >
                  <div className="w-5 h-5 rounded-full bg-[#FCA311]/15 border border-[#FCA311]/25 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#FCA311]" strokeWidth={3} />
                  </div>
                  {f}
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
export default function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { fadeOut, fadeIn } = usePageTransition();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.target;
    const name = form.querySelector('input[name="name"]')?.value?.trim() || "New User";
    const email = form.querySelector('input[name="email"]')?.value?.trim() || "";
    const password = form.querySelector('input[name="password"]')?.value ?? "";

    if (!email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);

    // Start the visual transition immediately — APIs run under the white overlay
    await fadeOut();

    const result = await dispatch(registerUser({ email, name, password }));
    if (registerUser.fulfilled.match(result)) {
      const loginResult = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(loginResult)) {
        navigate("/assessment", { replace: true });
        // Two rAFs so the new page is painted before we reveal it
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        fadeIn();
        return;
      }
      toast.error(loginResult.payload ?? "Login after registration failed");
    } else {
      toast.error(result.payload ?? "Registration failed");
    }

    // Error path — reveal the form again
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

          <StepPills active={1} />

          <div className="mb-6">
            <h1 className="text-[26px] font-bold text-[#1d1d1f] tracking-tight">Create your account</h1>
            <p className="mt-1.5 text-[#86868b] text-[14px] leading-relaxed">
              After signup, a 2-minute assessment personalizes your experience.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field id="name" name="name" label="Full name" placeholder="Youssef" icon={User} autoComplete="name" required />
              <Field id="email" name="email" type="email" label="Email" placeholder="you@uni.edu" icon={Mail} autoComplete="email" required />
            </div>
            <Field id="password" name="password" type="password" label="Password" placeholder="Min. 8 characters" icon={Lock} autoComplete="new-password" required minLength={8} />

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-[46px] rounded-xl bg-[#FCA311] text-[#14213D] font-semibold text-[15px] transition-all hover:bg-[#FFB830] active:scale-[0.99] flex items-center justify-center gap-2 mt-1 shadow-lg shadow-[#FCA311]/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create account <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <AuthDivider className="my-4" />
          <GoogleButton
            onSuccess={(cred) => handleGoogleSuccess(cred, dispatch, navigate, toast)}
            onError={() => toast.error("Google sign up failed")}
          />

          <p className="mt-5 text-center text-[13px] text-[#86868b]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#14213D] hover:text-[#FCA311] transition-colors">Sign in</Link>
          </p>
          <TermsLinks className="mt-4 text-[11px]" />
        </div>
      </motion.div>
    </div>
  );
}
