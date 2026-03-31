import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, User, Mail } from "lucide-react";
import { setUser, registerUser, googleLoginUser } from "../store/authSlice";
import { toast } from "sonner";
import gsap from "gsap";
import {
    BrandPanel,
    FormInput,
    PasswordInput,
    GoogleButton,
    AuthDivider,
    AuthFooterLink,
    TermsLinks,
} from "../componenets";

const features = [
    "AI-powered matching",
    "Find study groups",
    "Build project teams",
    "Safe community",
];

function SignUpPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);
    const containerRef = useRef(null);

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

        const result = await dispatch(registerUser({ email, name, password }));
        if (registerUser.fulfilled.match(result)) {
            navigate("/assessment", { replace: true });
        } else {
            toast.error(result.payload ?? "Registration failed");
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
            className="min-h-screen flex bg-[#fbfbfd] overflow-hidden"
        >
            <BrandPanel
                title="Find your people."
                highlightText="Build your future."
                subtitle="Join thousands of students building meaningful connections on campus."
                features={features}
                gradientIntensity="medium"
            />

            <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 py-6 min-h-0 shrink-0 overflow-y-auto">
                <div className="w-full max-w-[420px] sm:max-w-[480px]">
                    <Link
                        to="/"
                        className="lg:hidden inline-flex items-center gap-2.5 mb-5"
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormInput
                                    id="name"
                                    name="name"
                                    type="text"
                                    label="Name"
                                    placeholder="Youssef"
                                    icon={User}
                                    required
                                    autoComplete="name"
                                    className="space-y-1.5"
                                />
                                <FormInput
                                    id="email"
                                    name="email"
                                    type="email"
                                    label="Email"
                                    placeholder="youssef@gmail.com"
                                    icon={Mail}
                                    required
                                    autoComplete="email"
                                    className="space-y-1.5"
                                />
                            </div>

                            <PasswordInput
                                id="password"
                                name="password"
                                label="Password"
                                placeholder="Min 8 characters"
                                required
                                autoComplete="new-password"
                                minLength={8}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="form-button w-full h-11 rounded-xl bg-[#FCA311] text-[#1d1d1f] font-semibold text-[15px] transition-all hover:bg-[#E89310] active:scale-[0.99] flex items-center justify-center gap-2 mt-1 shadow-lg shadow-[#FCA311]/20 disabled:opacity-70 disabled:cursor-not-allowed shrink-0"
                            >
                                {loading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <>
                                        Sign up
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <AuthDivider className="mt-3 my-3" />

                        <GoogleButton
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error("Google sign up failed")}
                        />

                        <AuthFooterLink
                            question="Already have an account? "
                            linkText="Sign in"
                            linkTo="/login"
                            className="mt-3 text-[13px]"
                        />
                    </div>

                    <TermsLinks className="mt-3 text-[11px]" />
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
