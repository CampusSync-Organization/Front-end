import { motion } from "framer-motion";

const DEFAULT_LABELS = ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"];

export default function EmojiOptionCard({ options, value, onChange, labels }) {
  const list = labels || DEFAULT_LABELS;

  return (
    <div className="grid grid-cols-5 gap-2 sm:gap-3">
      {[1, 2, 3, 4, 5].map((numVal, index) => {
        const isSelected = value === numVal;
        const label = list[index] ?? DEFAULT_LABELS[index];

        return (
          <motion.button
            key={numVal}
            type="button"
            onClick={() => onChange(numVal)}
            className={`rounded-3xl border-2 p-4 flex flex-col items-center justify-center gap-1 min-h-[80px] transition-colors ${
              isSelected
                ? "bg-amber-500/20 border-amber-400 shadow-[0_0_24px_rgba(251,191,36,0.25)]"
                : "bg-white/5 border-white/10 hover:border-amber-400/40 hover:bg-white/10"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            <span
              className={`text-[10px] sm:text-xs text-center leading-tight ${isSelected ? "text-amber-400 font-medium" : "text-slate-400"}`}
            >
              {label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
