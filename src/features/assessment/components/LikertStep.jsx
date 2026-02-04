import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function LikertStep({
  min,
  max,
  labels,
  value,
  onChange,
  onNext,
  onBack,
  canGoNext,
  stepIndex,
  totalSteps,
}) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const containerRef = useRef(null);
  const optionRefs = useRef([]);
  const cardRef = useRef(null);
  const actionsRef = useRef(null);
  const progressLineRef = useRef(null);

  optionRefs.current = [];

  // Premium entrance animation
  useGSAP(
    () => {
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { opacity: 0, y: 30, scale: 0.95, rotateX: 10 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          }
        );
      }
      const items = optionRefs.current.filter(Boolean);
      if (items.length) {
        gsap.fromTo(
          items,
          {
            opacity: 0,
            scale: 0.6,
            y: 30,
          },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.5,
            stagger: {
              each: 0.06,
              from: "center",
            },
            ease: "elastic.out(1, 0.6)",
            delay: 0.2,
          }
        );
      }
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current.children,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            stagger: 0.08,
            ease: "back.out(1.7)",
            delay: 0.4,
          }
        );
      }
    },
    { dependencies: [stepIndex], scope: containerRef }
  );

  // Enhanced selection animation with wave effect
  useEffect(() => {
    if (value == null) return;
    const index = value - min;
    const element = optionRefs.current[index];
    if (!element) return;

    // Pulse wave through adjacent elements
    optionRefs.current.forEach((el, idx) => {
      if (!el) return;
      const distance = Math.abs(idx - index);
      const delay = distance * 0.05;
      const scale = idx === index ? 1.15 : Math.max(0.9, 1 - distance * 0.03);
      const opacity = idx === index ? 1 : Math.max(0.5, 1 - distance * 0.15);

      gsap.to(el, {
        scale,
        opacity,
        duration: 0.4,
        delay,
        ease: "elastic.out(1, 0.5)",
      });
    });

    // Special animation for selected element
    gsap.fromTo(
      element,
      { scale: 0.85 },
      {
        scale: 1.15,
        duration: 0.5,
        ease: "elastic.out(1.2, 0.4)",
      }
    );

    // Glow effect
    gsap.to(element, {
      boxShadow: "0 0 40px rgba(252,163,17,0.5), 0 0 80px rgba(252,163,17,0.25)",
      duration: 0.3,
    });

    return () => {
      optionRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            boxShadow: "none",
            duration: 0.2,
          });
        }
      });
    };
  }, [value, min]);

  // Calculate progress for visual indicator
  const progressPercent = value != null ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-2xl space-y-8 pt-6">
      <motion.div
        ref={cardRef}
        className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Decorative glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#FCA311]/5 via-transparent to-blue-500/5 pointer-events-none" />

        {/* Labels */}
        <div className="relative flex justify-between text-xs font-medium text-[#E5E5E5]/70 mb-6">
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
              {min}
            </span>
            <span className="hidden sm:inline">{labels[min]}</span>
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            <span className="hidden sm:inline">{labels[max]}</span>
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-lg">
              {max}
            </span>
          </motion.span>
        </div>

        {/* Progress line */}
        <div className="relative mb-6">
          <div className="absolute top-1/2 left-4 right-4 h-1 -translate-y-1/2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              ref={progressLineRef}
              className="h-full bg-gradient-to-r from-[#FCA311] to-[#FFD700] rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Number buttons */}
          <div className="relative flex justify-center gap-2 sm:gap-3">
            {range.map((n, idx) => {
              const isSelected = value === n;
              return (
                <LikertButton
                  key={n}
                  n={n}
                  index={idx}
                  isSelected={isSelected}
                  onChange={onChange}
                  optionRefs={optionRefs}
                  totalRange={range.length}
                />
              );
            })}
          </div>
        </div>

        {/* Mobile labels */}
        <div className="flex justify-between text-xs text-[#E5E5E5]/60 sm:hidden px-2">
          <span>{labels[min]}</span>
          <span>{labels[max]}</span>
        </div>
      </motion.div>

      {/* Action buttons */}
      <div ref={actionsRef} className="flex gap-4 pt-2">
        <motion.button
          type="button"
          onClick={onBack}
          whileHover={{ scale: 1.03, x: -3 }}
          whileTap={{ scale: 0.97 }}
          className="group relative rounded-xl border border-white/20 px-6 py-3.5 font-medium text-white transition-all duration-300 hover:bg-white/10 hover:border-white/40 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <motion.span
              animate={{ x: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            >
              ←
            </motion.span>
            Back
          </span>
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          whileHover={canGoNext ? { scale: 1.03 } : {}}
          whileTap={canGoNext ? { scale: 0.97 } : {}}
          className="group relative flex-1 rounded-xl bg-gradient-to-r from-[#FCA311] to-[#E89310] px-8 py-3.5 font-semibold text-[#14213D] shadow-lg shadow-[#FCA311]/30 transition-all duration-300 hover:shadow-[#FCA311]/50 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {stepIndex === totalSteps - 1 ? "Complete" : "Next"}
            <motion.span
              animate={canGoNext ? { x: [0, 5, 0] } : {}}
              transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
            >
              →
            </motion.span>
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            initial={{ x: "-100%" }}
            animate={canGoNext ? { x: "100%" } : {}}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", repeatDelay: 1 }}
          />
        </motion.button>
      </div>
    </div>
  );
}

function LikertButton({ n, index, isSelected, onChange, optionRefs, totalRange }) {
  const ref = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 500, damping: 50 });
  const springY = useSpring(mouseY, { stiffness: 500, damping: 50 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(springY, [-10, 10], [10, -10]);
  const rotateY = useTransform(springX, [-10, 10], [-10, 10]);

  return (
    <motion.button
      type="button"
      onClick={() => onChange(n)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={(el) => {
        ref.current = el;
        if (el) optionRefs.current[index] = el;
      }}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border-2 font-bold text-lg transition-all duration-300 sm:h-14 sm:w-14 ${
        isSelected
          ? "border-[#FCA311] bg-gradient-to-br from-[#FCA311] to-[#E89310] text-[#14213D] shadow-[0_0_30px_rgba(252,163,17,0.5)]"
          : "border-white/15 bg-white/5 text-white hover:border-white/30 hover:bg-white/10"
      }`}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: isSelected ? 1.15 : 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Glow ring for selected */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.5, 1, 0.5],
            boxShadow: [
              "0 0 0 0 rgba(252,163,17,0.4)",
              "0 0 0 6px rgba(252,163,17,0)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}

      {/* Inner shine */}
      {isSelected && (
        <motion.div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          />
        </motion.div>
      )}

      <span className="relative z-10">{n}</span>
    </motion.button>
  );
}
