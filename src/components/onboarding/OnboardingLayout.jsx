import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const OnboardingLayout = ({ children }) => {
  const currentStep = useSelector((state) => state.onboarding.step);

  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-navy flex flex-col">
      <header className="w-full px-8 py-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center">
              <span className="text-navy font-bold text-lg">CS</span>
            </div>
            <span className="text-xl font-bold text-white">CampusSync</span>
          </div>

          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    step <= currentStep
                      ? "border-gold bg-gold/20 text-gold"
                      : "border-white/20 text-white/40"
                  }`}
                  initial={false}
                  animate={{
                    scale: step === currentStep ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-semibold">{step}</span>
                </motion.div>

                {index < steps.length - 1 && (
                  <motion.div
                    className={`h-0.5 w-12 ${
                      step < currentStep ? "bg-gold" : "bg-white/20"
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: step < currentStep ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    style={{ originX: 0 }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-4xl"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default OnboardingLayout;
