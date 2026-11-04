import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Sparkles,
  Zap,
  Calendar,
  Clock,
  Coins,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  ShieldCheck,
  AlertCircle,
  Car,
  Flame,
  Shirt,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { Solar24hForecast, HeavyLoadSchedulePlan } from '../types';
import { soundFx } from '../utils/soundEffects';

interface SolarForecast24hCardProps {
  onScheduleAppliance?: (plan: HeavyLoadSchedulePlan) => void;
}

export const SolarForecast24hCard: React.FC<SolarForecast24hCardProps> = ({
  onScheduleAppliance,
}) => {
  const [selectedWeather, setSelectedWeather] = useState<string>('Cerah Berawan');
  const [forecast, setForecast] = useState<Solar24hForecast | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scheduledItems, setScheduledItems] = useState<{ [key: string]: boolean }>({});

  const fetchForecast = async (weatherCond = selectedWeather, isManual = false) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/solar/forecast-24h', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condition: weatherCond,
          installedCapacityKw: 5.0,
          tariffPerKwh: 1444.7,
          date: 'Besok',
        }),
      });

      const json = await res.json();
      if (json?.data) {
        setForecast(json.data);
        if (isManual) {
          soundFx.playSuccessChime();
        }
      }
    } catch (err) {
      console.warn('Error fetching 24h solar forecast:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchForecast(selectedWeather, false);
  }, [selectedWeather]);

  const handleToggleSchedule = (plan: HeavyLoadSchedulePlan) => {
    const nextState = !scheduledItems[plan.id];
    setScheduledItems((prev) => ({
      ...prev,
      [plan.id]: nextState,
    }));
    soundFx.playSuccessChime();

    if (onScheduleAppliance) {
      onScheduleAppliance({ ...plan, isScheduled: nextState });
    }
  };

  // Custom Tooltip for 24h Solar Prediction AreaChart
  const CustomForecastTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[190px] space-y-1 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1">
            <span className="font-bold text-slate-200">Pukul {data.hour} WIB</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                data.watts >= 3000
                  ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                  : data.watts > 0
                  ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="pt-1 space-y-0.5 text-[11px]">
            <div className="flex justify-between items-center text-slate-300">
              <span>Estimasi Daya Output:</span>
              <span className="font-extrabold text-amber-300">
                {data.watts.toLocaleString('id-ID')} Watt
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>Radiasi Global (GHI):</span>
              <span className="text-slate-200 font-medium">{data.irradiance} W/m²</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[10px]">
              <span>Indeks UV Matahari:</span>
              <span className="text-amber-400 font-medium">{data.uv}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const getApplianceIcon = (applianceName: string) => {
    const lower = applianceName.toLowerCase();
    if (lower.includes('ev') || lower.includes('charger') || lower.includes('mobil')) {
      return <Car className="w-4 h-4 text-emerald-600" />;
    }
    if (lower.includes('kalor') || lower.includes('water') || lower.includes('panas')) {
      return <Flame className="w-4 h-4 text-amber-600" />;
    }
    return <Shirt className="w-4 h-4 text-indigo-600" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-sm transition-all relative overflow-hidden space-y-5">
      {/* Decorative gradient background glow */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-radial from-amber-100/60 via-emerald-50/20 to-transparent pointer-events-none rounded-full blur-3xl"></div>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-emerald-600 text-white shadow-md shadow-amber-500/20">
            <Sun className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Prediksi Produksi Matahari 24 Jam
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Ramalan Cuaca Besok
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                • Sistem UPIC 5 kWp
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Prakiraan keluaran daya panel surya per jam untuk merencanakan pengoperasian beban besar secara bijak dan hemat.
            </p>
          </div>
        </div>

        {/* Weather Simulator / Scenario Switcher */}
        <div className="flex items-center gap-2 self-start md:self-center flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold text-slate-600">
            {[
              { id: 'Cerah Terik', label: 'Cerah Terik' },
              { id: 'Cerah Berawan', label: 'Cerah Berawan' },
              { id: 'Mendung Hujan', label: 'Mendung Hujan' },
            ].map((cond) => (
              <button
                key={cond.id}
                onClick={() => setSelectedWeather(cond.id)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedWeather === cond.id
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                {cond.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchForecast(selectedWeather, true)}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors disabled:opacity-50"
            title="Segarkan data prediksi 24 jam"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {forecast && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 relative z-10">
          {/* KPI 1: Estimasi Total Panen */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-3.5 rounded-xl border border-amber-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              Estimasi Panen Besok
            </span>
            <span className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5 block">
              {forecast.estimatedTotalYieldKwh.toFixed(1)}{' '}
              <span className="text-xs font-semibold text-amber-800">kWh</span>
            </span>
            <span className="text-[11px] text-amber-800 font-medium flex items-center gap-1">
              <Coins className="w-3 h-3 text-amber-600" />
              Hemat ~Rp {forecast.estimatedSavingsRp.toLocaleString('id-ID')}
            </span>
          </div>

          {/* KPI 2: Puncak Daya Maksimum */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Puncak Radiasi Tertinggi
            </span>
            <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
              {forecast.peakWatts.toLocaleString('id-ID')}{' '}
              <span className="text-xs font-semibold text-slate-500">Watt</span>
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" /> Pukul 12:00 WIB
            </span>
          </div>

          {/* KPI 3: Jendela Emas Surya */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50/60 p-3.5 rounded-xl border border-emerald-200/90">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
              Jendela Emas Surya (Golden Hours)
            </span>
            <span className="text-lg sm:text-xl font-black text-emerald-800 mt-0.5 block">
              {forecast.solarWindow}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium">
              Daya {'>'} 2.500 W (Beban Besar)
            </span>
          </div>

          {/* KPI 4: Indeks UV & Akurasi */}
          <div className="bg-slate-50/80 p-3.5 rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Indeks UV Maksimal
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                Akurasi {forecast.confidenceScore}%
              </span>
            </div>
            <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
              UV {forecast.uvIndexMax}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Kondisi: {forecast.weatherCondition}
            </span>
          </div>
        </div>
      )}

      {/* 24-Hour Solar Production Chart */}
      <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/90 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
          <div>
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              <span>Kurva Prediksi Keluaran Daya 24 Jam (Watt)</span>
            </h3>
            <p className="text-[11px] text-slate-500">
              Area berarsir kuning-hijau menandakan periode energi gratis dari sinar matahari
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-600 font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Prediksi Surya
            </span>
            <span className="flex items-center gap-1.5 text-rose-600">
              <span className="w-3 h-0.5 bg-rose-500 inline-block"></span>
              Ambang Beban Berat (2.500 W)
            </span>
          </div>
        </div>

        {forecast && forecast.hourlyData && (
          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={forecast.hourlyData}
                margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="solarYieldGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.6} />
                    <stop offset="60%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                  interval={2}
                />
                <YAxis
                  unit=" W"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  domain={[0, 4800]}
                />
                <Tooltip content={<CustomForecastTooltip />} />
                <ReferenceLine
                  y={2500}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey="watts"
                  stroke="#d97706"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#solarYieldGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Recommended Heavy Load Scheduling Section */}
      {forecast && forecast.recommendedHeavyLoadSchedules && (
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Rencana Penjadwalan Beban Berat Besok (AI Solar-Shift Recommendation)
              </h3>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Prioritas Beban Besar Bebas Biaya
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {forecast.recommendedHeavyLoadSchedules.map((plan) => {
              const isScheduled = !!scheduledItems[plan.id];
              return (
                <div
                  key={plan.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                    isScheduled
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white hover:bg-slate-50 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-slate-100 border border-slate-200">
                          {getApplianceIcon(plan.appliance)}
                        </div>
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {plan.appliance}
                        </span>
                      </div>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {plan.solarCoveragePercent}% Surya
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/60">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>{plan.recommendedWindow}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                      {plan.reason}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Potensi Hemat
                      </span>
                      <span className="text-xs font-bold text-emerald-700">
                        ~Rp {plan.estimatedSavingsRp.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleSchedule(plan)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg transition-transform active:scale-95 shadow-2xs ${
                        isScheduled
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      {isScheduled ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                          <span>Terjadwal</span>
                        </>
                      ) : (
                        <>
                          <Calendar className="w-3 h-3 text-amber-300" />
                          <span>Jadwalkan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Summary Banner */}
      {forecast && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 p-3.5 rounded-xl border border-emerald-200/80 flex items-start gap-2.5 text-xs text-slate-700 relative z-10">
          <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="leading-relaxed">
            <strong>Kesimpulan AI Prediktif:</strong> {forecast.aiSummary}{' '}
            <span className="text-emerald-800 font-semibold">
              Menghindari pengoperasian beban besar pada jam 17:00 - 22:00 WIB (Tarif Puncak PLN).
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
