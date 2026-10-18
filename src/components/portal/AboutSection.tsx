"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

// Modern 8-spoke asterisk icon matching the reference layout
const AsteriskIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
    <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
  </svg>
);

const ABOUT_DESCRIPTION =
  "Di dentis, kami memprioritaskan senyum sehat Anda melalui perawatan dokter spesialis berteknologi presisi dalam suasana klinik yang tenang dan nyaman.";

interface CharData {
  char: string;
  globalIndex: number;
}

interface WordData {
  word: string;
  chars: CharData[];
}

const WORDS_DATA: WordData[] = (() => {
  let globalIndex = 0;
  return ABOUT_DESCRIPTION.split(" ").map((word) => {
    const chars = word.split("").map((char) => ({
      char,
      globalIndex: globalIndex++,
    }));
    return { word, chars };
  });
})();

const TOTAL_CHARS = WORDS_DATA.reduce((acc, w) => acc + w.chars.length, 0);

const ScrollRevealChar: React.FC<{
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}> = ({ char, progress, range }) => {
  const opacity = useTransform(progress, range, [0, 1]);

  return (
    <span className="relative inline-block">
      {/* Huruf dasar: abu-abu lembut (slate-300) sebelum discroll */}
      <span className="text-slate-300 transition-colors select-none">
        {char}
      </span>
      {/* Huruf aktif: hitam pekat (slate-900) yang mengalir per huruf saat discroll */}
      <motion.span
        style={{ opacity }}
        className="absolute inset-0 text-slate-900 select-none"
        aria-hidden="true"
      >
        {char}
      </motion.span>
    </span>
  );
};

