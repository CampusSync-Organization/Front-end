import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import { OptionList } from "./OptionList";
import { LikertTrack } from "./LikertTrack";

export default function AssessmentDeck() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const {
    currentStep,
    nextStep,
    prevStep,
    setAnswer,
    getAnswerForKey,
    getFinalPayload,
    reset,
    totalSteps
  } = useAssessmentStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isComplete = currentStep >= totalSteps;
  
  // We render up to 3 cards deep to generate a tangible physical stack.
  const visibleQuestions = ALL_QUESTIONS.slice(currentStep, currentStep + 3).map((q, idx) => ({
    ...q,
    virtualIndex: idx
  }));

  const handleSelect = (val, question) => {
    setAnswer(question.key, val);
    
    // Auto-advance after short delay for juiciness (Allows exit animation to trigger)
    setTimeout(() => {
      if (currentStep === totalSteps - 1) {
        setIsFinishing(true);
        setTimeout(() => {
          const payload = getFinalPayload();
          console.log("Deck payload:", payload);
          nextStep(); // Push to Complete View
        }, 800);
      } else {
        nextStep();
      }
    }, 280);
  };

  const handleBack = () => {
    if (currentStep > 0) prevStep();
  };

  const handleCompleteRedirect = () => {
    reset();
    navigate("/home");
  };

  if (!isClient) return null;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900 via-slate-950 to-slate-950" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="relative z-10 max-w-sm w-full bg-white/10 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]"
        >
          <div className="w-20 h-20 bg-gradient-to-tr from-violet-500 to-fuchsia-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-fuchsia-500/30 rotate-12">
            <Sparkles className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-black text-white mb-4">You Crushed It!</h2>
          <p className="text-slate-300 font-medium mb-10 leading-relaxed text-[15px]">
            Your personalized campus experience is officially calibrated and ready to deploy.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompleteRedirect}
            className="w-full py-4.5 h-14 bg-white text-slate-900 rounded-2xl font-bold text-lg shadow-lg hover:shadow-white/25 transition-all"
          >
            Enter Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-900 flex flex-col font-sans select-none">
      {/* Immersive Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.8),rgba(0,0,0,1))]" />
      <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-fuchsia-600/30 rounded-full blur-[120px] mix-blend-screen" />
      <div className="absolute top-[20%] left-[-20%] w-[60vw] h-[60vw] bg-violet-600/40 rounded-full blur-[120px] mix-blend-screen" />
      
      {/* Top Navbar (Progress + Back) */}
      <div className="relative z-20 w-full max-w-md mx-auto pt-8 px-6 flex items-center justify-between">
        <button 
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'hover:bg-white/20'}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex-1 px-6">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-fuchsia-500 to-violet-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 100 }}
            />
          </div>
        </div>
        
        <div className="w-12 h-12 flex items-center justify-center text-white/50 font-bold text-[13px] tracking-widest">
          {currentStep + 1}/{totalSteps}
        </div>
      </div>

      {/* 3D Stack Container */}
      <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden px-4 py-10">
        <div className="relative w-full max-w-[360px] h-[550px] perspective-1000">
          <AnimatePresence mode="popLayout">
            {visibleQuestions.map((q) => {
              const isTop = q.virtualIndex === 0;
              const currentValue = getAnswerForKey(q.key);
              
              return (
                <motion.div
                  key={q.key}
                  initial={{ scale: 0.8, y: 150, opacity: 0 }}
                  animate={{ 
                    scale: 1 - (q.virtualIndex * 0.06),
                    y: q.virtualIndex * 26,
                    zIndex: 10 - q.virtualIndex,
                    opacity: 1 - (q.virtualIndex * 0.15)
                  }}
                  exit={{ 
                    x: -600, 
                    y: -100,
                    opacity: 0, 
                    rotate: -20, 
                    scale: 0.9,
                    transition: { duration: 0.4, ease: "easeIn" } 
                  }}
                  transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  className={`absolute top-0 left-0 w-full h-[550px] bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.4)] flex flex-col border border-white isolate ${isFinishing && isTop ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  {/* Category Badge */}
                  <div className="flex justify-start mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-violet-100 text-violet-700 font-bold text-[11px] uppercase tracking-widest shadow-sm">
                      {q.category}
                    </span>
                  </div>

                  {/* Question Text */}
                  <h2 className="text-[26px] font-black text-slate-800 leading-[1.2] mb-8 tracking-tight">
                    {q.question || q.statement}
                  </h2>

                  {/* Interactive Area */}
                  <div className="flex-1 flex flex-col justify-end relative z-10 pointer-events-auto">
                    {q.type === "singleSelect" && (
                      <OptionList 
                        options={q.options} 
                        selectedValue={currentValue} 
                        onSelect={(val) => {
                          if (isTop) handleSelect(val, q);
                        }} 
                      />
                    )}
                    {q.type === "likert" && (
                      <LikertTrack 
                        min={q.min} 
                        max={q.max} 
                        labels={q.labels} 
                        value={currentValue} 
                        onSelect={(val) => {
                          if (isTop) handleSelect(val, q);
                        }} 
                      />
                    )}
                  </div>
                  
                  {/* Subtle disabled overlay if not top card */}
                  {!isTop && <div className="absolute inset-0 z-50 bg-white/40 rounded-[2rem]" />}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
