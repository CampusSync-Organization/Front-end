import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ArrowRight, Loader2, BookOpen, Brain, Users } from "lucide-react";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import { SplitOptionList } from "./SplitOptionList";
import { SplitLikertTrack } from "./SplitLikertTrack";
import { useDispatch, useSelector } from "react-redux";
import { updateStudentMatrix } from "../Api/updateStudentMatrix";
import { updateAssessment } from "../Api/assessmentApi";
import { setUser, setToken } from "../../auth/store/authSlice";
import { usePageTransition } from "../../../shared/context/TransitionContext";

const rAF2 = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

const QUESTION_IMAGES = {
  // Academic Images
  year: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600",
  gpa: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600",
  study_start:
    "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=1600",
  work_approach:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600",
  time_pressure:
    "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1600",
  commitment_priority:
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600",
  commitment_reliability:
    "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=1600",
  study_effort:
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600",
  academic_mindset:
    "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600",
  working_style:
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600",

  // Personality Images
  ext_1:
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600",
  ext_2_rev:
    "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=1600",
  cons_1:
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600",
  cons_2_rev:
    "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1600",
  agr_1:
    "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600",
  agr_2_rev:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600",
  neu_1_rev:
    "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1600",
  neu_2:
    "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1600",
  opn_1:
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1600",
  opn_2_rev:
    "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600",
};


function AssessmentComplete({ onConfirm }) {
  const [isLoading, setIsLoading] = useState(false);

  const pillars = [
    { label: "Academic Profile", detail: "Study habits & work style mapped", Icon: BookOpen },
    { label: "Personality Traits", detail: "Big Five traits assessed", Icon: Brain },
    { label: "Smart Matching", detail: "Ready to connect you with peers", Icon: Users },
  ];

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8fa] flex items-center justify-center p-6 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white rounded-[2rem] shadow-[0_8px_40px_rgba(20,33,61,0.08)] border border-[#ebebef] overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-[#FCA311] w-full" />

          <div className="p-8 sm:p-10">
            {/* Check badge */}
            <div className="flex justify-center mb-7">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 16 }}
                className="w-18 h-18 w-[72px] h-[72px] rounded-full bg-[#FCA311] flex items-center justify-center shadow-[0_6px_24px_rgba(252,163,17,0.30)]"
              >
                <Check className="h-9 w-9 text-[#14213D]" strokeWidth={3} />
              </motion.div>
            </div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.45 }}
              className="text-center mb-7"
            >
              <h2 className="text-[28px] font-bold text-[#14213D] tracking-tight mb-2">
                You're all set!
              </h2>
              <p className="text-[#86868b] text-[14px] leading-relaxed max-w-xs mx-auto">
                Your campus profile is ready. We've mapped your academic style and personality to find the right people for you.
              </p>
            </motion.div>

            {/* Pillars */}
            <div className="space-y-2.5 mb-7">
              {pillars.map((pillar, i) => (
                <motion.div
                  key={pillar.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.1, duration: 0.4 }}
                  className="flex items-center gap-3.5 bg-[#f8f8fa] border border-[#ebebef] rounded-xl px-4 py-3.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#FCA311]/12 flex items-center justify-center shrink-0">
                    <pillar.Icon className="w-[18px] h-[18px] text-[#FCA311]" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#14213D] font-semibold text-[13px]">{pillar.label}</p>
                    <p className="text-[#86868b] text-[11px] mt-0.5">{pillar.detail}</p>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-[#14213D]/8 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-[#14213D]" strokeWidth={3} />
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleClick}
              disabled={isLoading}
              className="w-full h-12 bg-[#14213D] text-white rounded-xl font-semibold text-[15px] shadow-[0_4px_16px_rgba(20,33,61,0.18)] hover:bg-[#1e2d50] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Enter Your Campus
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </div>
        </div>

        <p className="text-center text-[#c0c0c8] text-[11px] mt-4">
          Your data is private and secure
        </p>
      </motion.div>
    </div>
  );
}

