import { motion } from "framer-motion";

export function SplitOptionList({ options, selectedValue, onSelect }) {
  const isGrid = options.length >= 4;

  return (
    <div className={`w-full mt-4 lg:mt-10 ${isGrid ? "grid grid-cols-2 gap-2 sm:gap-3" : "flex flex-col gap-2 lg:gap-3"}`}>
      {options.map((option, idx) => {
        const isSelected = selectedValue === option;
        const letter = String.fromCharCode(65 + idx); // A, B, C...
        
        return (
          <motion.button
            key={idx}
            type="button"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelect(option)}
            className={`
              w-full text-left px-4 py-3 sm:py-4 rounded-xl flex items-center transition-all duration-200 border-2
              ${isSelected 
                ? "bg-slate-900 text-white border-slate-900 shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)]" 
                : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
            `}
          >
            <div 
              className={`
                shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded border flex items-center justify-center text-[11px] sm:text-[12px] font-bold mr-3 sm:mr-4 transition-colors
                ${isSelected ? "bg-white/20 border-white/30 text-white" : "bg-white border-slate-300 text-slate-500 shadow-sm"}
              `}
            >
              {letter}
            </div>
            <span className={`font-medium leading-snug sm:leading-relaxed ${isGrid ? "text-[13px] sm:text-base lg:text-lg" : "text-base sm:text-lg lg:text-[20px]"}`}>{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
