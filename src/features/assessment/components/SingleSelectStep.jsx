import { motion } from "framer-motion";

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
  return (
    <div className="space-y-6">
      <ul className="grid gap-3">
        {options.map((opt, index) => {
          const isSelected = value === opt;
          return (
            <motion.li
              key={opt}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => onChange(opt)}
                className={`w-full rounded-xl border-2 px-5 py-4 text-left text-base font-medium transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <span className="flex items-center justify-between">
                  {opt}
                  {isSelected && (
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                </span>
              </button>
            </motion.li>
          );
        })}
      </ul>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-border bg-card px-6 py-3.5 font-medium text-foreground transition-colors hover:bg-muted"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canGoNext}
          className="flex-1 rounded-xl bg-primary px-6 py-3.5 font-medium text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stepIndex === totalSteps - 1 ? "Complete" : "Next"}
        </button>
      </div>
    </div>
  );
}
