import { motion } from "framer-motion";
import { getAvatarUrl } from "../utils/avatar";

export default function AvatarGuide({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.7, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { type: "spring", stiffness: 200, damping: 18 },
        y: { type: "spring", stiffness: 150, damping: 15 },
      }}
    >
      <div className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-36 sm:w-36">
        <img
          src={getAvatarUrl("campussync")}
          alt="Nova"
          className="h-full w-full rounded-full border-2 border-amber-400/40 object-cover shadow-[0_0_40px_rgba(251,191,36,0.2)]"
        />
      </div>

      <motion.p
        className="mt-4 text-center text-sm font-medium"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          background: "linear-gradient(90deg, #FCA311, #FFD700, #FCA311)",
          backgroundSize: "200% 100%",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Nova
      </motion.p>
    </motion.div>
  );
}