export const AboutSection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);

  // Offset scroll luas dan bertahap agar animasi per huruf mengalir anggun dan tuntas saat dibaca
  const { scrollYProgress } = useScroll({
    target: textRef,
    offset: ["start 0.92", "start 0.30"],
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Play/Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  // Mute/Unmute toggle
  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  // Fullscreen toggle
  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  // Time update tracking
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration || 0;
    setCurrentTime(current);
    setProgress(total > 0 ? (current / total) * 100 : 0);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || 0);
    setIsPlaying(!videoRef.current.paused);
  };

  // Seekbar interaction
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = percent * duration;
    setProgress(percent * 100);
  };

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Ensure autoplay on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
        setIsPlaying(false);
      });
    }
  }, []);

  const stats = [
    {
      value: "14.200+",
      label: "Senyum Pasien Dipercantik",
      sublabel: "Hasil restorasi & ortodonti terbukti presisi",
    },
    {
      value: "99.4%",
      label: "Tingkat Kepuasan & Kenyamanan",
      sublabel: "Perawatan lembut minim nyeri tanpa rasa cemas",
    },
    {
      value: "24+",
      label: "Dokter Gigi Spesialis Berlisensi",
      sublabel: "Tim ortodontis & bedah lulusan terkemuka",
    },
  ];

  return (
    <section
      id="about"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 scroll-mt-28 font-['Bricolage_Grotesque',sans-serif]"
    >
      {/* Top Header: Badge About Us & Headline editorial dengan jarak yang lega dan animasi warna teks saat scroll */}
      <div className="flex flex-col lg:flex-row lg:items-start gap-8 sm:gap-10 lg:gap-16 xl:gap-24 mb-10 sm:mb-14 lg:mb-16">
        <div className="shrink-0 pt-1.5 sm:pt-2 lg:w-44 xl:w-52">
          <span className="group/badge inline-flex items-center gap-2 px-4.5 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#0D5966]/10 hover:bg-[#0D5966]/15 text-[#0D5966] text-xs sm:text-sm font-semibold tracking-wide border border-[#0D5966]/15 shadow-xs transition-all cursor-pointer">
            <AsteriskIcon className="w-3.5 h-3.5 text-[#0D5966] transition-transform duration-700 ease-out group-hover/badge:rotate-[360deg] group-hover/badge:scale-110 hover:rotate-[360deg] animate-[spin_10s_linear_infinite]" />
            About Us
          </span>
        </div>
        <h2
          ref={textRef}
          className="flex-1 text-2xl sm:text-3xl lg:text-[36px] xl:text-[40px] font-bold tracking-tight leading-[1.3] w-full"
        >
          <span className="sr-only">{ABOUT_DESCRIPTION}</span>
          <span aria-hidden="true" className="inline">
            {WORDS_DATA.map((wordData, wordIdx) => (
              <span
                key={wordIdx}
                className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0"
              >
                {wordData.chars.map((charData) => {
                  const step = 1 / TOTAL_CHARS;
                  const start = charData.globalIndex * step;
                  const end = Math.min(1, start + step * 2.2);
                  return (
                    <ScrollRevealChar
                      key={charData.globalIndex}
                      char={charData.char}
                      progress={scrollYProgress}
                      range={[start, end]}
                    />
                  );
                })}
              </span>
            ))}
          </span>
        </h2>
      </div>

      {/* Main Content Grid: 2-column asymmetric (approx 7 cols / 5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
        {/* Left Column — Video Container (~7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div
            ref={containerRef}
            className="rounded-[28px] sm:rounded-[32px] overflow-hidden relative shadow-md bg-slate-900 aspect-[4/3] w-full flex-1 group select-none border border-slate-200/40"
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full h-full object-cover cursor-pointer"
              onClick={togglePlay}
            >
              <source src="/videos/braces-transformation.mp4" type="video/mp4" />
              <source src="/Videos/braces-transformation.mp4" type="video/mp4" />
            </video>

            {/* Floating Center Play/Pause Toggle Pill */}
            <button
              type="button"
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 backdrop-blur-md bg-[#0D5966]/85 hover:bg-[#0D5966] text-white rounded-full p-4 sm:p-5 shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center border border-white/20"
              aria-label={isPlaying ? "Jeda video simulasi" : "Putar video simulasi"}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              ) : (
                <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5" />
              )}
            </button>

            {/* Bottom Progress Bar Indicator for Video Aesthetics */}
            <div className="absolute bottom-0 inset-x-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-10 pb-4 px-4 sm:px-6 pointer-events-auto">
              {/* Progress Bar Track */}
              <div
                onClick={handleSeek}
                className="w-full h-1.5 hover:h-2 bg-white/25 rounded-full cursor-pointer relative mb-3 transition-all duration-150 overflow-hidden group/bar"
                title="Geser durasi video"
              >
                <div
                  className="h-full bg-white rounded-full transition-all duration-75"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls & Timing Strip */}
              <div className="flex items-center justify-between text-white text-xs font-medium">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="hover:text-emerald-300 transition-colors cursor-pointer p-1"
                    aria-label={isPlaying ? "Jeda" : "Putar"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </button>
                  <span className="tabular-nums font-mono text-[11px] sm:text-xs tracking-wider text-white/90">
                    {formatTime(currentTime)} / {formatTime(duration || 9)}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase tracking-wider text-white/70 bg-white/10 px-2.5 py-0.5 rounded-full font-medium">
                    3D Simulation
                  </span>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                    aria-label={isMuted ? "Bunyikan audio" : "Bisukan audio"}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="text-white/80 hover:text-white transition-colors cursor-pointer p-1"
                    aria-label="Layar Penuh"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Stats Wrapper (~5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="bg-[#0D5966] p-3 sm:p-4 rounded-[28px] sm:rounded-[32px] flex flex-col justify-between gap-3 sm:gap-3.5 h-full shadow-lg border border-[#0D5966]/20">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="rounded-[20px] sm:rounded-[22px] p-5 sm:p-6 lg:p-7 bg-white text-slate-900 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between flex-1 border border-slate-100 group/card group cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-3xl sm:text-4xl lg:text-[2.65rem] font-bold tracking-tight text-slate-900 group-hover/card:text-[#0D5966] group-hover:text-[#0D5966] transition-colors leading-none">
                    {stat.value}
                  </span>
                  <AsteriskIcon
                    className="w-5 h-5 text-slate-300 group-hover/card:text-[#0D5966] group-hover:text-[#0D5966] transition-transform duration-700 ease-out group-hover/card:rotate-[360deg] group-hover:rotate-[360deg] group-hover/card:scale-110 group-hover:scale-110 hover:rotate-[360deg] hover:scale-110 shrink-0 mt-0.5"
                  />
                </div>
                <div className="mt-3 sm:mt-4">
                  <p className="text-sm sm:text-[0.95rem] font-semibold text-slate-800 leading-snug">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
