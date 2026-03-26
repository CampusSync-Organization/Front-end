import { motion } from "framer-motion";
import { Check } from "lucide-react";

export function OptionList({ options, selectedValue, onSelect }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {options.map((option, idx) => {
        const isSelected = selectedValue === option;
        return (
          <motion.button
            key={idx}
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(option)}
            className={`
              w-full text-left p-4 rounded-2xl flex justify-between items-center transition-all duration-200 border-2
              ${isSelected 
                ? "bg-violet-500 text-white border-violet-500 shadow-xl shadow-violet-500/30 font-bold" 
                : "bg-slate-50 text-slate-700 border-slate-100 hover:border-violet-200 hover:bg-violet-50 font-semibold"}
            `}
          >
            <span className="text-[15px] pr-4">{option}</span>
            {isSelected && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="shrink-0 flex items-center justify-center w-6 h-6 bg-white rounded-full">
                <Check className="w-3.5 h-3.5 text-violet-500" strokeWidth={3.5} />
              </motion.div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
