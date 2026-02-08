import { forwardRef, useImperativeHandle, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  { title: "You answer a few questions", line: "Quick, fun assessment—we learn how you work and what you care about." },
  { title: "We find your people", line: "Our matching picks students who share your vibe and goals, not random faces." },
  { title: "You chat in a safe space", line: "Break the ice with moderation so it stays real, not weird." },
  { title: "You build teams when you're ready", line: "Form squads for projects, hackathons, or just studying together." },
];

const HowItWorksSection = forwardRef(function HowItWorksSection(_, forwardedRef) {
  const sectionRef = useRef(null);

  useImperativeHandle(forwardedRef, () => sectionRef.current);

  useGSAP(
    () => {
      if (!sectionRef.current) return;
      gsap.from(".how-it-works-heading", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 85%" },
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      });
      gsap.from(".how-it-works-step", {
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
        y: 16,
        opacity: 0,
        duration: 0.45,
        stagger: 0.1,
        ease: "power3.out",
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      className="pt-20 lg:pt-28 pb-20 lg:pb-28 px-4 sm:px-6 lg:px-8 bg-slate-950"
    >
      <div className="max-w-2xl mx-auto">
        <h2 className="how-it-works-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
          How it works
        </h2>
        <p className="text-slate-400 text-lg mt-2 mb-16">
          No forms. No algorithms in the dark. Just four steps.
        </p>

        <ul className="space-y-12 sm:space-y-14">
          {steps.map((step, i) => (
            <li key={i} className="how-it-works-step">
              <span className="text-amber-400/80 text-sm font-medium tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold text-white mt-1">
                {step.title}
              </h3>
              <p className="text-slate-400 mt-2 leading-relaxed">
                {step.line}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
});

export default HowItWorksSection;
