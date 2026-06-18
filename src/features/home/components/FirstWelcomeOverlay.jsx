import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, Calendar, MessageSquare } from "lucide-react";

const FEATURES = [
  { Icon: Users,          label: "Smart peer matching"           },
  { Icon: Calendar,       label: "Campus events & communities"   },
  { Icon: MessageSquare,  label: "Connect & chat with peers"     },
];

const PHASE_2_AT = 3200;   // ms before switching to features
const EXIT_AT    = 6200;   // ms before starting the fade-out
const TOTAL      = 7000;   // ms total

export default function FirstWelcomeOverlay({ name, onDismiss }) {
  const [phase, setPhase]     = useState(1); // 1 = greeting, 2 = features
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2),       PHASE_2_AT);
    const t2 = setTimeout(() => setLeaving(true),  EXIT_AT);
    const t3 = setTimeout(onDismiss,               TOTAL);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {!leaving && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center px-8 overflow-hidden"
        >

          {/* ── Phase 1: greeting ── */}
          <AnimatePresence mode="wait">
            {phase === 1 && (
              <motion.div
                key="greeting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="flex flex-col items-center text-center gap-4"
              >
                {/* Logo */}
                <motion.img
                  src="/campussync-icon.png"
                  alt=""
                  className="h-12 w-12 object-contain mb-2"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                />

                {/* Greeting */}
                <motion.p
                  className="text-[#86868b] text-[15px] font-medium"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  Welcome to CampusSync
                </motion.p>

                {/* Name */}
                <motion.h1
                  className="text-[52px] sm:text-[64px] font-black tracking-tight leading-none text-[#14213D]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.32, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  Hi, <span className="text-[#FCA311]">{name || "there"}</span>.
                </motion.h1>

                {/* Sub */}
                <motion.p
                  className="text-[#c0c0c8] text-[14px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  Your profile is ready.
                </motion.p>
              </motion.div>
            )}

            {/* ── Phase 2: features ── */}
            {phase === 2 && (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center text-center gap-8"
              >
                {/* Heading */}
                <div>
                  <motion.div
                    className="inline-flex items-center gap-2 mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Sparkles className="w-4 h-4 text-[#FCA311]" />
                    <span className="text-[11px] font-bold tracking-[0.2em] text-[#FCA311] uppercase">
                      Here's what's waiting
                    </span>
                  </motion.div>
                  <motion.h2
                    className="text-[30px] sm:text-[38px] font-bold text-[#14213D] tracking-tight leading-tight"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Your campus,<br />personalized for you.
                  </motion.h2>
                </div>

                {/* Feature rows — plain, no cards */}
                <div className="flex flex-col items-start gap-5 w-full max-w-[300px]">
                  {FEATURES.map(({ Icon, label }, i) => (
                    <motion.div
                      key={label}
                      className="flex items-center gap-4"
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.25 + i * 0.14,
                        duration: 0.5,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#FCA311]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#FCA311]" strokeWidth={2} />
                      </div>
                      <span className="text-[#14213D] font-medium text-[15px]">{label}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Thin progress line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] bg-[#FCA311]"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: TOTAL / 1000, ease: "linear" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
