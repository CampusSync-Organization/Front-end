import { motion } from "framer-motion";
import { Zap } from "lucide-react";

export default function BatterySelector({ options, value, onChange }) {
  const segments =
    options && options.length > 0
      ? options.length >= 5
        ? options
        : ["0-5", "5-10", "10-20", "20-30", "30+"].slice(0, options.length)
      : ["0-5", "5-10", "10-20", "20-30", "30+"];
  const displaySegments = segments.length >= 5 ? segments : [...segments];
  const segmentIndex = displaySegments.indexOf(value);
  const activeBars =
    segmentIndex >= 0 ? segmentIndex + 1 : value != null ? 1 : 0;
  const barCount = displaySegments.length;
  const bars = Array.from({ length: barCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-1 items-end h-20">
        {bars.map((n) => {
          const isFilled = n <= activeBars;
          const isRed = n === 1 && isFilled;
          const isYellow = n >= 2 && n <= 3 && isFilled;
          const isGreen = n >= 4 && isFilled;
          const barColor = isGreen
            ? "bg-green-500"
            : isYellow
              ? "bg-amber-400"
              : isRed
                ? "bg-red-500"
                : "bg-white/10";
          const opt = displaySegments[n - 1];
          return (
            <motion.button
              key={n}
              type="button"
              onClick={() => opt != null && onChange(opt)}
              className={`w-10 sm:w-12 rounded-t transition-colors ${isFilled ? `${barColor} shadow-lg` : "bg-white/10"} ${value === opt ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900" : ""}`}
              style={{ height: `${40 + n * 12}px` }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {n === barCount && isFilled && (
                <Zap className="w-5 h-5 text-white mx-auto mt-1 drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
              )}
            </motion.button>
          );
        })}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {displaySegments.map((opt) => {
          const isSelected = value === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                isSelected
                  ? "bg-amber-500/20 text-amber-400 border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)]"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
