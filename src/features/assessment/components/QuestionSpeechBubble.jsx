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
  className = "",
}) {
  const bubbleRef = useRef(null);
  const cursorRef = useRef(null);
  const contentRef = useRef(null);
  const words = useMemo(
    () => (question ? question.split(" ") : []),
    [question],
  );

  useGSAP(
    () => {
      if (!question || !isActive || !bubbleRef.current) return;
      const bubbleEl = bubbleRef.current;
      const wordEls = bubbleEl.querySelectorAll("[data-word]");

      gsap.set(wordEls, { opacity: 0, y: 8 });
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

      tl.fromTo(
        bubbleEl,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" },
      );

      tl.to(
        wordEls,
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.18,
          stagger: { each: 0.022, ease: "power2.out" },
        },
        "-=0.1",
      );

      return () => {
        cursorBlink?.kill();
      };
    },
    { dependencies: [question, isActive], scope: bubbleRef },
  );

  if (!question) return null;

  return (
    <motion.div
      ref={bubbleRef}
      className={`relative max-w-2xl ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ perspective: 1000 }}
    >
      {/* Speech bubble - clean, tail points at avatar */}
      <div className="relative rounded-xl rounded-tl-sm border border-white/10 bg-white/5 px-5 py-4 sm:px-6 sm:py-5">
        <div className="absolute -left-2 top-8 w-4 h-4 rotate-45 border-l border-b border-white/10 bg-white/5" />

        {/* Question text */}
        <p
          ref={contentRef}
          className="relative min-h-[1.5em] text-base font-medium leading-relaxed text-white sm:text-lg"
        >
          {words.map((word, idx) => (
            <span key={`${word}-${idx}`} data-word className="inline-block">
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
