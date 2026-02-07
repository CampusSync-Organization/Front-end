import { motion } from "framer-motion";

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

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#e5e5ea] bg-white p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(20,33,61,0.06)]">
        <div className="flex justify-between text-[12px] font-medium text-[#86868b] mb-5">
          <span>{labels[min]}</span>
          <span>{labels[max]}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {range.map((n, idx) => {
            const isSelected = value === n;
            return (
              <motion.button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03, duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-xl border-2 text-[15px] font-semibold transition-all duration-200 sm:text-base ${
                  isSelected
                    ? "border-[#14213D] bg-[#14213D] text-white shadow-md"
                    : "border-[#e5e5ea] bg-white text-[#1d1d1f] hover:border-[#14213D]/50 hover:bg-[#f5f5f7]"
                }`}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-[11px] text-[#86868b] sm:hidden">
          <span>{labels[min]}</span>
          <span>{labels[max]}</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-[#e5e5ea] bg-white px-6 py-3.5 text-[15px] font-medium text-[#1d1d1f] transition-colors hover:bg-[#f5f5f7] hover:border-[#d2d2d7]"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 rounded-xl bg-[#14213D] px-6 py-3.5 text-[15px] font-semibold text-white transition-all hover:bg-[#14213D]/95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#14213D] flex items-center justify-center gap-2"
        >
          {stepIndex === totalSteps - 1 ? "Complete" : "Next"}
          {stepIndex < totalSteps - 1 && (
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
