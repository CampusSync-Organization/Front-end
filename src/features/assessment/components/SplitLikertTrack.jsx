import { motion } from "framer-motion";

export function SplitLikertTrack({ min, max, labels, value, onSelect }) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full mt-12 flex flex-col gap-6">
      <div className="flex justify-between items-stretch gap-2 w-full">
        {scale.map((num) => {
          const isSelected = value === num;
          return (
            <motion.button
              key={num}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(num)}
              className={`
                flex-1 flex flex-col items-center justify-center py-5 md:py-6 rounded-xl transition-all duration-200 border-2
                ${isSelected 
                  ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10 scale-105" 
                  : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
              `}
            >
              <span className="text-xl md:text-2xl font-bold">{num}</span>
            </motion.button>
          );
        })}
      </div>
      
      {/* Labels */}
      <div className="flex justify-between items-center px-2">
        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${value <= min+1 ? "text-slate-900" : "text-slate-400"}`}>
          {labels.min}
        </span>
        <span className={`text-xs md:text-sm font-bold uppercase tracking-widest ${value >= max-1 ? "text-slate-900" : "text-slate-400"}`}>
          {labels.max}
        </span>
      </div>
    </div>
  );
}
