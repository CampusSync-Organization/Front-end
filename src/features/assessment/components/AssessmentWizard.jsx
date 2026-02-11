import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import SingleSelectStep from "./SingleSelectStep";
import LikertStep from "./LikertStep";
import { ArrowRight, Check, X } from "lucide-react";
import QuestionCard from "./midnight/QuestionCard";
import GPAWheel from "./midnight/GPAWheel";
import HazardSlider from "./midnight/HazardSlider";
import BatterySelector from "./midnight/BatterySelector";
import EmojiOptionCard from "./midnight/EmojiOptionCard";

const CARD_TO_LIKERT_7 = [1, 2, 4, 6, 7];
function likert7ToCard(value) {
  if (value == null) return null;
  if (value <= 1) return 1;
  if (value <= 3) return 2;
  if (value <= 5) return 3;
  if (value <= 6) return 4;
  return 5;
}
function cardToLikert7(card) {
  return CARD_TO_LIKERT_7[Math.min(4, Math.max(0, card - 1))];
}

function getChapterTitle(category) {
  if (category === "Academic DNA") return "The Operator";
  if (category === "Personality Pulse") return "The Persona";
  return category;
}

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
      console.log("CampusSync Assessment – Final payload:", payload);
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

  const handleClose = () => {
    if (currentStep === 0) navigate(-1);
    else prevStep();
  };

  const isAcademic = currentQuestion?.category === "Academic DNA";
  const handleSelectAcademic = (key, value) => {
    setAnswer(key, value);
    setTimeout(handleNext, 400);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-12">
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

  const isGPA = currentQuestion?.key === "gpa";
  const isStudyRhythm = currentQuestion?.key === "study_rhythm";
  const isCourseLoad = currentQuestion?.key === "course_load";
  const isPersonalityLikert =
    currentQuestion?.type === "likert" &&
    currentQuestion?.category === "Personality Pulse";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col">
      {/* Gold progress bar at top */}
      <div className="h-1 w-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.5)]"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
      </div>

      {/* Header: step indicator (left), close (right) */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4">
        <span className="text-sm font-medium text-slate-400">
          {currentStep + 1} of {totalSteps}
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

      {/* Chapter title */}
      {currentQuestion?.category && (
        <div className="px-4 sm:px-6 pb-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-amber-400">
            {getChapterTitle(currentQuestion.category)}
          </span>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-4 sm:px-6 py-6 pb-12">
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentStep}
              initial={{
                opacity: 0,
                x: direction > 0 ? 100 : -100,
                scale: direction > 0 ? 0.95 : 1,
              }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -100, rotate: -2 }}
              transition={{ type: "spring", stiffness: 300, damping: 35 }}
              className="space-y-8"
            >
              {isGPA && (
                <QuestionCard
                  question={currentQuestion}
                  funQuestion="How would you describe your current GPA band?"
                  direction={direction}
                >
                  <GPAWheel
                    options={currentQuestion.options}
                    value={currentValue}
                    onChange={(v) =>
                      isAcademic
                        ? handleSelectAcademic(currentQuestion.key, v)
                        : setAnswer(currentQuestion.key, v)
                    }
                  />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                    autoAdvance={isAcademic}
                  />
                </QuestionCard>
              )}

              {isStudyRhythm && (
                <QuestionCard
                  question={currentQuestion}
                  funQuestion="What study rhythm feels most natural for you?"
                  direction={direction}
                >
                  <HazardSlider
                    options={currentQuestion.options}
                    value={currentValue}
                    onChange={(v) =>
                      isAcademic
                        ? handleSelectAcademic(currentQuestion.key, v)
                        : setAnswer(currentQuestion.key, v)
                    }
                  />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                    autoAdvance={isAcademic}
                  />
                </QuestionCard>
              )}

              {isCourseLoad && (
                <QuestionCard
                  question={currentQuestion}
                  funQuestion="How intense is your current course load?"
                  direction={direction}
                >
                  <BatterySelector
                    options={currentQuestion.options}
                    value={currentValue}
                    onChange={(v) =>
                      isAcademic
                        ? handleSelectAcademic(currentQuestion.key, v)
                        : setAnswer(currentQuestion.key, v)
                    }
                  />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                    autoAdvance={isAcademic}
                  />
                </QuestionCard>
              )}

              {isPersonalityLikert && (
                <QuestionCard
                  question={currentQuestion}
                  direction={direction}
                >
                  <EmojiOptionCard
                    value={likert7ToCard(currentValue)}
                    onChange={(card) =>
                      setAnswer(currentQuestion.key, cardToLikert7(card))
                    }
                    labels={[
                      currentQuestion.labels[1],
                      currentQuestion.labels[2] ?? currentQuestion.labels[1],
                      currentQuestion.labels[4],
                      currentQuestion.labels[6] ?? currentQuestion.labels[4],
                      currentQuestion.labels[7],
                    ]}
                  />
                  <NavButtons
                    onBack={handleBack}
                    onNext={handleNext}
                    canGoNext={currentValue != null}
                    stepIndex={currentStep}
                    totalSteps={totalSteps}
                  />
                </QuestionCard>
              )}

              {!isGPA &&
                !isStudyRhythm &&
                !isCourseLoad &&
                !isPersonalityLikert &&
                currentQuestion.type === "singleSelect" && (
                  <QuestionCard
                    question={currentQuestion}
                    direction={direction}
                  >
                    <SingleSelectStep
                      options={currentQuestion.options}
                      value={currentValue}
                      onChange={(v) =>
                        isAcademic
                          ? handleSelectAcademic(currentQuestion.key, v)
                          : setAnswer(currentQuestion.key, v)
                      }
                      onNext={handleNext}
                      onBack={handleBack}
                      canGoNext={currentValue != null}
                      stepIndex={currentStep}
                      totalSteps={totalSteps}
                      variant="midnight"
                      autoAdvance={isAcademic}
                    />
                  </QuestionCard>
                )}

              {!isGPA &&
                !isStudyRhythm &&
                !isCourseLoad &&
                !isPersonalityLikert &&
                currentQuestion.type === "likert" && (
                  <QuestionCard
                    question={currentQuestion}
                    direction={direction}
                  >
                    <LikertStep
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      labels={currentQuestion.labels}
                      value={currentValue}
                      onChange={(v) =>
                        isAcademic
                          ? handleSelectAcademic(currentQuestion.key, v)
                          : setAnswer(currentQuestion.key, v)
                      }
                      onNext={handleNext}
                      onBack={handleBack}
                      canGoNext={currentValue != null}
                      stepIndex={currentStep}
                      totalSteps={totalSteps}
                      variant="midnight"
                      autoAdvance={isAcademic}
                    />
                  </QuestionCard>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function NavButtons({
  onBack,
  onNext,
  canGoNext,
  stepIndex,
  totalSteps,
  autoAdvance = false,
}) {
  return (
    <div className="flex gap-3 pt-6">
      <button
        type="button"
        onClick={onBack}
        className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:border-white/30"
      >
        Back
      </button>
      {!autoAdvance && (
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 rounded-full bg-amber-400 px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-all hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
        >
          {stepIndex === totalSteps - 1 ? "Complete" : "Next"}
          {stepIndex < totalSteps - 1 && (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
