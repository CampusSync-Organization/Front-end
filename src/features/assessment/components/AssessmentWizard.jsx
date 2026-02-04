import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import AssessmentAvatar from "./AssessmentAvatar";
import QuestionSpeechBubble from "./QuestionSpeechBubble";
import SingleSelectStep from "./SingleSelectStep";
import LikertStep from "./LikertStep";
import ParticleBackground from "./ParticleBackground";

gsap.registerPlugin(useGSAP);

const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    rotateY: direction > 0 ? 5 : -5,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    rotateY: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px)",
    rotateY: direction < 0 ? 5 : -5,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function AssessmentWizard() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const progressGlowRef = useRef(null);
  const stepSurfaceRef = useRef(null);
  const avatarContainerRef = useRef(null);
  const confettiContainerRef = useRef(null);

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

  // Initial entrance animation
  useGSAP(
    () => {
      if (!containerRef.current) return;
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  // Progress bar animation with glow
  useEffect(() => {
    if (!progressRef.current) return;

    gsap.to(progressRef.current, {
      width: `${Math.min(progress, 100)}%`,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animated glow following progress
    if (progressGlowRef.current) {
      gsap.to(progressGlowRef.current, {
        left: `${Math.min(progress, 100)}%`,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    // Avatar reaction to progress
    if (avatarContainerRef.current) {
      gsap.fromTo(
        avatarContainerRef.current,
        { scale: 0.94, filter: "brightness(0.9)" },
        {
          scale: 1,
          filter: "brightness(1)",
          duration: 0.7,
          ease: "elastic.out(1, 0.5)",
        }
      );
    }
  }, [progress]);

  // Step change animation
  useEffect(() => {
    if (!stepSurfaceRef.current) return;
    gsap.fromTo(
      stepSurfaceRef.current,
      {
        autoAlpha: 0,
        x: direction > 0 ? 60 : -60,
        rotateY: direction > 0 ? 5 : -5,
      },
      {
        autoAlpha: 1,
        x: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power3.out",
      }
    );
  }, [currentStep, direction]);

  const [isThinking, setIsThinking] = useState(false);

  // Confetti burst animation
  const triggerConfetti = () => {
    if (!confettiContainerRef.current) return;

    const colors = ["#FCA311", "#E89310", "#FFD700", "#FF6B6B", "#4ECDC4", "#45B7D1"];
    const container = confettiContainerRef.current;

    for (let i = 0; i < 80; i++) {
      const particle = document.createElement("div");
      const size = Math.random() * 12 + 4;
      const isCircle = Math.random() > 0.5;

      particle.className = "absolute pointer-events-none";
      particle.style.width = `${size}px`;
      particle.style.height = isCircle ? `${size}px` : `${size * 0.4}px`;
      particle.style.borderRadius = isCircle ? "50%" : "2px";
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = "50%";
      particle.style.top = "50%";
      particle.style.boxShadow = `0 0 ${size}px ${particle.style.background}`;

      container.appendChild(particle);

      const angle = (Math.random() * Math.PI * 2);
      const velocity = 150 + Math.random() * 300;
      const rotation = Math.random() * 1080 - 540;

      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity * 0.6 - Math.random() * 200,
        rotation,
        opacity: 0,
        duration: 2 + Math.random(),
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    }
  };

  const handleNext = async () => {
    if (currentStep === totalSteps - 1) {
      const payload = getFinalPayload();
      console.log("Deep Sync Assessment – Final payload:", payload);
      nextStep();
      return;
    }

    setIsThinking(true);
    setDirection(1);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsThinking(false);
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

  // Trigger confetti on completion
  useEffect(() => {
    if (isComplete) {
      setTimeout(triggerConfetti, 500);
    }
  }, [isComplete]);

  if (isComplete) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a1225] px-4">
        <ParticleBackground />

        {/* Confetti container */}
        <div
          ref={confettiContainerRef}
          className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative z-10 mb-8"
        >
          <AssessmentAvatar isAsking={false} isCelebrating />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.46, 0.45, 0.94],
            delay: 0.2,
          }}
          className="relative z-10 max-w-md rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.1] to-white/[0.03] p-10 text-center shadow-2xl backdrop-blur-2xl"
        >
          {/* Decorative gradient */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FCA311]/10 via-transparent to-blue-500/5 pointer-events-none" />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.4,
            }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#FCA311] to-[#E89310] shadow-lg shadow-[#FCA311]/40"
          >
            <motion.svg
              className="h-10 w-10 text-[#14213D]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.polyline
                points="20 6 9 17 4 12"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </motion.svg>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-3xl font-bold tracking-tight text-white"
          >
            You're all set!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-4 text-[#E5E5E5]/80 leading-relaxed"
          >
            Your personalized learning journey is about to begin. We've
            tailored everything based on your responses.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            type="button"
            onClick={handleComplete}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative mt-8 overflow-hidden rounded-xl bg-gradient-to-r from-[#FCA311] to-[#E89310] px-10 py-4 font-semibold text-[#14213D] shadow-xl shadow-[#FCA311]/30 transition-all hover:shadow-[#FCA311]/50"
          >
            <span className="relative z-10">Let's Go! →</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
                repeatDelay: 1,
              }}
            />
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex min-h-screen flex-col overflow-hidden bg-[#0a1225]"
      style={{ perspective: 1200 }}
    >
      <ParticleBackground />

      {/* Premium Progress Bar */}
      <div className="relative z-10">
        <div className="h-1.5 w-full bg-white/5 overflow-hidden">
          <motion.div
            ref={progressRef}
            className="h-full rounded-r-full bg-gradient-to-r from-[#FCA311] via-[#FFD700] to-[#FCA311]"
            style={{
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "200% 0%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          {/* Glow orb following progress */}
          <div
            ref={progressGlowRef}
            className="absolute top-0 h-1.5 w-8 -translate-x-1/2 rounded-full bg-[#FCA311] blur-md"
            style={{ left: `${progress}%` }}
          />
        </div>

        {/* Progress info */}
        <motion.div
          className="mx-auto flex max-w-2xl justify-between px-4 pt-4 text-xs"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <span className="flex items-center gap-2 text-[#E5E5E5]/60">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FCA311]/20 text-[#FCA311] font-semibold">
              {currentStep + 1}
            </span>
            <span>of {totalSteps} questions</span>
          </span>
          <motion.span
            className="font-semibold text-[#FCA311]"
            key={Math.round(progress)}
            initial={{ scale: 1.2, opacity: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            {Math.round(progress)}%
          </motion.span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col items-center px-4 py-6 sm:py-8">
        <motion.div
          ref={avatarContainerRef}
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <AssessmentAvatar
            isAsking
            isCelebrating={false}
            isThinking={isThinking}
          />
        </motion.div>

        <AnimatePresence mode="wait" custom={direction}>
          {currentQuestion && (
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="flex w-full max-w-2xl flex-col items-center"
              ref={(el) => {
                stepSurfaceRef.current = el;
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <QuestionSpeechBubble
                question={currentQuestion.question}
                stepIndex={currentStep}
                totalSteps={totalSteps}
                isActive={true}
              />

              {currentQuestion.type === "singleSelect" && (
                <SingleSelectStep
                  options={currentQuestion.options}
                  value={currentValue}
                  onChange={(v) => {
                    setAnswer(currentQuestion.key, v);
                  }}
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
