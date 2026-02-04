import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { setFile, setExtractedTags, nextStep } from "../../features/onboarding/store/onboardingSlice";
import { FileText } from "lucide-react";

const Step2_CVScanner = () => {
  const dispatch = useDispatch();
  const file = useSelector((state) => state.onboarding.file);
  const extractedTags = useSelector((state) => state.onboarding.extractedTags);
  const [isScanning, setIsScanning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  };

  const handleFileSelect = (selectedFile) => {
    dispatch(setFile(selectedFile));
    setIsScanning(true);
    setIsComplete(false);

    setTimeout(() => {
      const mockTags = ["#Python", "#React", "#Leadership", "#Machine Learning", "#Team Player"];
      dispatch(setExtractedTags(mockTags));
      setIsScanning(false);
      setIsComplete(true);
    }, 3000);
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
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
        <h2 className="text-3xl font-bold text-white">Upload Your CV</h2>
        <p className="text-muted-gray">
          Our AI will analyze your experience and extract key skills
        </p>
      </motion.div>

      <motion.div
        onDrop={handleFileDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-12 cursor-pointer transition-all ${
          file
            ? "border-gold bg-gold/5"
            : "border-white/20 hover:border-gold/50 bg-white/5"
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="relative w-24 h-24">
            <FileText className="w-full h-full text-gold" />
            
            <AnimatePresence>
              {isScanning && (
                <motion.div
                  className="absolute inset-0 overflow-hidden rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="absolute w-full h-0.5 bg-gold shadow-[0_0_20px_#FCA311]"
                    initial={{ top: 0 }}
                    animate={{
                      top: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!file ? (
            <>
              <p className="text-white text-lg font-semibold">
                Drop your CV here or click to browse
              </p>
              <p className="text-muted-gray text-sm">
                Supports PDF, DOC, DOCX (Max 10MB)
              </p>
            </>
          ) : (
            <div className="text-center space-y-2">
              <p className="text-gold font-semibold text-lg">{file.name}</p>
              {isScanning && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-muted-gray"
                >
                  Scanning...
                </motion.p>
              )}
            </div>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {isComplete && extractedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-center">
              <h3 className="text-white font-semibold">Skills Detected</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {extractedTags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-4 py-2 bg-gold/20 border border-gold/50 rounded-full text-gold font-medium"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isComplete && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={handleContinue}
          className="w-full py-4 px-6 rounded-xl bg-gold text-navy font-semibold text-lg hover:bg-gold/90 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Continue
        </motion.button>
      )}
    </div>
  );
};

export default Step2_CVScanner;
