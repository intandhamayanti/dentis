"use client";

import React from "react";
import { useDentalStore } from "@/context/DentalContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export const Toast: React.FC = () => {
  const { toast, clearToast } = useDentalStore();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />,
    info: <Info className="w-4 h-4 text-[#355D81] shrink-0" />,
  };

  const borderColors = {
    success: "border-emerald-200 bg-white/95",
    warning: "border-amber-200 bg-white/95",
    info: "border-blue-200 bg-white/95",
  };

  return (
    <div className="fixed bottom-24 right-5 sm:right-6 z-50 max-w-sm w-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-center justify-between gap-3 p-3.5 rounded-2xl border shadow-xl backdrop-blur-md ${
          borderColors[toast.type]
        }`}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icons[toast.type]}
          <p className="text-xs font-semibold text-slate-800 truncate">
            {toast.message}
          </p>
        </div>

        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
