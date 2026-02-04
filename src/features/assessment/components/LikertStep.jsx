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
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex justify-between text-xs font-medium text-muted-foreground mb-4">
          <span>{labels[min]}</span>
          <span>{labels[max]}</span>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {range.map((n, idx) => {
            const isSelected = value === n;
            return (
              <motion.button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.03, duration: 0.2 }}
                className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-base font-semibold transition-colors sm:h-14 sm:w-14 ${
                  isSelected
                    ? "border-primary bg-primary text-white"
                    : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-4 flex justify-between text-xs text-muted-foreground sm:hidden">
          <span>{labels[min]}</span>
          <span>{labels[max]}</span>
        </div>
      </div>

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
