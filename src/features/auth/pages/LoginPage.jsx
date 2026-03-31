import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import gsap from "gsap";
import { loginUser, googleLoginUser } from "../store/authSlice";
import {
  BrandPanel,
  FormInput,
  PasswordInput,
  GoogleButton,
  AuthDivider,
  AuthFooterLink,
  TermsLinks,
} from "../componenets";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // add this
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
        .from(
          ".form-field",
          { y: 15, opacity: 0, stagger: 0.1, duration: 0.4 },
          "-=0.2",
        );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email =
      form.querySelector('input[type="email"]')?.value?.trim() ?? "";
    const password = form.querySelector('input[name="password"]')?.value ?? "";

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      navigate(from, { replace: true });
    } else {
      toast.error(result.payload ?? "Sign in failed");
    }
  };
  const handleGoogleSuccess = async (credential) => {
    console.log("1. handleGoogleSuccess called with:", credential);

    const result = await dispatch(googleLoginUser({ credential }));
    console.log("2. Result from dispatch:", result);

    console.log("3. Is fulfilled?", googleLoginUser.fulfilled.match(result));

    if (googleLoginUser.fulfilled.match(result)) {
      console.log("4. Inside fulfilled block");
      console.log("5. Payload:", result.payload);
      const { token, user } = result.payload;

      if (user.assessment_completed) {
        navigate("/home", { replace: true });
      } else {
        navigate("/assessment", { replace: true });
      }
    } else {
      console.log("6. Inside else block");
      console.log("7. Error payload:", result.payload);
      toast.error(result.payload ?? "Google sign in failed");
    }
  };
  return (
    <div
      ref={containerRef}
      className="h-screen min-h-0 flex bg-[#fbfbfd] overflow-hidden"
    >
      <BrandPanel
        title="Welcome back to your"
        highlightText="community"
        subtitle="Sign in to reconnect with your peers, discover events, and continue building meaningful connections."
        gradientIntensity="low"
      />

      <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 py-6 sm:py-8 min-h-0 overflow-y-auto">
        <div ref={formRef} className="w-full max-w-[400px]">
          <Link
            to="/"
            className="lg:hidden inline-flex items-center gap-2.5 mb-6"
          >
            <img
              src="/campussync-icon.png"
              alt="CampusSync"
              className="h-9 w-auto object-contain"
            />
            <span className="text-[17px] font-semibold text-[#1d1d1f]">
              CampusSync
            </span>
          </Link>

          <div className="form-card">
            <div className="mb-6">
              <h1 className="form-title text-2xl sm:text-[28px] font-semibold text-[#1d1d1f] tracking-tight">
                Sign in
              </h1>
              <p className="mt-1.5 text-[#86868b] text-[15px]">
                Enter your email and password to continue
              </p>
            </div>

            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email"
                placeholder="you@university.edu"
                icon={Mail}
                required
                autoComplete="email"
              />

              <PasswordInput
                id="password"
                name="password"
                label="Password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                showForgotPassword
              />

              <button
                type="submit"
                disabled={loading} // ✅ from Redux now
                className="form-button w-full h-11 rounded-xl bg-[#1d1d1f] text-white font-medium text-[15px] transition-all hover:bg-[#1d1d1f]/90 active:scale-[0.99] flex items-center justify-center gap-2 mt-4 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? ( // ✅ from Redux now
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <AuthDivider />

            <GoogleButton
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google sign in failed")}
            />

            <AuthFooterLink
              question="Don't have an account? "
              linkText="Sign up"
              linkTo="/signup"
            />
          </div>

          <TermsLinks />
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
