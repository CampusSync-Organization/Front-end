import { motion } from "framer-motion";

export default function QuestionCard({ question, funQuestion, children, direction }) {
  return (
    <motion.div
      key={question.key}
      initial={{ opacity: 0, x: direction > 0 ? 100 : -100, scale: direction > 0 ? 0.95 : 1 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -100, rotate: -2 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="w-full max-w-[600px] mx-auto rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-[0_0_40px_-12px_rgba(0,0,0,0.3)]"
    >
      {funQuestion ? (
        <>
          <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-2">
            {funQuestion}
          </h2>
          <p className="text-sm text-slate-400 mb-8">{question.question}</p>
        </>
      ) : (
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-8">
          {question.question}
        </h2>
      )}
      {children}
    </motion.div>
  );
}
