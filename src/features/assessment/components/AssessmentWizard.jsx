import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import SingleSelectStep from "./SingleSelectStep";
import LikertStep from "./LikertStep";
import AssessmentAvatar from "./AssessmentAvatar";
import QuestionSpeechBubble from "./QuestionSpeechBubble";
import { ArrowRight, Check, X } from "lucide-react";

function getChapterTitle(category) {
  if (category === "Academic") return "Academic";
  if (category === "Personality") return "Personality";
  return category;
}

export default function AssessmentWizard() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
  const [bubbleRevealed, setBubbleRevealed] = useState(false);

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

  const questionText =
    currentQuestion?.question || currentQuestion?.statement || "";
  const isAcademic = currentQuestion?.category === "Academic";
  const isAcademicSingleSelect =
    isAcademic && currentQuestion?.type === "singleSelect";

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      const payload = getFinalPayload();
      nextStep();
      return;
    }
    setDirection(1);
    setBubbleRevealed(false);
    nextStep();
  };

  const handleBack = () => {
    setDirection(-1);
    setBubbleRevealed(false);
    if (currentStep === 0) {
      navigate(-1);
      return;
    }
    prevStep();
  };

  const handleSelect = (value) => {
    setAnswer(currentQuestion.key, value);
  };

  const handleSelectWithAdvance = (value) => {
    setAnswer(currentQuestion.key, value);
    setTimeout(handleNext, 350);
  };

  const handleComplete = () => {
    reset();
    navigate("/home");
  };

  const handleClose = () => {
    if (currentStep === 0) navigate(-1);
    else prevStep();
  };

  const onRevealComplete = () => setBubbleRevealed(true);

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-10 text-center shadow-[0_0_40px_-12px_rgba(0,0,0,0.3)]">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 200 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20 border border-amber-400/40 shadow-[0_0_24px_rgba(251,191,36,0.25)]"
            >
              <Check className="h-10 w-10 text-amber-400 stroke-[2.5]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              You're all set
            </h2>
            <p className="mt-3 text-[15px] text-slate-400 leading-relaxed max-w-sm mx-auto">
              Your personalized experience is ready. We've tailored things based
              on your responses.
            </p>
            <motion.button
              type="button"
              onClick={handleComplete}
              className="mt-8 w-full rounded-full bg-amber-400 text-slate-900 font-semibold text-[15px] h-12 flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(251,191,36,0.35)] hover:bg-amber-300 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Let's go
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </div>
          <p className="mt-6 text-center">
            <Link
              to="/"
              className="text-[13px] text-slate-500 hover:text-slate-400 transition-colors"
            >
              Back to home
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 w-full bg-white/5 overflow-hidden shrink-0">
        <motion.div
          className="h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Header - compact, progress + close */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-3 shrink-0">
        <span className="text-xs font-medium text-slate-500 tabular-nums">
          {currentStep + 1} / {totalSteps}
        </span>
        <button
          type="button"
          onClick={handleClose}
          className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </header>

      {/* Main content - centered, uses full page */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 overflow-auto">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-2xl flex flex-col items-center gap-8"
            >
              {currentQuestion?.category && (
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-400/80">
                  {getChapterTitle(currentQuestion.category)}
                </span>
              )}

              {/* Nova + Question */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
                <AssessmentAvatar className="shrink-0" />
                <QuestionSpeechBubble
                  question={questionText}
                  stepIndex={currentStep}
                  totalSteps={totalSteps}
                  isActive={true}
                  onRevealComplete={onRevealComplete}
                  className="flex-1 min-w-0 w-full"
                />
              </div>

              {/* Options */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
                className="w-full max-w-lg"
              >
                {currentQuestion.type === "singleSelect" ? (
                  <SingleSelectStep
                    options={currentQuestion.options}
                    value={currentValue}
                    onChange={
                      isAcademicSingleSelect
                        ? handleSelectWithAdvance
                        : handleSelect
                    }
                    onNext={handleNext}
                    onBack={handleBack}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                    variant="midnight"
                    autoAdvance={isAcademicSingleSelect}
                  />
                ) : (
                  <LikertStep
                    min={currentQuestion.min}
                    max={currentQuestion.max}
                    labels={currentQuestion.labels}
                    value={currentValue}
                    onChange={handleSelect}
                    onNext={handleNext}
                    onBack={handleBack}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                    variant="midnight"
                    autoAdvance={false}
                  />
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
