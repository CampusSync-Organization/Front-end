import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Users, MessageCircle, Users2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer a few questions",
    line: "Quick, fun assessment—we learn how you work and what you care about.",
  },
  {
    icon: Users,
    title: "We find your people",
    line: "Our matching picks students who share your vibe and goals, not random faces.",
  },
  {
    icon: MessageCircle,
    title: "Chat in a safe space",
    line: "Break the ice with moderation so it stays real, not weird.",
  },
  {
    icon: Users2,
    title: "Build teams when ready",
    line: "Form squads for projects, hackathons, or just studying together.",
  },
];

const HowItWorksSection = forwardRef(function HowItWorksSection(_, forwardedRef) {
  const sectionRef = useRef(null);

  useImperativeHandle(forwardedRef, () => sectionRef.current);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-amber-400/80 text-sm font-medium tracking-widest uppercase mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Four simple steps to find your tribe
          </h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-amber-400/40 via-slate-700 to-transparent hidden sm:block"
            aria-hidden
          />

          <ul className="space-y-0">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.li
                  key={i}
                  className="relative flex gap-8 sm:gap-12 py-12 sm:py-16 border-b border-slate-800/50 last:border-0"
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <div className="relative z-10 flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-700/80 text-amber-400">
                    <Icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <span className="text-slate-500 text-sm font-medium tabular-nums">
                      0{i + 1}
                    </span>
                    <h3 className="text-xl font-semibold text-white mt-1 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-slate-400 mt-2 text-[15px] leading-relaxed max-w-xl">
                      {step.line}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
});

export default HowItWorksSection;
