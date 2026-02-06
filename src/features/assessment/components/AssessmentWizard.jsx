import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import SingleSelectStep from "./SingleSelectStep";
import LikertStep from "./LikertStep";
import { ArrowRight, Check } from "lucide-react";

export default function AssessmentWizard() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);

  const {
    currentStep,
    nextStep,
    prevStep,
    setAnswer,
    getAnswerForKey,
    getFinalPayload,
    reset,
    totalSteps,
  } = useAssessmentStore();

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const isComplete = currentStep >= totalSteps;
  const currentQuestion = ALL_QUESTIONS[currentStep];
  const currentValue = currentQuestion
    ? getAnswerForKey(currentQuestion.key)
    : null;

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      const payload = getFinalPayload();
      console.log("Deep Sync Assessment – Final payload:", payload);
      nextStep();
      return;
    }
    setDirection(1);
    nextStep();
  };

  const handleBack = () => {
    setDirection(-1);
    if (currentStep === 0) {
      navigate(-1);
      return;
    }
    prevStep();
  };

  const handleComplete = () => {
    reset();
    navigate("/home");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fbfbfd] to-[#f0f0f4] flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl border border-[#e5e5ea] bg-white p-10 shadow-[0_10px_40px_-12px_rgba(20,33,61,0.08)] text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#14213D]"
            >
              <Check className="h-10 w-10 text-white stroke-[2.5]" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
              You're all set
            </h2>
            <p className="mt-3 text-[15px] text-[#86868b] leading-relaxed max-w-sm mx-auto">
              Your personalized experience is ready. We've tailored things based on your responses.
            </p>
            <motion.button
              type="button"
              onClick={handleComplete}
              className="mt-8 w-full rounded-xl bg-[#14213D] text-white font-semibold text-[15px] h-12 flex items-center justify-center gap-2 shadow-lg shadow-[#14213D]/15 hover:bg-[#14213D]/95 transition-all active:scale-[0.99]"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              Let's go
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
          <p className="mt-6 text-center">
            <Link to="/" className="text-[13px] text-[#86868b] hover:text-[#1d1d1f] transition-colors">
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fbfbfd] to-[#f0f0f4] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#e5e5ea] bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-[#1d1d1f] hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-[#14213D] flex items-center justify-center">
                <span className="text-[#FCA311] font-bold text-xs">CS</span>
              </div>
              <span className="font-semibold text-[15px]">CampusSync</span>
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-[13px] text-[#86868b]">
                {currentStep + 1} of {totalSteps}
              </span>
              <div className="h-1.5 w-24 sm:w-32 rounded-full bg-[#e5e5ea] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-[#14213D]"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait" custom={direction}>
          {currentQuestion && (
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Question card */}
              <div className="rounded-2xl border border-[#e5e5ea] bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(20,33,61,0.06)]">
                {currentQuestion.category && (
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#FCA311] mb-3">
                    {currentQuestion.category}
                  </span>
                )}
                <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] leading-snug tracking-tight">
                  {currentQuestion.question}
                </h2>
              </div>

              {/* Step content */}
              {currentQuestion.type === "singleSelect" && (
                <SingleSelectStep
                  options={currentQuestion.options}
                  value={currentValue}
                  onChange={(v) => setAnswer(currentQuestion.key, v)}
                  onNext={handleNext}
                  onBack={handleBack}
                  canGoNext={currentValue != null}
                  stepIndex={currentStep}
                  totalSteps={totalSteps}
                />
              )}

              {currentQuestion.type === "likert" && (
                <LikertStep
                  min={currentQuestion.min}
                  max={currentQuestion.max}
                  labels={currentQuestion.labels}
                  value={currentValue}
                  onChange={(v) => setAnswer(currentQuestion.key, v)}
                  onNext={handleNext}
                  onBack={handleBack}
                  canGoNext={currentValue != null}
                  stepIndex={currentStep}
                  totalSteps={totalSteps}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
