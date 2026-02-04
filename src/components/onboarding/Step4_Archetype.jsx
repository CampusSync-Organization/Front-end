import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setArchetype, nextStep } from "../../features/onboarding/store/onboardingSlice";
import { Crown, Cpu, Lightbulb, Target, Users, Zap } from "lucide-react";

const Step4_Archetype = () => {
  const dispatch = useDispatch();
  const traits = useSelector((state) => state.onboarding.traits);

  const determineArchetype = () => {
    const { introvertExtrovert, analyticalCreative, independentCollaborative } = traits;

    if (analyticalCreative > 70 && independentCollaborative < 40) {
      return { name: "Visionary Architect", icon: Cpu, description: "You build systems that others can only imagine" };
    } else if (introvertExtrovert > 70 && analyticalCreative > 60) {
      return { name: "Strategic Leader", icon: Crown, description: "You guide teams with wisdom and vision" };
    } else if (analyticalCreative < 40 && independentCollaborative > 60) {
      return { name: "Creative Collaborator", icon: Lightbulb, description: "You bring ideas to life through teamwork" };
    } else if (independentCollaborative > 70) {
      return { name: "Team Catalyst", icon: Users, description: "You make groups stronger than the sum of their parts" };
    } else if (analyticalCreative > 60) {
      return { name: "Innovation Driver", icon: Zap, description: "You turn problems into opportunities" };
    } else {
      return { name: "Balanced Achiever", icon: Target, description: "You excel across all dimensions" };
    }
  };

  const archetype = determineArchetype();
  const IconComponent = archetype.icon;

  useEffect(() => {
    dispatch(setArchetype(archetype.name));
    
    const timer = setTimeout(() => {
      dispatch(nextStep());
    }, 4000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <div className="w-full max-w-2xl mx-auto text-center space-y-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-6"
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="w-32 h-32 bg-gold/20 rounded-full flex items-center justify-center border-4 border-gold">
            <IconComponent className="w-16 h-16 text-gold" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="space-y-4"
        >
          <h2 className="text-2xl text-white font-semibold">
            Analysis Complete
          </h2>
          <div className="space-y-2">
            <p className="text-muted-gray text-lg">You are a</p>
            <motion.h1
              className="text-5xl font-bold bg-gradient-to-r from-gold via-yellow-300 to-gold bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              {archetype.name}
            </motion.h1>
            <motion.p
              className="text-muted-gray text-lg mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              {archetype.description}
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="pt-8"
        >
          <p className="text-white/60 text-sm">Finding your perfect matches...</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Step4_Archetype;
