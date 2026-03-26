import { motion } from "framer-motion";
import { Check } from "lucide-react";

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
  variant = "default",
  autoAdvance = false,
}) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const isMidnight = variant === "midnight";
  const showLabels = labels && max - min + 1 <= 6 && labels[min] && labels[max];

  return (
    <div className="space-y-4">
      <div
        className={
          isMidnight
            ? "rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"
            : "rounded-xl border border-[#e5e5ea] bg-white p-4 sm:p-5 shadow-[0_4px_24px_-4px_rgba(20,33,61,0.06)]"
        }
      >
        {showLabels && (
          <div
            className={`flex justify-between text-[10px] font-medium mb-2 ${isMidnight ? "text-slate-400" : "text-[#86868b]"}`}
          >
            <span>{labels[min]}</span>
            <span>{labels[max]}</span>
          </div>
        )}

        <div
          className={
            showLabels
              ? "grid gap-1.5"
              : "flex flex-wrap justify-center gap-1.5 sm:gap-2"
          }
        >
          {range.map((n, idx) => {
            const isSelected = value === n;
            const label = labels?.[n];
            return (
              <motion.button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: idx * 0.04,
                  duration: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`flex items-center justify-between gap-2 rounded-lg border-2 px-3 py-2.5 text-left transition-all duration-200 ${
                  showLabels
                    ? isMidnight
                      ? isSelected
                        ? "border-amber-400 bg-amber-500/20 text-white shadow-[0_0_16px_rgba(251,191,36,0.25)]"
                        : "border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40 hover:bg-white/10"
                      : isSelected
                        ? "border-[#14213D] bg-[#14213D]/10 text-[#14213D]"
                        : "border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#14213D]/50"
                    : isMidnight
                      ? isSelected
                        ? "h-10 w-10 sm:h-11 sm:w-11 mx-auto border-amber-400 bg-amber-500/20 text-white shadow-[0_0_16px_rgba(251,191,36,0.25)]"
                        : "h-10 w-10 sm:h-11 sm:w-11 mx-auto border-white/10 bg-white/5 text-slate-300 hover:border-amber-400/40"
                      : isSelected
                        ? "h-10 w-10 sm:h-11 sm:w-11 mx-auto border-[#14213D] bg-[#14213D] text-white shadow-md"
                        : "h-10 w-10 sm:h-11 sm:w-11 mx-auto border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#14213D]/50"
                }`}
                whileHover={
                  isMidnight ? { scale: showLabels ? 1.01 : 1.05 } : undefined
                }
                whileTap={{ scale: 0.98 }}
              >
                {showLabels ? (
                  <>
                    <span className="text-[13px] font-medium flex-1">
                      {label}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-400 text-slate-900">
                        <Check className="h-2.5 w-2.5 stroke-[2.5]" />
                      </span>
                    )}
                  </>
                ) : (
                  n
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className={
            isMidnight
              ? "rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-[14px] font-medium text-slate-300 transition-colors hover:bg-white/10 hover:border-white/30"
              : "rounded-xl border border-[#e5e5ea] bg-white px-5 py-2.5 text-[14px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] hover:border-[#d2d2d7]"
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
                ? "flex-1 rounded-full bg-amber-400 px-4 py-2 text-[13px] font-semibold text-slate-900 transition-all hover:bg-amber-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(251,191,36,0.3)]"
                : "flex-1 rounded-xl bg-[#14213D] px-5 py-2.5 text-[14px] font-semibold text-white transition-all hover:bg-[#14213D]/95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#14213D] flex items-center justify-center gap-2"
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
