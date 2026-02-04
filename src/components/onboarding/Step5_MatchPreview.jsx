import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";

const Step5_MatchPreview = () => {
  const navigate = useNavigate();

  const teammates = [
    { id: 1, name: "Raghad", sync: 98, avatar: null },
    { id: 2, name: "Youssef Mohamed", sync: 95, avatar: null },
    { id: 3, name: "Hadeer", sync: 92, avatar: null },
    { id: 4, name: "Abdelrahman", sync: 92, avatar: null },
  ];

  const handleFinish = () => {
    navigate("/dashboard");
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-white">
          Your Potential Teammates
        </h2>
        <p className="text-muted-gray">
          We found students who match your profile perfectly
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {teammates.map((teammate, index) => (
          <motion.div
            key={teammate.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 space-y-4"
          >
            <div className="relative flex justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-gold/50 flex items-center justify-center overflow-hidden">
                {teammate.avatar ? (
                  <img
                    src={teammate.avatar}
                    alt={teammate.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-gold" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20 rounded-full blur-sm" />
            </div>

            <h3 className="text-white font-semibold text-center">
              {teammate.name}
            </h3>

            <div className="flex justify-center">
              <span className="px-4 py-1.5 bg-gold/20 border border-gold/50 rounded-full text-gold font-semibold text-sm">
                {teammate.sync}% Sync
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center pt-4"
      >
        <motion.button
          onClick={handleFinish}
          className="px-12 py-4 rounded-xl bg-gold text-navy font-semibold text-lg hover:bg-gold/90 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Finish Setup
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Step5_MatchPreview;
