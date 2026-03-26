import { motion } from "framer-motion";

export function SplitLikertTrack({ min, max, labels, value, onSelect }) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full mt-10 md:mt-12 flex flex-col gap-6">
      <div className="flex justify-between items-stretch gap-1.5 md:gap-2 w-full">
        {scale.map((num) => {
          const isSelected = value === num;
          return (
            <motion.button
              key={num}
              type="button"
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(num)}
              className={`
                flex-1 aspect-square max-w-[44px] md:max-w-[64px] rounded-full flex items-center justify-center transition-all duration-300 border-[1.5px] md:border-2 shrink-0
                ${isSelected 
                  ? "bg-slate-900 text-white border-slate-900 shadow-lg shadow-slate-900/20 scale-110" 
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
              `}
            >
              <span className="text-lg md:text-2xl font-bold">{num}</span>
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between items-center px-1 text-[11px] font-black text-slate-400 uppercase tracking-widest">
        <span className={value <= min+1 ? "text-slate-800 transition-colors" : "transition-colors"}>{labels.min}</span>
        <span className={value >= max-1 ? "text-slate-800 transition-colors" : "transition-colors"}>{labels.max}</span>
      </div>
    </div>
  );
}
