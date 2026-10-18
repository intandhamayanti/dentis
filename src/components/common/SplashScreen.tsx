"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface SplashScreenProps {
  onLifting?: () => void;
  onComplete?: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onLifting,
  onComplete,
  forceShow = false,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"enter" | "hold" | "exitContent" | "exitCurtain" | "done">("enter");
  const [progress, setProgress] = useState(0);

  const onLiftingRef = useRef(onLifting);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onLiftingRef.current = onLifting;
    onCompleteRef.current = onComplete;
  }, [onLifting, onComplete]);

  // Quick skip handler (click anywhere or press Escape)
  const handleDismiss = () => {
    setPhase("exitCurtain");
    onLiftingRef.current?.();

    setTimeout(() => {
      setPhase("done");
      setIsVisible(false);
      document.body.style.overflow = "";
      onCompleteRef.current?.();
    }, 450);
  };

  useEffect(() => {
    // Clear any previous session flag so splash screen always runs reliably on load/refresh
    try {
      sessionStorage.removeItem("dentis_splash_shown");
      localStorage.removeItem("dentis_splash_shown");
      document.documentElement.classList.remove("splash-disabled");
    } catch {}

    // Lock scrolling during splash
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Global helper for replaying splash on demand via console if needed
    if (typeof window !== "undefined") {
      (window as unknown as { __replayDentisSplash?: () => void }).__replayDentisSplash = () => {
        window.location.reload();
      };
    }

    // 2. Animated Progress Counter: 0% to 100% over 1200ms
    const start = performance.now();
    const duration = 1200;
    let frameId: number;

    const animateProgress = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);

      if (elapsed < duration) {
        frameId = requestAnimationFrame(animateProgress);
      }
    };
    frameId = requestAnimationFrame(animateProgress);

    // 3. Animation Phase Timers:
    // 1200ms: Progress reaches 100% -> Hold briefly
    const timerHold = setTimeout(() => {
      setPhase("hold");
    }, 1200);

    // 1450ms: Exit Content (Text & Logo slide up slightly)
    const timerExitContent = setTimeout(() => {
      setPhase("exitContent");
    }, 1450);

    // 1650ms: Exit Curtain (Stage curtain slides upward offscreen)
    const timerExitCurtain = setTimeout(() => {
      setPhase("exitCurtain");
      onLiftingRef.current?.();
    }, 1650);

    // 2350ms: Unmount and re-enable scroll
    const timerDone = setTimeout(() => {
      setPhase("done");
      setIsVisible(false);
      document.body.style.overflow = originalOverflow || "";
      onCompleteRef.current?.();
    }, 2350);

    // Failsafe timer (3000ms max)
    const timerSafety = setTimeout(() => {
      document.body.style.overflow = "";
      setIsVisible(false);
      setPhase("done");
      onLiftingRef.current?.();
      onCompleteRef.current?.();
    }, 3000);

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(timerHold);
      clearTimeout(timerExitContent);
      clearTimeout(timerExitCurtain);
      clearTimeout(timerDone);
      clearTimeout(timerSafety);
      document.body.style.overflow = originalOverflow || "";
    };
  }, [forceShow]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") handleDismiss();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!isVisible || phase === "done") {
    return null;
  }

  const isContentExiting = phase === "exitContent" || phase === "exitCurtain";
  const isCurtainExiting = phase === "exitCurtain";

  return (
    <motion.div
      id="dentis-splash-screen"
      onClick={handleDismiss}
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
      style={{
        background: "radial-gradient(circle at 50% 45%, #126371 0%, #0D5966 50%, #073840 100%)",
      }}
      initial={{ y: 0 }}
      animate={{
        y: isCurtainExiting ? "-100%" : "0%",
      }}
      transition={{
        duration: 0.75,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      {/* Dynamic Animated Ambient Glow */}
      <motion.div
        className="absolute w-80 sm:w-[440px] h-80 sm:h-[440px] rounded-full bg-teal-300/15 blur-3xl pointer-events-none -translate-y-6"
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        aria-hidden="true"
      />

      {/* Central Brand Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center px-4 pointer-events-none"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={
          isContentExiting
            ? { opacity: 0, y: -60, scale: 0.95, filter: "blur(4px)" }
            : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        }
        transition={{
          duration: isContentExiting ? 0.35 : 0.85,
          ease: isContentExiting ? [0.76, 0, 0.24, 1] : [0.16, 1, 0.3, 1],
        }}
      >
        {/* Logo Mark with Pulsing Halo and Subtle Spring Entrance */}
        <div className="relative mb-5 flex items-center justify-center">
          {/* Expanding Pulsing Halo Ring */}
          <motion.div
            className="absolute w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-teal-200/40"
            animate={{
              scale: [1, 1.45],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />

          <motion.div
            className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: [1, 1.04, 1],
              opacity: 1,
            }}
            transition={{
              scale: {
                duration: 2.2,
                repeat: Infinity,
                ease: "easeInOut",
              },
              opacity: { duration: 0.6 },
            }}
          >
            <Image
              src="/assets/logo-white-clean.png"
              alt="dentis. logo"
              width={112}
              height={112}
              priority
              unoptimized
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
            />
          </motion.div>
        </div>

        {/* Brand Name "dentis." with Staggered Entrance */}
        <motion.div
          className="flex items-baseline justify-center font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl text-white select-none"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span>dentis</span>
        </motion.div>

        {/* Tagline "Precision Dental Care & Aesthetics" */}
        <motion.p
          className="mt-2.5 text-[10px] sm:text-xs md:text-sm font-medium tracking-[0.26em] uppercase text-white/80"
          style={{ fontFamily: "var(--font-bricolage), sans-serif" }}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          Precision Dental Care &amp; Aesthetics
        </motion.p>

        {/* Dynamic Progress Bar & Percentage Counter */}
        <div className="flex flex-col items-center gap-2 mt-7">
          <div className="w-36 sm:w-44 h-[3px] bg-white/15 rounded-full overflow-hidden relative">
            {/* Filled Progress Strip */}
            <motion.div
              className="h-full bg-gradient-to-r from-teal-200 via-white to-emerald-300 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
            {/* Shimmer Light Reflection Sweep */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent w-20"
              animate={{ x: ["-100%", "250%"] }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          {/* Live Progress Number Counter */}
          <span className="text-[11px] font-mono tracking-wider text-teal-100/70 tabular-nums">
            {progress}%
          </span>
        </div>
      </motion.div>

      {/* Stage Curtain Bottom Shadow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none bg-gradient-to-t from-black/25 to-transparent"
        aria-hidden="true"
      />
    </motion.div>
  );
};
