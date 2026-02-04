import { useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionTemplate } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function SingleSelectStep({
  options,
  value,
  onChange,
  onNext,
  onBack,
  canGoNext,
  stepIndex,
  totalSteps,
}) {
  const containerRef = useRef(null);
  const optionRefs = useRef([]);
  const actionsRef = useRef(null);

  optionRefs.current = [];

  // Premium staggered entrance with 3D effect
  useGSAP(
    () => {
      const items = optionRefs.current.filter(Boolean);
      if (items.length) {
        gsap.set(items, { perspective: 1000 });
        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotateX: 25,
            transformOrigin: "50% 100%",
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "elastic.out(1, 0.7)",
            stagger: {
              each: 0.1,
              from: "start",
            },
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
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 0.3,
          }
        );
      }
    },
    { dependencies: [stepIndex], scope: containerRef }
  );

  // Enhanced selection animation
  useEffect(() => {
    if (value == null) return;
    const selectedIndex = options.findIndex((opt) => opt === value);
    if (selectedIndex === -1) return;
    const element = optionRefs.current[selectedIndex];
    if (!element) return;

    // Create ripple effect
    const ripple = document.createElement("div");
    ripple.className = "absolute inset-0 rounded-2xl pointer-events-none overflow-hidden";
    const rippleInner = document.createElement("div");
    rippleInner.className = "absolute w-full h-full";
    rippleInner.style.background = "radial-gradient(circle, rgba(252,163,17,0.4) 0%, transparent 70%)";
    rippleInner.style.transform = "scale(0)";
    ripple.appendChild(rippleInner);
    element.appendChild(ripple);

    gsap.to(rippleInner, {
      scale: 3,
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    });

    // Glow and bounce effect
    gsap.fromTo(
      element,
      { scale: 0.92 },
      {
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1.2, 0.5)",
      }
    );

    gsap.to(element, {
      boxShadow: "0 0 50px rgba(252,163,17,0.4), 0 0 100px rgba(252,163,17,0.2)",
      duration: 0.3,
      ease: "power2.out",
    });

    // Animate other options slightly away
    optionRefs.current.forEach((el, idx) => {
      if (el && idx !== selectedIndex) {
        gsap.to(el, {
          scale: 0.98,
          opacity: 0.7,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    });

    return () => {
      optionRefs.current.forEach((el) => {
        if (el) {
          gsap.to(el, {
            scale: 1,
            opacity: 1,
            duration: 0.2,
          });
        }
      });
    };
  }, [value, options]);

  return (
    <div ref={containerRef} className="mx-auto w-full max-w-2xl space-y-8 pt-6">
      <ul className="grid gap-4 sm:grid-cols-1">
        {options.map((opt, index) => {
          const isSelected = value === opt;
          return (
            <OptionItem
              key={opt}
              opt={opt}
              index={index}
              isSelected={isSelected}
              onChange={onChange}
              optionRefs={optionRefs}
            />
          );
        })}
      </ul>

      <div ref={actionsRef} className="flex gap-4 pt-4">
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
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.button>
        <motion.button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          whileHover={canGoNext ? { scale: 1.03, x: 3 } : {}}
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

function OptionItem({ opt, index, isSelected, onChange, optionRefs }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 400, damping: 50 });
  const mouseY = useSpring(y, { stiffness: 400, damping: 50 });

  // Magnetic effect
  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate distance from center
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Stronger magnetic pull
    x.set(deltaX * 0.15);
    y.set(deltaY * 0.15);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const rotateX = useTransform(mouseY, [-50, 50], [8, -8]);
  const rotateY = useTransform(mouseX, [-50, 50], [-8, 8]);
  const shineX = useTransform(mouseX, [-50, 50], ["20%", "80%"]);
  const shineY = useTransform(mouseY, [-50, 50], ["20%", "80%"]);

  return (
    <motion.li
      style={{
        x: mouseX,
        y: mouseY,
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="perspective-1000"
    >
      <motion.button
        type="button"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onChange(opt)}
        ref={(el) => {
          ref.current = el;
          if (el && !optionRefs.current.includes(el)) {
            optionRefs.current.push(el);
          }
        }}
        className={`relative w-full overflow-hidden rounded-2xl border-2 px-6 py-5 text-left transition-all duration-300 ${
          isSelected
            ? "border-[#FCA311] bg-gradient-to-br from-[#FCA311]/20 to-[#FCA311]/5 text-white shadow-[0_0_0_1px_rgba(252,163,17,0.3),0_0_40px_rgba(252,163,17,0.2),0_20px_40px_rgba(0,0,0,0.3)]"
            : "border-white/10 bg-white/5 text-white hover:border-white/25 hover:bg-white/[0.08] hover:shadow-lg hover:shadow-black/20"
        }`}
        whileTap={{ scale: 0.98 }}
      >
        {/* Dynamic shine effect */}
        <motion.div
          style={{
            background: useMotionTemplate`radial-gradient(circle 150px at ${shineX} ${shineY}, rgba(255,255,255,0.15), transparent 80%)`,
          }}
          className="absolute inset-0 z-0 pointer-events-none"
        />

        {/* Selection glow overlay */}
        {isSelected && (
          <motion.div
            layoutId="selectGlow"
            className="absolute inset-0 bg-gradient-to-r from-[#FCA311]/15 via-transparent to-[#FCA311]/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}

        {/* Animated border glow for selected */}
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(252,163,17,0.3), transparent)",
              backgroundSize: "200% 100%",
            }}
            animate={{
              backgroundPosition: ["0% 0%", "200% 0%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        <span className="relative z-10 text-lg font-medium">{opt}</span>

        {/* Checkmark with premium animation */}
        {isSelected && (
          <motion.span
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.1 }}
            className="absolute right-5 top-1/2 -translate-y-1/2"
          >
            <motion.div
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCA311]"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(252,163,17,0.4)",
                  "0 0 0 8px rgba(252,163,17,0)",
                ],
              }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <svg className="h-4 w-4 text-[#14213D]" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </motion.div>
          </motion.span>
        )}
      </motion.button>
    </motion.li>
  );
}
