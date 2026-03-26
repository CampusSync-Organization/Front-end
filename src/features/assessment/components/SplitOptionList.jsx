import { motion } from "framer-motion";

export function SplitOptionList({ options, selectedValue, onSelect }) {
  return (
    <div className="flex flex-col gap-3 w-full mt-10">
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
              w-full text-left px-5 py-4 rounded-xl flex items-center transition-all duration-200 border-2
              ${isSelected 
                ? "bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10" 
                : "bg-white text-slate-800 border-slate-200 hover:border-slate-400 hover:bg-slate-50"}
            `}
          >
            <div 
              className={`
                shrink-0 w-8 h-8 rounded border flex items-center justify-center text-[12px] font-bold mr-5 transition-colors
                ${isSelected ? "bg-white/20 border-white/30 text-white" : "bg-white border-slate-300 text-slate-500 shadow-sm"}
              `}
            >
              {letter}
            </div>
            <span className="text-lg md:text-[20px] font-medium leading-relaxed">{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
