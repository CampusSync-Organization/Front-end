import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function AssessmentAvatar({
  isAsking,
  isCelebrating,
  isThinking,
  className = "",
}) {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const particlesRef = useRef([]);

  // Enhanced idle animation with GSAP
  useEffect(() => {
    if (!containerRef.current) return;

    // Floating animation
    const floatTween = gsap.to(containerRef.current, {
      y: -8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    // Subtle rotation for life-like feel
    const rotateTween = gsap.to(containerRef.current, {
      rotation: 2,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    return () => {
      floatTween.kill();
      rotateTween.kill();
    };
  }, []);

  // Dynamic glow based on state
  useEffect(() => {
    if (!glowRef.current) return;

    if (isThinking) {
      gsap.to(glowRef.current, {
        boxShadow: "0 0 60px rgba(252,163,17,0.6), 0 0 120px rgba(252,163,17,0.3)",
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out",
      });

      // Pulsing during thinking
      gsap.to(glowRef.current, {
        boxShadow: [
          "0 0 40px rgba(252,163,17,0.4)",
          "0 0 80px rgba(252,163,17,0.6)",
        ],
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });
    } else if (isCelebrating) {
      gsap.to(glowRef.current, {
        boxShadow: "0 0 100px rgba(252,163,17,0.7), 0 0 200px rgba(252,163,17,0.4)",
        scale: 1.2,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    } else {
      gsap.to(glowRef.current, {
        boxShadow: "0 0 40px rgba(252,163,17,0.3)",
        scale: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [isThinking, isCelebrating]);

  return (
    <motion.div
      ref={containerRef}
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { type: "spring", stiffness: 200, damping: 18 },
        y: { type: "spring", stiffness: 150, damping: 15 },
      }}
    >
      <motion.div
        className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36"
        animate={
          isThinking
            ? {
                scale: [1, 0.97, 1],
                rotate: [0, 3, -3, 0],
              }
            : isCelebrating
            ? {
                scale: [1, 1.15, 1.1],
                rotate: [0, 10, -10, 5, 0],
              }
            : isAsking
            ? {
                scale: [1, 1.03, 1],
              }
            : {}
        }
        transition={{
          repeat: isThinking || isAsking ? Infinity : 0,
          duration: isThinking ? 1.2 : isCelebrating ? 0.8 : 3,
          ease: "easeInOut",
        }}
      >
        {/* Outer glow ring */}
        <motion.div
          ref={glowRef}
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(252,163,17,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Orbiting particles during thinking/celebrating */}
        {(isThinking || isCelebrating) && (
          <div className="absolute inset-0">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full bg-[#FCA311]"
                style={{
                  marginLeft: -4,
                  marginTop: -4,
                  boxShadow: "0 0 10px rgba(252,163,17,0.8)",
                }}
                animate={{
                  x: [
                    Math.cos((i / 6) * Math.PI * 2) * 50,
                    Math.cos((i / 6 + 0.5) * Math.PI * 2) * 55,
                    Math.cos((i / 6 + 1) * Math.PI * 2) * 50,
                  ],
                  y: [
                    Math.sin((i / 6) * Math.PI * 2) * 50,
                    Math.sin((i / 6 + 0.5) * Math.PI * 2) * 55,
                    Math.sin((i / 6 + 1) * Math.PI * 2) * 50,
                  ],
                  scale: [0.8, 1.2, 0.8],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: isThinking ? 2 : 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}

        {/* Avatar container */}
        <motion.div
          className="relative flex h-full w-full items-end justify-center overflow-hidden rounded-full border-2 bg-gradient-to-b from-[#1e325a] to-[#14213D]"
          animate={{
            borderColor: isThinking
              ? "rgba(252,163,17,0.9)"
              : isCelebrating
              ? "rgba(252,163,17,1)"
              : "rgba(252,163,17,0.4)",
          }}
          transition={{ duration: 0.3 }}
          style={{
            boxShadow: "inset 0 -10px 30px rgba(0,0,0,0.3)",
          }}
        >
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/10 pointer-events-none" />

          <svg
            viewBox="0 0 120 120"
            className="h-full w-full p-4"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Head */}
            <circle cx="60" cy="52" r="28" fill="#E5E5E5" opacity={0.95} />

            {/* Face highlight */}
            <ellipse cx="54" cy="45" rx="12" ry="8" fill="white" opacity={0.1} />

            {/* Left Eye */}
            <motion.ellipse
              cx="52"
              cy="48"
              rx="4"
              fill="#14213D"
              animate={
                isThinking
                  ? { ry: 1.5, cy: 47 }
                  : {
                      ry: [5, 0.5, 5],
                      cy: [48, 48, 48],
                    }
              }
              transition={
                isThinking
                  ? { duration: 0.2 }
                  : {
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      times: [0, 0.05, 0.1],
                    }
              }
            />

            {/* Right Eye */}
            <motion.ellipse
              cx="68"
              cy="48"
              rx="4"
              fill="#14213D"
              animate={
                isThinking
                  ? { ry: 1.5, cy: 47 }
                  : {
                      ry: [5, 0.5, 5],
                      cy: [48, 48, 48],
                    }
              }
              transition={
                isThinking
                  ? { duration: 0.2 }
                  : {
                      duration: 3,
                      repeat: Infinity,
                      repeatDelay: 2,
                      times: [0, 0.05, 0.1],
                      delay: 0.05,
                    }
              }
            />

            {/* Eye shine */}
            <circle cx="54" cy="46" r="1.5" fill="white" opacity={0.8} />
            <circle cx="70" cy="46" r="1.5" fill="white" opacity={0.8} />

            {/* Mouth */}
            <motion.path
              stroke="#14213D"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              opacity={0.8}
              animate={
                isThinking
                  ? { d: "M48 64 Q60 64 72 64" }
                  : isCelebrating
                  ? { d: "M45 60 Q60 75 75 60" }
                  : { d: "M45 62 Q60 72 75 62" }
              }
              transition={{ duration: 0.3 }}
            />

            {/* Suit */}
            <path
              d="M30 95 L30 75 Q30 55 60 55 Q90 55 90 75 L90 95"
              fill="#1e325a"
              stroke="#FCA311"
              strokeWidth="1.5"
              strokeLinejoin="round"
              opacity={0.9}
            />

            {/* Crown/Badge */}
            <path
              d="M50 42 L70 42 L72 28 L68 26 L60 32 L52 26 L48 28 Z"
              fill="#FCA311"
              stroke="#E89310"
              strokeWidth="1"
              strokeLinejoin="round"
            />
            <motion.path
              d="M50 42 L70 42 L72 28 L68 26 L60 32 L52 26 L48 28 Z"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
              opacity={0.3}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Badge detail */}
            <rect
              x="56"
              y="22"
              width="8"
              height="12"
              rx="1"
              fill="#14213D"
              opacity={0.3}
            />

            {/* Thinking bubbles */}
            {isThinking && (
              <>
                <motion.circle
                  cx="85"
                  cy="35"
                  r="3"
                  fill="#FCA311"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -15, -20] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                />
                <motion.circle
                  cx="95"
                  cy="25"
                  r="5"
                  fill="#FCA311"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -15, -25] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                />
                <motion.circle
                  cx="108"
                  cy="15"
                  r="7"
                  fill="#FCA311"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -15, -30] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                />
              </>
            )}
          </svg>
        </motion.div>

        {/* Question mark badge */}
        {isAsking && !isThinking && (
          <motion.div
            initial={{ scale: 0, opacity: 0, rotate: -180 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#FCA311] to-[#E89310] shadow-lg shadow-[#FCA311]/50"
          >
            <motion.span
              className="text-sm font-bold text-[#14213D]"
              animate={{ opacity: [1, 0.5, 1], scale: [1, 0.9, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ?
            </motion.span>
          </motion.div>
        )}

        {/* Celebration stars */}
        {isCelebrating && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute text-[#FCA311]"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  x: [0, (i % 2 === 0 ? 1 : -1) * (40 + i * 15)],
                  y: [-20, -(50 + i * 10)],
                  rotate: [0, 180],
                }}
                transition={{
                  duration: 1,
                  delay: i * 0.15,
                  repeat: 2,
                }}
              >
                ✨
              </motion.div>
            ))}
          </>
        )}
      </motion.div>

      {/* Label */}
      <motion.p
        className="mt-4 text-center text-sm font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "linear-gradient(90deg, #FCA311, #FFD700, #FCA311)",
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        <motion.span
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{
            background: "linear-gradient(90deg, #FCA311, #FFD700, #FCA311)",
            backgroundSize: "200% 100%",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          CampusSync Guide
        </motion.span>
      </motion.p>
    </motion.div>
  );
}
