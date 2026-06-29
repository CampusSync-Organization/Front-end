import { forwardRef, useImperativeHandle, useRef } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Users, MessageCircle, Users2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Answer a few questions",
    line: "A quick, fun assessment learns how you work and what you care about.",
    accent: "#FCA311",
  },
  {
    icon: Users,
    title: "We find your people",
    line: "Our AI matching picks students who share your vibe and goals — not random faces.",
    accent: "#14213D",
  },
  {
    icon: MessageCircle,
    title: "Chat in a safe space",
    line: "Break the ice with AI moderation so conversations stay real, never weird.",
    accent: "#E89310",
  },
  {
    icon: Users2,
    title: "Build teams when ready",
    line: "Form squads for projects, hackathons, or just studying together.",
    accent: "#FCA311",
  },
];

const HowItWorksSection = forwardRef(function HowItWorksSection(_, forwardedRef) {
  const sectionRef = useRef(null);
  useImperativeHandle(forwardedRef, () => sectionRef.current);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-28 lg:py-36 px-6 bg-[#f7f7f5] overflow-hidden"
    >
      {/* Big faded background word */}
      <span
        aria-hidden
        className="pointer-events-none select-none absolute -top-4 left-1/2 -translate-x-1/2 font-black text-black/[0.03] whitespace-nowrap"
        style={{ fontSize: "clamp(120px, 22vw, 320px)", lineHeight: 1 }}
      >
        PROCESS
      </span>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-amber-500 text-[11px] font-black tracking-widest uppercase mb-4">
            How It Works
          </p>
          <h2 className="font-black text-black tracking-[-0.03em] leading-[1.0]" style={{ fontSize: "clamp(34px, 5.5vw, 64px)" }}>
            Four steps to<br />find your tribe.
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white rounded-[24px] p-7 border border-black/[0.04] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.1)] cursor-default overflow-hidden"
              >
                {/* Accent glow on hover */}
                <div
                  className="absolute -top-12 -right-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle, ${step.accent}22 0%, transparent 70%)` }}
                />

                {/* Big step number watermark */}
                <span
                  aria-hidden
                  className="absolute top-4 right-5 font-black text-black/[0.04] leading-none transition-colors duration-300 group-hover:text-amber-400/20"
                  style={{ fontSize: 72 }}
                >
                  {i + 1}
                </span>

                {/* Icon */}
                <div
                  className="relative rounded-2xl flex items-center justify-center mb-6 transition-transform duration-400 group-hover:scale-110 group-hover:-rotate-6"
                  style={{ background: step.accent, width: 52, height: 52 }}
                >
                  <Icon className="w-6 h-6 text-white" strokeWidth={2.2} />
                </div>

                {/* Text */}
                <span className="text-amber-500 text-[11px] font-black tracking-widest tabular-nums">
                  STEP {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[19px] font-bold text-black mt-1.5 tracking-tight leading-snug">
                  {step.title}
                </h3>
                <p className="text-black/45 text-[14px] leading-relaxed mt-2.5 font-medium">
                  {step.line}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute bottom-0 left-7 right-7 h-[3px] rounded-full origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-400"
                  style={{ background: step.accent }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

export default HowItWorksSection;
