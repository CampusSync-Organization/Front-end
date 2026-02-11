import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

const GUIDE_AVATAR_SRC = "/guide-avatar.png";

export default function AssessmentAvatar({ className = "" }) {
  const floatRef = useRef(null);

  useEffect(() => {
    if (!floatRef.current) return;
    const tween = gsap.to(floatRef.current, {
      y: -12,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
    return () => tween.kill();
  }, []);

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ background: "transparent" }}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0, 0, 0.2, 1] }}
    >
      <div ref={floatRef} className="relative mx-auto flex items-center justify-center">
        <img
          src={GUIDE_AVATAR_SRC}
          alt="Nova"
          className="h-40 w-auto object-contain sm:h-48"
          style={{ background: "transparent" }}
          draggable={false}
        />
      </div>

      {/* Nova label - main page color */}
      <p className="mt-4 text-center text-sm font-semibold text-amber-400">
        Nova
      </p>
    </motion.div>
  );
}
