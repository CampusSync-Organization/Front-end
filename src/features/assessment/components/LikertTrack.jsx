import { motion } from "framer-motion";

export function LikertTrack({ min, max, labels, value, onSelect }) {
  const scale = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center gap-2 md:gap-3 mb-6">
        {scale.map((num) => {
          const isSelected = value === num;
          return (
            <motion.button
              key={num}
              type="button"
              whileHover={{ scale: 1.1, y: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSelect(num)}
              className={`
                flex-1 aspect-square rounded-2xl flex items-center justify-center text-xl font-black transition-all duration-300 border-b-4
                ${isSelected 
                  ? "bg-violet-500 text-white border-violet-700 shadow-[0_10px_25px_-5px_rgba(139,92,246,0.6)] translate-y-[-4px]" 
                  : "bg-slate-100/80 text-slate-400 border-slate-200 hover:bg-white hover:text-violet-500 hover:border-violet-200 hover:shadow-lg"}
              `}
            >
              {num}
            </motion.button>
          );
        })}
      </div>
      <div className="flex justify-between items-center px-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
        <span className={value <= min+1 ? "text-violet-500 transition-colors" : "transition-colors"}>{labels.min}</span>
        <span className={value >= max-1 ? "text-violet-500 transition-colors" : "transition-colors"}>{labels.max}</span>
      </div>
    </div>
  );
}
