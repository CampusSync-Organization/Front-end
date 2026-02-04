import { useRef, useCallback } from "react";
import gsap from "gsap";

/**
 * Premium animation presets for the assessment flow
 * Provides reusable GSAP animations with consistent timing
 */
export function useAssessmentAnimations() {
  const timelineRef = useRef(null);

  // Elastic entrance for cards and options
  const elasticEntrance = useCallback((elements, options = {}) => {
    const { stagger = 0.08, delay = 0, from = "start" } = options;
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 40,
        scale: 0.85,
        rotateX: 15,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        duration: 0.7,
        stagger: { each: stagger, from },
        delay,
        ease: "elastic.out(1, 0.75)",
      }
    );
  }, []);

  // Magnetic hover effect
  const createMagneticEffect = useCallback((element, strength = 0.35) => {
    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.4)",
      });
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Selection ripple effect
  const selectionRipple = useCallback((element) => {
    const ripple = document.createElement("div");
    ripple.className = "absolute inset-0 rounded-2xl pointer-events-none";
    ripple.style.background =
      "radial-gradient(circle, rgba(252,163,17,0.4) 0%, transparent 70%)";
    ripple.style.transform = "scale(0)";
    ripple.style.opacity = "1";
    element.style.position = "relative";
    element.appendChild(ripple);

    gsap.to(ripple, {
      scale: 2.5,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      onComplete: () => ripple.remove(),
    });
  }, []);

  // Glow pulse effect for selected items
  const glowPulse = useCallback((element) => {
    return gsap.to(element, {
      boxShadow: "0 0 40px rgba(252,163,17,0.5), 0 0 80px rgba(252,163,17,0.2)",
      duration: 0.4,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  }, []);

  // Text reveal animation (SplitText-style)
  const textReveal = useCallback((container, options = {}) => {
    const { duration = 0.5, stagger = 0.03 } = options;
    const words = container.querySelectorAll("[data-word]");
    
    return gsap.fromTo(
      words,
      {
        opacity: 0,
        y: 20,
        rotateX: 40,
        transformOrigin: "0% 50% -50",
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration,
        stagger,
        ease: "back.out(1.5)",
      }
    );
  }, []);

  // Progress bar glow animation
  const progressGlow = useCallback((element, progress) => {
    return gsap.to(element, {
      width: `${Math.min(progress, 100)}%`,
      duration: 0.8,
      ease: "power3.out",
      onUpdate: function () {
        const glowIntensity = 0.3 + Math.sin(Date.now() / 200) * 0.2;
        element.style.boxShadow = `0 0 ${20 + glowIntensity * 20}px rgba(252,163,17,${glowIntensity})`;
      },
    });
  }, []);

  // Confetti burst for celebration
  const confettiBurst = useCallback((container) => {
    const colors = ["#FCA311", "#E89310", "#FFD700", "#FF6B6B", "#4ECDC4"];
    const particles = [];

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute rounded-sm pointer-events-none";
      particle.style.width = `${Math.random() * 10 + 5}px`;
      particle.style.height = `${Math.random() * 10 + 5}px`;
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = "50%";
      particle.style.top = "50%";
      container.appendChild(particle);
      particles.push(particle);
    }

    particles.forEach((particle) => {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 100 + Math.random() * 200;
      const rotation = Math.random() * 720 - 360;

      gsap.to(particle, {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity - 100 + Math.random() * 300,
        rotation,
        opacity: 0,
        duration: 1.5 + Math.random() * 0.5,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    });
  }, []);

  // Page exit animation
  const pageExit = useCallback((elements) => {
    return gsap.to(elements, {
      opacity: 0,
      y: -30,
      scale: 0.95,
      filter: "blur(8px)",
      duration: 0.35,
      stagger: 0.05,
      ease: "power3.in",
    });
  }, []);

  // Page enter animation
  const pageEnter = useCallback((elements) => {
    return gsap.fromTo(
      elements,
      {
        opacity: 0,
        y: 40,
        scale: 0.95,
        filter: "blur(8px)",
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      }
    );
  }, []);

  return {
    timelineRef,
    elasticEntrance,
    createMagneticEffect,
    selectionRipple,
    glowPulse,
    textReveal,
    progressGlow,
    confettiBurst,
    pageExit,
    pageEnter,
  };
}

export default useAssessmentAnimations;
