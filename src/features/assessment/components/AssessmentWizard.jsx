import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import SingleSelectStep from "./SingleSelectStep";
import LikertStep from "./LikertStep";

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm"
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-foreground">You're all set!</h2>
          <p className="mt-3 text-muted-foreground">
            Your personalized experience is ready. We've tailored things based on your responses.
          </p>
          <button
            type="button"
            onClick={handleComplete}
            className="mt-8 w-full rounded-xl bg-primary px-6 py-3.5 font-medium text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            Let's Go →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Progress */}
      <div className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur-sm">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentStep + 1} of {totalSteps}</span>
            <span className="font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <AnimatePresence mode="wait" custom={direction}>
          {currentQuestion && (
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 24 : -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -24 : 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Question */}
              <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                {currentQuestion.category && (
                  <p className="text-xs font-medium uppercase tracking-wider text-primary mb-2">
                    {currentQuestion.category}
                  </p>
                )}
                <h3 className="text-xl font-semibold text-foreground leading-snug">
                  {currentQuestion.question}
                </h3>
              </div>

              {/* Options */}
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
      </div>
    </div>
  );
}
