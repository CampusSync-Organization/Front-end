import { useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateTrait, nextStep } from "../../features/onboarding/store/onboardingSlice";

const Step3_VibeCheck = () => {
  const dispatch = useDispatch();
  const traits = useSelector((state) => state.onboarding.traits);
  const sliderRefs = useRef({});

  const sliders = [
    {
      id: "introvertExtrovert",
      label: "Introvert",
      labelRight: "Extrovert",
      value: traits.introvertExtrovert,
    },
    {
      id: "analyticalCreative",
      label: "Analytical",
      labelRight: "Creative",
      value: traits.analyticalCreative,
    },
    {
      id: "independentCollaborative",
      label: "Independent",
      labelRight: "Collaborative",
      value: traits.independentCollaborative,
    },
  ];

  const handleSliderChange = (traitId, value) => {
    dispatch(updateTrait({ trait: traitId, value }));
  };

  const handleTrackClick = (traitId, e) => {
    const track = sliderRefs.current[traitId];
    if (!track) return;
    
    const rect = track.getBoundingClientRect();
    const percentage = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
    );
    handleSliderChange(traitId, Math.round(percentage));
  };

  const handleContinue = () => {
    dispatch(nextStep());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-white">Vibe Check</h2>
        <p className="text-muted-gray">
          Tell us about your working style and personality
        </p>
      </motion.div>

      <div className="space-y-8">
        {sliders.map((slider, index) => (
          <motion.div
            key={slider.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">{slider.label}</span>
              <span className="text-white font-medium">{slider.labelRight}</span>
            </div>

            <div className="relative">
              <div
                ref={(el) => (sliderRefs.current[slider.id] = el)}
                onClick={(e) => handleTrackClick(slider.id, e)}
                className="h-2 bg-white/10 rounded-full relative cursor-pointer"
              >
                <motion.div
                  className="absolute h-2 bg-gold rounded-full"
                  style={{ width: `${slider.value}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${slider.value}%` }}
                  transition={{ duration: 0.3 }}
                />

                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-gold rounded-full shadow-[0_0_10px_#FCA311] cursor-grab active:cursor-grabbing z-10"
                  style={{
                    left: `calc(${slider.value}% - 12px)`,
                  }}
                  drag="x"
                  dragConstraints={{
                    left: -12,
                    right: (sliderRefs.current[slider.id]?.offsetWidth || 0) - 12,
                  }}
                  dragElastic={0}
                  onDrag={(e, info) => {
                    const track = sliderRefs.current[slider.id];
                    if (!track) return;
                    
                    const rect = track.getBoundingClientRect();
                    const percentage = Math.max(
                      0,
                      Math.min(100, ((info.point.x - rect.left) / rect.width) * 100)
                    );
                    handleSliderChange(slider.id, Math.round(percentage));
                  }}
                  whileDrag={{ scale: 1.2 }}
                />
              </div>

              <div className="text-center mt-2">
                <span className="text-gold font-semibold">{slider.value}%</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={handleContinue}
        className="w-full py-4 px-6 rounded-xl bg-gold text-navy font-semibold text-lg hover:bg-gold/90 transition-colors mt-8"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        Continue
      </motion.button>
    </div>
  );
};

export default Step3_VibeCheck;