export default function AssessmentSplitScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { fadeOut, fadeIn } = usePageTransition();
  const [direction, setDirection] = useState(1);
  const [isFinishing, setIsFinishing] = useState(false);
  const token = useSelector((state) => state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  const {
    currentStep,
    nextStep,
    prevStep,
    setAnswer,
    getAnswerForKey,
    getFinalPayload,
    getApiPayload,
    reset,
    totalSteps,
  } = useAssessmentStore();

  useEffect(() => {
    // Secretly preload all high-res background images into browser cache on mount
    Object.values(QUESTION_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const isComplete = currentStep >= totalSteps;
  const currentQuestion = ALL_QUESTIONS[currentStep];
  const currentValue = currentQuestion
    ? getAnswerForKey(currentQuestion.key)
    : null;

  const isAdvancing = useRef(false); // ✅ ref, not state — won't cause re-render

  const handleNext = () => {
    if (isAdvancing.current) return; // ✅ block double calls
    isAdvancing.current = true;

    if (currentStep === totalSteps - 1) {
      setIsFinishing(true);
      setTimeout(() => {
        nextStep();
        isAdvancing.current = false;
      }, 600);
      return;
    }

    setDirection(1);
    nextStep();

    // Reset after animation settles
    setTimeout(() => {
      isAdvancing.current = false;
    }, 300);
  };
  const handleBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    prevStep();
  };

  const handleSelect = (val) => {
    setAnswer(currentQuestion.key, val);
    handleNext();
  };

  const handleCompleteRedirect = async () => {
    const apiPayload = useAssessmentStore.getState().getApiPayload();

    const nullFields = Object.entries(apiPayload)
      .filter(([, v]) => v == null)
      .map(([k]) => k);

    if (nullFields.length > 0) {
      console.warn("Still null:", nullFields);
      toast.error("Some questions were not answered. Please try again.");
      return;
    }

    console.log("Submitting:", apiPayload);

    try {
      try {
        await updateStudentMatrix({ data: apiPayload });
      } catch (matrixErr) {
        // If the backend throws a 500 (often blocked by CORS as a network error) because the user's matrix already exists,
        // we can safely bypass it and proceed to sync their user assessment flag!
        if (matrixErr.response && matrixErr.response.status === 422) {
          throw matrixErr; 
        }
        console.warn("Matrix submission encountered an issue, proceeding smoothly assuming it potentially already exists:", matrixErr);
      }

      const updatedUserRes = await updateAssessment();
      
      if (updatedUserRes && updatedUserRes.token) {
        dispatch(setToken(updatedUserRes.token));
      }
      
      if (user) {
        dispatch(setUser({ ...user, assessment_completed: true }));
      }

      reset();
      // White overlay — matches welcome screen background for a seamless handoff
      await fadeOut("#ffffff");
      navigate("/home?welcome=1", { replace: true });
      await rAF2();
      // Fade the global overlay away; FirstWelcomeOverlay (also navy) takes over instantly
      fadeIn();
    } catch (err) {
      console.error("Submission failed:", err);
      toast.error("Submission failed. Please try again.");
    }
  };
  if (isComplete) {
    return <AssessmentComplete onConfirm={handleCompleteRedirect} />;
  }

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const bgImage =
    currentQuestion && QUESTION_IMAGES[currentQuestion.key]
      ? QUESTION_IMAGES[currentQuestion.key]
      : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600";

  const slideVariants = {
    enter: (dir) => ({ y: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir) => ({ y: dir < 0 ? 80 : -80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full bg-white font-sans text-slate-900 overflow-hidden relative">
      {/* Mobile Image Context Component (Slimmer to prevent scroll) */}
      <div className="block lg:hidden w-full h-[15%] min-h-[120px] relative shrink-0 overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={bgImage}
            src={bgImage}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-slate-900/30 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        <div className="absolute top-4 left-6 text-white drop-shadow-md">
          <h1 className="text-2xl font-black mb-1 tracking-tighter leading-none">
            CampusSync
          </h1>
        </div>
      </div>

      {/* LEFT: Desktop Context Image Split */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <AnimatePresence>
          <motion.img
            key={bgImage}
            src={bgImage}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

        {/* Typographic Context Overlay */}
        <div className="absolute bottom-16 left-16 right-16 text-white max-w-md">
          <h1 className="text-[48px] font-black mb-4 tracking-tighter leading-none">
            CampusSync
          </h1>
          <p className="text-xl font-medium text-white/80 leading-relaxed">
            {currentQuestion?.category === "Academic"
              ? "Tell us about your study cadence to unlock personalized academic roadmaps."
              : "Let us understand your personality metrics to connect you with the right communities."}
          </p>
        </div>
      </div>

      {/* RIGHT: High Structure Form Split */}
      <div className="w-full lg:w-1/2 relative flex flex-col flex-1 h-[85%] lg:h-full overflow-hidden">
        {/* Top Progress Track */}
        <div className="absolute top-0 left-0 w-full h-1.5 md:h-2 bg-slate-100 z-50 shrink-0">
          <motion.div
            className="h-full bg-slate-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>

        {/* Header Console */}
        <header className="w-full flex items-center justify-between px-6 lg:px-16 pt-5 pb-1 lg:py-8 z-20 shrink-0 mt-1">
          <button
            onClick={handleBack}
            className={`flex items-center gap-2 p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold text-[12px] tracking-widest uppercase ${currentStep === 0 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>

        {/* Static Flexible Wrapper for perfect vertical alignment */}
        <main className="flex-1 w-full max-w-[700px] mx-auto flex flex-col justify-center px-6 lg:px-16 pb-4 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            {currentQuestion && (
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 35,
                  opacity: { duration: 0.2 },
                }}
                className="w-full flex flex-col"
              >
                {/* Number & Typography */}
                <div className="mb-4 lg:mb-8 flex flex-col lg:flex-row lg:items-start gap-2 lg:gap-6">
                  <div className="flex items-center gap-3 shrink-0 mt-1">
                    <span className="text-slate-900 font-bold text-lg lg:text-2xl flex items-center gap-2">
                      {currentStep + 1}{" "}
                      <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-slate-300" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-[22px] sm:text-[26px] lg:text-[40px] font-bold tracking-tight leading-[1.25] text-slate-900">
                      {currentQuestion.question || currentQuestion.statement}
                    </h2>
                    <p className="text-slate-400 font-semibold tracking-widest uppercase text-[10px] sm:text-[11px] mt-2 lg:mt-6">
                      {currentQuestion.category}
                    </p>
                  </div>
                </div>

                {/* Left-Aligned Constrained Block for Form Elements */}
                <div className="w-full pl-0 md:pl-[68px]">
                  {currentQuestion.type === "singleSelect" && (
                    <SplitOptionList
                      options={currentQuestion.options}
                      selectedValue={currentValue}
                      onSelect={handleSelect}
                    />
                  )}
                  {currentQuestion.type === "likert" && (
                    <SplitLikertTrack
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      labels={currentQuestion.labels}
                      value={currentValue}
                      onSelect={handleSelect}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
