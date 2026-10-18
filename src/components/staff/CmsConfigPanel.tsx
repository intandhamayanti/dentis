"use client";

import React, { useState } from "react";
import { useDentalStore } from "@/context/DentalContext";
import {
  Settings,
  Sparkles,
  Save,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  DollarSign,
  Tag,
  Phone,
  MapPin,
} from "lucide-react";

export const CmsConfigPanel: React.FC = () => {
  const {
    cmsConfig,
    updateCmsConfig,
    services,
    updateServiceAvailability,
    updateServicePrice,
    showToast,
  } = useDentalStore();

  const [announcementText, setAnnouncementText] = useState(
    cmsConfig.announcementText
  );
  const [showAnnouncement, setShowAnnouncement] = useState(
    cmsConfig.showAnnouncement
  );
  const [announcementBadge, setAnnouncementBadge] = useState(
    cmsConfig.announcementBadge
  );
  const [promoDiscount, setPromoDiscount] = useState(
    cmsConfig.promoDiscountPercent
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    cmsConfig.emergencyContact
  );
  const [clinicAddress, setClinicAddress] = useState(cmsConfig.clinicAddress);

  // Local prices state for editing
  const [editingPrices, setEditingPrices] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    services.forEach((s) => {
      map[s.id] = s.basePrice;
    });
    return map;
  });

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateCmsConfig({
      announcementText,
      showAnnouncement,
      announcementBadge,
      promoDiscountPercent: Number(promoDiscount),
      emergencyContact: emergencyPhone,
      clinicAddress,
    });
  };

  const handlePriceChange = (serviceId: string, val: number) => {
    setEditingPrices((prev) => ({
      ...prev,
      [serviceId]: val,
    }));
  };

  const handleSavePrice = (serviceId: string) => {
    const srv = services.find((s) => s.id === serviceId);
    if (!srv) return;
    const newPrice = editingPrices[serviceId] || srv.basePrice;
    updateServicePrice(serviceId, newPrice, Math.round(newPrice * 1.8));
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C1E55B]" />
            <h3 className="text-xl font-black text-[#1E293B]">
              Mini CMS Configurator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Kontrol konten publik, teks promo banner, dan ketersediaan layanan secara langsung
          </p>
        </div>

        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ● Live Sync ke Landing Page
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Banner & Clinic Contact Config */}
        <div className="lg:col-span-6 space-y-6">
          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <h4 className="text-sm font-extrabold text-[#355D81] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C1E55B]" />
              <span>Pengumuman & Promo Banner (Navbar Top)</span>
            </h4>

            {/* Toggle Banner Switch */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  Tampilkan Banner Promo
                </p>
                <p className="text-[10px] text-slate-400">
                  Muncul di bagian paling atas seluruh halaman
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAnnouncement(!showAnnouncement)}
                className="cursor-pointer"
              >
                {showAnnouncement ? (
                  <ToggleRight className="w-8 h-8 text-[#355D81]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-300" />
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Badge Label
                </label>
                <input
                  type="text"
                  value={announcementBadge}
                  onChange={(e) => setAnnouncementBadge(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#355D81] font-semibold text-slate-800"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Diskon Promo (%)
                </label>
                <div className="relative">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={promoDiscount}
                    onChange={(e) => setPromoDiscount(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#355D81] font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Teks Pengumuman Promo
              </label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#355D81] text-slate-800 font-medium resize-none leading-relaxed"
              />
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Info Kontak & Operasional
              </h4>
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Hotline WhatsApp Darurat
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#355D81] font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Alamat Fisik Klinik
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#355D81] font-medium text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#355D81] hover:bg-[#25425f] text-white text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Save className="w-4 h-4 text-[#C1E55B]" />
              <span>Simpan Konfigurasi Header & Kontak</span>
            </button>
          </form>
        </div>

        {/* Right: Service Availability & Pricing Controller */}
        <div className="lg:col-span-6 space-y-4">
          <h4 className="text-sm font-extrabold text-[#355D81] uppercase tracking-wider flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-[#355D81]" />
            <span>Ketersediaan Layanan & Base Price</span>
          </h4>

          <div className="space-y-3">
            {services.map((srv) => (
              <div
                key={srv.id}
                className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">
                      {srv.shortName}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                        srv.isAvailable
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {srv.isAvailable ? "Online" : "Penuh / Tutup"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {srv.name}
                  </p>
                </div>

                {/* Price input + Actions */}
                <div className="flex items-center gap-2">
                  <div className="w-32">
                    <input
                      type="number"
                      step="50000"
                      value={editingPrices[srv.id] || srv.basePrice}
                      onChange={(e) =>
                        handlePriceChange(srv.id, Number(e.target.value))
                      }
                      className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-bold"
                    />
                  </div>

                  <button
                    onClick={() => handleSavePrice(srv.id)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold cursor-pointer"
                    title="Simpan Harga"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  </button>

                  <button
                    onClick={() =>
                      updateServiceAvailability(srv.id, !srv.isAvailable)
                    }
                    className="cursor-pointer"
                    title="Toggle Online / Penuh"
                  >
                    {srv.isAvailable ? (
                      <ToggleRight className="w-7 h-7 text-[#355D81]" />
                    ) : (
                      <ToggleLeft className="w-7 h-7 text-slate-300" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-[#355D81] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>
              Perubahan harga langsung mempengaruhi nilai minimum pada Kalkulator
              Estimasi Biaya dan form reservasi pasien publik.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
