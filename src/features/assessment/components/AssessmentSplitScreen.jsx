import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Check, ArrowRight } from "lucide-react";
import { useAssessmentStore } from "../store/useAssessmentStore";
import { ALL_QUESTIONS } from "../config/questions";
import { SplitOptionList } from "./SplitOptionList";
import { SplitLikertTrack } from "./SplitLikertTrack";

const QUESTION_IMAGES = {
  // Academic Images
  year: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1600",
  gpa: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1600",
  study_start: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae?q=80&w=1600",
  work_approach: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1600",
  time_pressure: "https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1600",
  commitment_priority: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1600",
  commitment_reliability: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=1600",
  study_effort: "https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=1600",
  academic_mindset: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?q=80&w=1600",
  working_style: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600",
  
  // Personality Images
  ext_1: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1600",
  ext_2_rev: "https://images.unsplash.com/photo-1515041219749-89347f83291a?q=80&w=1600",
  cons_1: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600",
  cons_2_rev: "https://images.unsplash.com/photo-1555421689-d68471e189f2?q=80&w=1600",
  agr_1: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=1600",
  agr_2_rev: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600",
  neu_1_rev: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1600",
  neu_2: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?q=80&w=1600",
  opn_1: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=1600",
  opn_2_rev: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=1600"
};

export default function AssessmentSplitScreen() {
  const navigate = useNavigate();
  const [direction, setDirection] = useState(1);
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
    // Secretly preload all high-res background images into browser cache on mount
    Object.values(QUESTION_IMAGES).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const isComplete = currentStep >= totalSteps;
  const currentQuestion = ALL_QUESTIONS[currentStep];
  const currentValue = currentQuestion ? getAnswerForKey(currentQuestion.key) : null;

  const handleNext = () => {
    if (currentStep === totalSteps - 1) {
      setIsFinishing(true);
      setTimeout(() => {
        const payload = getFinalPayload();
        console.log("Final payload:", payload);
        nextStep(); 
      }, 600);
      return;
    }
    setDirection(1);
    nextStep();
  };

  const handleBack = () => {
    if (currentStep === 0) return;
    setDirection(-1);
    prevStep();
  };

  const handleSelect = (val) => {
    setAnswer(currentQuestion.key, val);
    handleNext();
  };

  const handleCompleteRedirect = () => {
    reset();
    navigate("/home");
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           transition={{ duration: 0.5 }}
           className="bg-white max-w-lg w-full rounded-[2rem] p-12 text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100"
        >
          <div className="w-24 h-24 bg-slate-900 rounded-full flex flex-col items-center justify-center mx-auto mb-8 shadow-xl shadow-slate-900/20">
            <Check className="h-10 w-10 text-white" strokeWidth={3.5} />
          </div>
          <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Setup Complete.</h2>
          <p className="text-slate-500 mb-10 text-lg leading-relaxed font-medium">
            We've mapped your academic and personal preferences securely. Your dashboard is perfectly configured and ready.
          </p>
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCompleteRedirect}
            className="w-full h-16 bg-slate-900 text-white rounded-xl font-bold text-[16px] shadow-[0_10px_20px_-10px_rgba(0,0,0,0.3)] hover:bg-slate-800 transition-all"
          >
            Enter Dashboard
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;
  const bgImage = currentQuestion && QUESTION_IMAGES[currentQuestion.key] 
    ? QUESTION_IMAGES[currentQuestion.key] 
    : "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=1600";

  const slideVariants = {
    enter: (dir) => ({ y: dir > 0 ? 80 : -80, opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir) => ({ y: dir < 0 ? 80 : -80, opacity: 0 }),
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans text-slate-900 overflow-hidden">
      
      {/* LEFT: Context Image Split */}
      <div className="hidden lg:block lg:w-1/2 relative bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.img
            key={bgImage}
            src={bgImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-slate-900/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        {/* Typographic Context Overlay */}
        <div className="absolute bottom-16 left-16 right-16 text-white max-w-md">
          <h1 className="text-[48px] font-black mb-4 tracking-tighter leading-none">CampusSync</h1>
          <p className="text-xl font-medium text-white/80 leading-relaxed">
            {currentQuestion?.category === "Academic" 
              ? "Tell us about your study cadence to unlock personalized academic roadmaps." 
              : "Let us understand your personality metrics to connect you with the right communities."}
          </p>
        </div>
      </div>

      {/* RIGHT: High Structure Form Split */}
      <div className="w-full lg:w-1/2 relative flex flex-col overflow-y-auto min-h-screen">
        
        {/* Top Progress Track */}
        <div className="sticky top-0 left-0 w-full h-2 bg-slate-100 z-50">
          <motion.div 
            className="h-full bg-slate-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100 }}
          />
        </div>

        {/* Header Console */}
        <header className="w-full flex items-center justify-between px-8 md:px-16 py-8 z-20 shrink-0">
          <button 
            onClick={handleBack}
            className={`flex items-center gap-2 p-2 -ml-2 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold text-[13px] tracking-widest uppercase ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </header>

        {/* Static Flexible Wrapper for perfect vertical alignment */}
        <main className="flex-1 w-full max-w-[700px] mx-auto flex flex-col justify-center px-8 md:px-16 py-8">
          <AnimatePresence mode="wait" custom={direction}>
            {currentQuestion && (
              <motion.div
                key={currentStep}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 400, damping: 35, opacity: { duration: 0.2 } }}
                className="w-full flex flex-col"
              >
                {/* Number & Typography */}
                <div className="mb-8 flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                  <div className="flex items-center gap-4 shrink-0 mt-1">
                    <span className="text-slate-900 font-bold text-xl md:text-2xl flex items-center gap-2">
                      {currentStep + 1} <ArrowRight className="w-5 h-5 text-slate-300" />
                    </span>
                  </div>
                  <div>
                    <h2 className="text-[32px] md:text-[40px] font-bold tracking-tight leading-[1.25] text-slate-900">
                      {currentQuestion.question || currentQuestion.statement}
                    </h2>
                    <p className="text-slate-400 font-semibold tracking-widest uppercase text-[11px] mt-6">
                      {currentQuestion.category} Evaluation
                    </p>
                  </div>
                </div>

                {/* Left-Aligned Constrained Block for Form Elements */}
                <div className="w-full pl-0 md:pl-[68px]">
                  {currentQuestion.type === "singleSelect" && (
                    <SplitOptionList 
                      options={currentQuestion.options}
                      selectedValue={currentValue}
                      onSelect={handleSelect}
                    />
                  )}
                  {currentQuestion.type === "likert" && (
                    <SplitLikertTrack 
                      min={currentQuestion.min}
                      max={currentQuestion.max}
                      labels={currentQuestion.labels}
                      value={currentValue}
                      onSelect={handleSelect}
                    />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
