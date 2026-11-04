import React, { useState } from 'react';
import {
  Clock,
  Zap,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Calendar,
  Flame,
  Coins,
  Shirt,
  Car,
  CookingPot,
  ArrowRight,
  Info,
  Sliders,
  ShieldCheck,
  TrendingDown,
} from 'lucide-react';
import { HeavyApplianceOptimalWindow } from '../types';
import { soundFx } from '../utils/soundEffects';

interface PeakHoursAnalysisCardProps {
  onScheduleAppliance?: (appliance: HeavyApplianceOptimalWindow) => void;
}

export const PeakHoursAnalysisCard: React.FC<PeakHoursAnalysisCardProps> = ({
  onScheduleAppliance,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'kitchen' | 'laundry' | 'ev'>('all');
  const [scheduledItems, setScheduledItems] = useState<{ [key: string]: boolean }>({});

  const heavyAppliances: HeavyApplianceOptimalWindow[] = [
    {
      id: 'app-oven',
      name: 'Oven Listrik & Air Fryer Dapur',
      category: 'kitchen',
      typicalWatts: 1650,
      avgDurationMinutes: 60,
      dangerZoneTime: '18:30 - 20:30 WIB (Jam Puncak)',
      optimalTime: '11:30 - 13:30 WIB (Puncak Surya)',
      solarOffsetPercent: 100,
      savingsPerUseRp: 5800,
      weeklyFrequency: 3,
      monthlySavingsRp: 69600,
      reason:
        'Memanggang di siang hari memanfaatkan surplus 3.8 kW panel surya secara gratis. Menghindari oven menyala bersamaan dengan AC & lampu malam yang memicu risiko trip sekering MCB 4.400 VA.',
    },
    {
      id: 'app-washing-machine',
      name: 'Mesin Cuci & Pengering Front Loading',
      category: 'laundry',
      typicalWatts: 1200,
      avgDurationMinutes: 75,
      dangerZoneTime: '17:30 - 21:00 WIB (Jam Puncak)',
      optimalTime: '10:00 - 12:30 WIB (Jam Emas Surya)',
      solarOffsetPercent: 95,
      savingsPerUseRp: 4500,
      weeklyFrequency: 4,
      monthlySavingsRp: 72000,
      reason:
        'Siklus pemanasan air cuci dan pengeringan pakaian membutuhkan daya besar. Menjalankan mesin cuci saat radiasi matahari optimal menekan 95% biaya kWh PLN.',
    },
    {
      id: 'app-water-heater',
      name: 'Pompa Kalor Pemanas Air (Heat Pump)',
      category: 'laundry',
      typicalWatts: 1250,
      avgDurationMinutes: 90,
      dangerZoneTime: '18:00 - 21:00 WIB (Tarif WBP)',
      optimalTime: '09:30 - 11:30 WIB (Pagi Terik)',
      solarOffsetPercent: 100,
      savingsPerUseRp: 4200,
      weeklyFrequency: 7,
      monthlySavingsRp: 126000,
      reason:
        'Tangki 200 liter memiliki insulasi termal superior. Air dipanaskan secara mandiri di siang hari dan suhu tetap hangat hingga mandi malam tanpa perlu pemanas listrik tambahan.',
    },
    {
      id: 'app-ev-wallbox',
      name: 'Smart EV Wallbox Charger Mobil',
      category: 'ev',
      typicalWatts: 3500,
      avgDurationMinutes: 180,
      dangerZoneTime: '17:00 - 22:00 WIB (Zona Bahaya Beban)',
      optimalTime: '11:00 - 13:30 WIB (Surya) / 23:00 - 04:00 (LWBP)',
      solarOffsetPercent: 100,
      savingsPerUseRp: 17500,
      weeklyFrequency: 2,
      monthlySavingsRp: 140000,
      reason:
        'Daya 3.5 kW seketika membebani sekering jika diisi malam hari saat pulang kerja. Alihkan pengisian ke siang hari saat mobil di rumah atau gunakan timer malam larut.',
    },
  ];

  const filteredAppliances = heavyAppliances.filter((item) => {
    if (activeFilter === 'kitchen') return item.category === 'kitchen';
    if (activeFilter === 'laundry') return item.category === 'laundry';
    if (activeFilter === 'ev') return item.category === 'ev';
    return true;
  });

  const totalPotentialMonthlyRp = heavyAppliances.reduce((acc, cur) => acc + cur.monthlySavingsRp, 0);

  const handleToggleSchedule = (appliance: HeavyApplianceOptimalWindow) => {
    const nextState = !scheduledItems[appliance.id];
    setScheduledItems((prev) => ({
      ...prev,
      [appliance.id]: nextState,
    }));
    soundFx.playSuccessChime();

    if (onScheduleAppliance) {
      onScheduleAppliance({ ...appliance, isScheduled: nextState });
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'kitchen') return <CookingPot className="w-4 h-4 text-amber-600" />;
    if (category === 'laundry') return <Shirt className="w-4 h-4 text-teal-600" />;
    return <Car className="w-4 h-4 text-emerald-600" />;
  };

  // 24-Hour Visual Tariff Timeline
  const hoursSegments = [
    { label: '00-05', type: 'off_peak', name: 'LWBP Hemat Malam', color: 'bg-indigo-100 text-indigo-800' },
    { label: '06-09', type: 'standard', name: 'Pagi Menuju Terik', color: 'bg-teal-100 text-teal-800' },
    { label: '09-14', type: 'solar_golden', name: 'Jam Emas Surya (Terbaik Beban Berat)', color: 'bg-emerald-500 text-white font-bold ring-2 ring-emerald-400/40' },
    { label: '14-17', type: 'standard', name: 'Sore Transisi', color: 'bg-amber-100 text-amber-900' },
    { label: '17-22', type: 'peak_danger', name: 'WBP Jam Puncak (HINDARI BEBAN BERAT!)', color: 'bg-rose-500 text-white font-bold animate-pulse-glow' },
    { label: '22-24', type: 'off_peak', name: 'LWBP Malam', color: 'bg-indigo-100 text-indigo-800' },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-sm transition-all relative overflow-hidden space-y-5">
      {/* Subtle decorative radial accent */}
      <div className="absolute top-0 right-0 -translate-y-8 translate-x-8 w-72 h-72 bg-radial from-rose-100/40 via-amber-50/20 to-transparent pointer-events-none rounded-full blur-2xl"></div>

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-600 via-amber-600 to-emerald-700 text-white shadow-md shadow-rose-900/10">
            <Clock className="w-6 h-6 text-amber-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Analisis Jam Puncak & Waktu Optimal Beban Berat
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-600" />
                WBP 17:00 – 22:00 WIB
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                • Evaluasi 7 Hari Terakhir
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekomendasi jam operasional paling hemat untuk oven, mesin cuci, dan pemanas air guna mencegah lonjakan tarif dan risiko trip MCB PLN.
            </p>
          </div>
        </div>

        {/* Quick Potential Savings Highlight */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 px-3.5 py-2 rounded-xl border border-emerald-200 flex items-center gap-2.5 self-start md:self-center">
          <Coins className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Potensi Hemat Shifting
            </span>
            <span className="text-xs font-black text-emerald-700">
              ~Rp {totalPotentialMonthlyRp.toLocaleString('id-ID')} / bulan
            </span>
          </div>
        </div>
      </div>

      {/* 24-Hour Visual Tariff & Solar Heatmap Strip */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-2.5 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-bold text-slate-800 gap-1">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Peta Waktu Tarif Listrik 24 Jam & Ketersediaan Surya:
          </span>
          <span className="text-[11px] text-slate-500 font-normal">
            Peralihan beban berat ke jam hijau menghemat hingga 100% biaya listrik
          </span>
        </div>

        {/* Segmented Timeline Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {hoursSegments.map((seg, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl text-center border transition-all ${seg.color} border-slate-200/80`}
            >
              <span className="text-xs font-extrabold block">{seg.label} WIB</span>
              <span className="text-[10px] block font-semibold truncate leading-tight mt-0.5">
                {seg.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Usage Insight Finding Alert */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50/40 to-slate-50 p-4 rounded-xl border border-amber-200/90 flex items-start gap-3 text-xs text-slate-700 relative z-10">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900">
            Temuan Pola Beban 7 Hari Terakhir:
          </h4>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            Sebesar <strong>72% lonjakan daya puncak</strong> terjadi antara pukul <strong>18:30 – 20:30 WIB</strong> (puncak tertinggi <strong>4.120 W pada hari Jumat</strong>). Hal ini disebabkan mesin cuci dan oven dinyalakan berbarengan saat AC dan lampu aktif. Memindahkan 2–3 siklus ini ke siang hari (*10:30 – 13:30 WIB*) dapat mengeliminasi risiko trip sekering MCB dan memangkas tagihan listrik bulanan.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none relative z-10">
        {[
          { id: 'all', label: 'Semua Peralatan Berat' },
          { id: 'kitchen', label: 'Dapur (Oven & Air Fryer)' },
          { id: 'laundry', label: 'Sanitasi (Mesin Cuci & Water Heater)' },
          { id: 'ev', label: 'Kendaraan Listrik (EV Charger)' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id as any)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appliances Recommendations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
        {filteredAppliances.map((appliance) => {
          const isScheduled = !!scheduledItems[appliance.id];
          return (
            <div
              key={appliance.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                isScheduled
                  ? 'bg-emerald-50/70 border-emerald-300 ring-2 ring-emerald-500/20'
                  : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-2xs'
              }`}
            >
              <div className="space-y-2.5">
                {/* Title & Category Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-100 border border-slate-200">
                      {getCategoryIcon(appliance.category)}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-900 leading-snug">
                        {appliance.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-semibold">
                        Tarikan Daya: ~{appliance.typicalWatts} Watt ({appliance.avgDurationMinutes} mnt)
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex-shrink-0">
                    {appliance.solarOffsetPercent}% Surya Gratis
                  </span>
                </div>

                {/* Compare Windows: Danger vs Optimal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {/* Danger Zone */}
                  <div className="p-2.5 bg-rose-50/80 rounded-xl border border-rose-200 text-rose-950 space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-rose-700 block tracking-wider flex items-center gap-1">
                      <AlertTriangle className="w-2.5 h-2.5" /> Waktu Terlarang:
                    </span>
                    <span className="font-extrabold text-xs block text-rose-900">
                      {appliance.dangerZoneTime}
                    </span>
                    <span className="text-[10px] text-rose-700 block">
                      Tarif WBP tertinggi & rawan trip
                    </span>
                  </div>

                  {/* Optimal Zone */}
                  <div className="p-2.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-emerald-950 space-y-0.5">
                    <span className="text-[9px] uppercase font-bold text-emerald-700 block tracking-wider flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Waktu Rekomendasi:
                    </span>
                    <span className="font-extrabold text-xs block text-emerald-800">
                      {appliance.optimalTime}
                    </span>
                    <span className="text-[10px] text-emerald-700 block">
                      Panen surya melimpah (Rp 0)
                    </span>
                  </div>
                </div>

                {/* Analytical Reason */}
                <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                  {appliance.reason}
                </p>
              </div>

              {/* Card Footer: Savings & Action Button */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Estimasi Hemat
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xs font-bold text-emerald-700">
                      ~Rp {appliance.savingsPerUseRp.toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-slate-500">/ pemakaian</span>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSchedule(appliance)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-transform active:scale-95 shadow-2xs ${
                    isScheduled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isScheduled ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Jadwal Optimal Terpasang</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-3.5 h-3.5 text-amber-300" />
                      <span>Pasang Jadwal Hemat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Islamic & Ecological Closing Note */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs text-slate-600 relative z-10">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <p className="leading-snug text-[11px]">
            <strong>Prinsip Syariat & Keberlanjutan:</strong> Mengatur jadwal beban berat adalah ikhtiar nyata menghindari pemborosan (*Israf / Tabdzir*) dan menjaga kestabilan energi rumah demi kebaikan bersama.
          </p>
        </div>
      </div>
    </div>
  );
};
