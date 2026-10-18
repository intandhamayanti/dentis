"use client";

import React, { useState } from "react";
import { DentalProvider } from "@/context/DentalContext";
import { Navbar } from "./portal/Navbar";
import { HeroSection } from "./portal/HeroSection";
import { AboutSection } from "./portal/AboutSection";
import { ServicesSection } from "./portal/ServicesSection";
import { TransformationsSection } from "./portal/TransformationsSection";
import { DoctorsSection } from "./portal/DoctorsSection";
import { ReviewsSection } from "./portal/ReviewsSection";
import { FaqSection } from "./portal/FaqSection";
import { CtaBannerSection } from "./portal/CtaBannerSection";
import { BookingModal } from "./portal/BookingModal";
import { Footer } from "./portal/Footer";
import { Toast } from "./common/Toast";
import { SplashScreen } from "./common/SplashScreen";
import { FloatingWhatsApp } from "./common/FloatingWhatsApp";
import { motion } from "framer-motion";

const AppContent: React.FC = () => {
  const [curtainLifting, setCurtainLifting] = useState(false);
  const [splashDone, setSplashDone] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F5F4] text-[#0F172A] relative">
      {/* Standalone Luxury Splash Screen / Preloader */}
      <SplashScreen
        onLifting={() => setCurtainLifting(true)}
        onComplete={() => {
          setCurtainLifting(true);
          setSplashDone(true);
        }}
      />

      {/* Dynamic Glassmorphism Navbar (Shrink on Scroll into Floating Pill Dock) */}
      <Navbar />

      {/* Main Content Flow: Smoothly scales & fades into view as splash screen curtain lifts */}
      <motion.main
        className="flex-1 origin-top"
        initial={{ opacity: 0.92, scale: 0.98 }}
        animate={{
          opacity: curtainLifting || splashDone ? 1 : 0.92,
          scale: curtainLifting || splashDone ? 1 : 0.98,
        }}
        transition={{
          duration: 0.85,
          ease: [0.76, 0, 0.24, 1],
        }}
      >
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <TransformationsSection />
        <DoctorsSection />
        <ReviewsSection />
        <FaqSection />
        <CtaBannerSection />
      </motion.main>

      {/* Footer */}
      <Footer />

      {/* 3-Step Instant Booking Modal, Floating WhatsApp, & Toast */}
      <BookingModal />
      <FloatingWhatsApp />
      <Toast />
    </div>
  );
};

export const MainApp: React.FC = () => {
  return (
    <DentalProvider>
      <AppContent />
    </DentalProvider>
  );
};
