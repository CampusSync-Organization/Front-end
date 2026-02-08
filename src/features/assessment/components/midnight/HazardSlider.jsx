import { useRef } from "react";
import { motion } from "framer-motion";
import { Calendar, Flame } from "lucide-react";

const GOLD = "#FBBF24";

export default function HazardSlider({ options, value, onChange }) {
  const rangeRef = useRef(null);
  const index = options.indexOf(value);
  const inputValue = index >= 0 ? (index / Math.max(1, options.length - 1)) * 100 : 0;

  const handleChange = (e) => {
    const v = Number(e.target.value);
    const i = Math.round((v / 100) * (options.length - 1));
    onChange(options[Math.min(i, options.length - 1)]);
  };

  return (
    <div className="w-full px-2">
      <div className="flex justify-between items-center mb-4">
        <Calendar className="h-6 w-6 text-green-400" aria-hidden />
        <Flame className="h-6 w-6 text-amber-400" aria-hidden />
      </div>
      <div className="relative h-4 flex items-center w-full">
        <div className="absolute inset-0 h-3 rounded-full bg-gradient-to-r from-green-500 to-red-500 top-1/2 -translate-y-1/2" />
        <motion.div
          className="absolute left-0 h-3 rounded-full top-1/2 -translate-y-1/2 pointer-events-none bg-gradient-to-r from-green-500 to-amber-500"
          style={{
            width: `${inputValue}%`,
            boxShadow: "0 0 12px rgba(34, 197, 94, 0.4)",
          }}
          initial={false}
          animate={{ width: `${inputValue}%` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        <motion.div
          className="absolute top-1/2 w-6 h-6 rounded-full bg-white border-2 border-amber-400 pointer-events-none -translate-y-1/2 z-10"
          style={{
            left: `calc(${inputValue}% - 12px)`,
            boxShadow: `0 0 16px ${GOLD}80`,
          }}
          initial={false}
          animate={{ left: `calc(${inputValue}% - 12px)` }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        />
        <input
          ref={rangeRef}
          type="range"
          min={0}
          max={100}
          value={inputValue}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          aria-label="Study start timing"
        />
      </div>
      <div className="flex justify-between mt-2 text-xs text-slate-400">
        <span>{options[0]}</span>
        <span>{options[options.length - 1]}</span>
      </div>
    </div>
  );
}
