import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const GOLD = "#FBBF24";
const ITEM_HEIGHT = 56;

export default function GPAWheel({ options, value, onChange }) {
  const containerRef = useRef(null);
  const [scrollIndex, setScrollIndex] = useState(() => {
    const i = options.indexOf(value);
    return i >= 0 ? i : 0;
  });

  useEffect(() => {
    const i = options.indexOf(value);
    if (i >= 0 && i !== scrollIndex) setScrollIndex(i);
  }, [value, options]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = scrollIndex * ITEM_HEIGHT;
  }, [scrollIndex]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const center = el.scrollTop + el.clientHeight / 2;
    const index = Math.round(center / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(index, options.length - 1));
    setScrollIndex(clamped);
    onChange(options[clamped]);
  };

  const paddingY = 100;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="h-64 overflow-y-auto overflow-x-hidden scroll-smooth snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      style={{ scrollSnapType: "y mandatory" }}
    >
      <div style={{ paddingTop: paddingY, paddingBottom: paddingY }}>
        {options.map((opt, index) => {
          const isActive = value === opt;
          return (
            <motion.button
              key={opt}
              type="button"
              onClick={() => {
                setScrollIndex(index);
                onChange(opt);
              }}
              className="w-full flex items-center justify-center py-3 snap-center transition-colors"
              style={{ minHeight: ITEM_HEIGHT }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`text-lg font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-white scale-125 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]"
                    : "text-white/30 scale-100"
                }`}
              >
                {opt}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
