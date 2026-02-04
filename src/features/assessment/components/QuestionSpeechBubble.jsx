import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function QuestionSpeechBubble({
  question,
  stepIndex,
  totalSteps,
  isActive,
  onRevealComplete,
}) {
  const bubbleRef = useRef(null);
  const cursorRef = useRef(null);
  const contentRef = useRef(null);
  const words = useMemo(() => (question ? question.split(" ") : []), [question]);

  useGSAP(
    () => {
      if (!question || !isActive || !bubbleRef.current) return;
      const bubbleEl = bubbleRef.current;
      const wordEls = bubbleEl.querySelectorAll("[data-word]");

      // Initial state
      gsap.set(wordEls, { opacity: 0, y: 25, rotateX: 45, transformOrigin: "0% 50% -50" });
      if (cursorRef.current) {
        gsap.set(cursorRef.current, { opacity: 0, scaleY: 0 });
      }

      // Blinking cursor animation
      const cursorBlink =
        cursorRef.current &&
        gsap.to(cursorRef.current, {
          opacity: 0.3,
          duration: 0.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

      // Show cursor
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          scaleY: 1,
          opacity: 1,
          duration: 0.3,
          ease: "back.out(2)",
        });
      }

      // Main timeline
      const tl = gsap.timeline({
        defaults: { ease: "back.out(1.7)" },
        onComplete: () => {
          cursorBlink?.kill();
          if (cursorRef.current) {
            gsap.to(cursorRef.current, {
              opacity: 0,
              scaleY: 0,
              duration: 0.3,
              ease: "power2.in",
            });
          }
          onRevealComplete?.();
        },
      });

      // Bubble entrance with elastic effect
      tl.fromTo(
        bubbleEl,
        {
          opacity: 0,
          y: 30,
          scale: 0.9,
          rotateX: 10,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.75)",
        }
      );

      // Word-by-word reveal with 3D spring effect
      tl.to(
        wordEls,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.4,
          stagger: {
            each: 0.06,
            ease: "power2.out",
          },
        },
        "-=0.3"
      );

      // Gradient sweep across text
      if (contentRef.current) {
        tl.fromTo(
          contentRef.current,
          {
            backgroundPosition: "-100% 0",
          },
          {
            backgroundPosition: "200% 0",
            duration: 1.2,
            ease: "power2.inOut",
          },
          "-=0.6"
        );
      }

      return () => {
        cursorBlink?.kill();
      };
    },
    { dependencies: [question, isActive], scope: bubbleRef }
  );

  if (!question) return null;

  return (
    <motion.div
      ref={bubbleRef}
      className="relative mx-auto max-w-2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ perspective: 1000 }}
    >
      {/* Ambient glow behind bubble */}
      <div className="absolute inset-0 -z-10 blur-3xl">
        <div className="absolute inset-0 rounded-full bg-[#FCA311]/10 scale-150" />
      </div>

      <div className="relative rounded-3xl rounded-tl-lg border border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] px-6 py-5 shadow-2xl shadow-black/30 backdrop-blur-2xl sm:px-8 sm:py-6">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-3xl rounded-tl-lg bg-gradient-to-br from-white/5 via-transparent to-[#FCA311]/5 pointer-events-none" />

        {/* Speech bubble pointer */}
        <div className="absolute -left-2 top-8 h-4 w-4 rotate-45 border-l border-b border-white/15 bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-2xl" />

        {/* Step indicator */}
        <motion.div
          className="flex items-center gap-2 mb-4"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex gap-1">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <motion.div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= stepIndex
                    ? "w-4 bg-[#FCA311]"
                    : "w-1.5 bg-white/20"
                }`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 + i * 0.03 }}
              />
            ))}
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#FCA311]">
            {stepIndex + 1}/{totalSteps}
          </span>
        </motion.div>

        {/* Question text with gradient sweep effect */}
        <p
          ref={contentRef}
          className="relative min-h-[1.5em] text-xl font-semibold leading-relaxed text-white sm:text-2xl"
          style={{
            backgroundImage:
              "linear-gradient(90deg, white 0%, #FCA311 50%, white 100%)",
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          {words.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              data-word
              className="inline-block"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {word}
              {idx !== words.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
          {/* Typing cursor */}
          <span
            ref={cursorRef}
            className="ml-1 inline-block h-6 w-0.5 bg-[#FCA311] align-middle sm:h-7 origin-bottom"
            style={{ transform: "scaleY(0)" }}
          />
        </p>
      </div>
    </motion.div>
  );
}
