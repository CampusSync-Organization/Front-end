import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function SingleSelectStep({
  options,
  value,
  onChange,
  onNext,
  onBack,
  canGoNext,
  stepIndex,
  totalSteps,
  variant = "default",
  autoAdvance = false,
}) {
  const isMidnight = variant === "midnight";

  return (
    <div className="space-y-6">
      <ul className="grid gap-3">
        {options.map((opt, index) => {
          const isSelected = value === opt;
          return (
            <motion.li
              key={opt}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.04,
                duration: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.button
                type="button"
                onClick={() => onChange(opt)}
                className={`w-full rounded-2xl border-2 px-5 py-4 text-left text-[15px] font-medium transition-all duration-200 flex items-center justify-between gap-3 ${
                  isMidnight
                    ? isSelected
                      ? "border-amber-400 bg-amber-500/20 text-white shadow-[0_0_20px_rgba(251,191,36,0.2)]"
                      : "border-white/10 bg-white/5 text-white hover:border-amber-400/40 hover:bg-white/10"
                    : isSelected
                      ? "border-[#14213D] bg-[#14213D]/5 text-[#1d1d1f] shadow-sm"
                      : "border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#14213D]/40 hover:bg-[#f5f5f7]"
                }`}
                whileHover={isMidnight ? { scale: 1.02 } : undefined}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex-1">{opt}</span>
                {isSelected && (
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      isMidnight ? "bg-amber-400 text-slate-900" : "bg-[#14213D] text-white"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[2.5]" />
                  </span>
                )}
              </motion.button>
            </motion.li>
          );
        })}
      </ul>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className={
            isMidnight
              ? "rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-[15px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:border-white/30"
              : "rounded-xl border border-[#e5e5ea] bg-white px-6 py-3.5 text-[15px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] hover:border-[#d2d2d7]"
          }
        >
          Back
        </button>
        {!autoAdvance && (
          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            className={
              isMidnight
                ? "flex-1 rounded-full bg-amber-400 px-6 py-3.5 text-[15px] font-semibold text-slate-900 transition-all hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                : "flex-1 rounded-xl bg-[#14213D] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#14213D]/95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#14213D] flex items-center justify-center gap-2"
            }
          >
            {stepIndex === totalSteps - 1 ? "Complete" : "Next"}
            {stepIndex < totalSteps - 1 && (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
