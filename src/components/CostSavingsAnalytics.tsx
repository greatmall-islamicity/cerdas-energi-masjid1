import React, { useState } from 'react';
import {
  TrendingDown,
  Coins,
  Leaf,
  TreeDeciduous,
  DollarSign,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle,
  Activity,
  AlertTriangle,
  Zap,
  Info,
  Layers,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { HomeTelemetry, SolarTelemetry } from '../types';
import { MonthlyEfficiencyTrendChart } from './MonthlyEfficiencyTrendChart';

interface CostSavingsAnalyticsProps {
  home: HomeTelemetry;
  solar: SolarTelemetry;
}

export const CostSavingsAnalytics: React.FC<CostSavingsAnalyticsProps> = ({
  home,
  solar,
}) => {
  const [selectedTariff, setSelectedTariff] = useState<number>(1444.7); // Rp / kWh
  const [chartViewMode, setChartViewMode] = useState<'stacked_wbp' | 'peak_demand' | 'total_kwh'>('stacked_wbp');

  // Dynamic values for today based on real-time home load
  const isOverloadNow = home.homeConsumptionWatts > home.peakPowerLimitWatts;
  const todayPeakWatts = Math.max(
    isOverloadNow ? home.homeConsumptionWatts : 3350,
    home.homeConsumptionWatts
  );
  const todayTotalKwh = Math.round(((home.homeConsumptionWatts * 6.5) / 1000 + 7.8) * 10) / 10;
  const todayWbpKwh = Math.round((todayTotalKwh * 0.32) * 10) / 10;
  const todayLwbpKwh = Math.round((todayTotalKwh - todayWbpKwh) * 10) / 10;

  // 7-day daily electricity consumption & peak load trend data
  const consumptionData = [
    {
      day: 'Senin',
      date: '28 Sep',
      lwbpKwh: 12.8,
      wbpKwh: 5.4,
      totalKwh: 18.2,
      peakWatts: 3150,
      savedRp: 19800,
      solarKwh: 13.8,
      status: 'Normal',
      isPeakDay: false,
    },
    {
      day: 'Selasa',
      date: '29 Sep',
      lwbpKwh: 13.9,
      wbpKwh: 5.9,
      totalKwh: 19.8,
      peakWatts: 3320,
      savedRp: 21500,
      solarKwh: 15.2,
      status: 'Normal',
      isPeakDay: false,
    },
    {
      day: 'Rabu',
      date: '30 Sep',
      lwbpKwh: 14.6,
      wbpKwh: 6.8,
      totalKwh: 21.4,
      peakWatts: 3650,
      savedRp: 23400,
      solarKwh: 16.5,
      status: 'Beban Puncak Tinggi',
      isPeakDay: false,
    },
    {
      day: 'Kamis',
      date: '01 Okt',
      lwbpKwh: 12.7,
      wbpKwh: 4.8,
      totalKwh: 17.5,
      peakWatts: 2980,
      savedRp: 18200,
      solarKwh: 12.9,
      status: 'Efisien',
      isPeakDay: false,
    },
    {
      day: 'Jumat',
      date: '02 Okt',
      lwbpKwh: 15.2,
      wbpKwh: 7.6,
      totalKwh: 22.8,
      peakWatts: 4120,
      savedRp: 24100,
      solarKwh: 17.1,
      status: 'Puncak Mingguan (Waspada)',
      isPeakDay: true,
    },
    {
      day: 'Sabtu',
      date: '03 Okt',
      lwbpKwh: 14.1,
      wbpKwh: 6.0,
      totalKwh: 20.1,
      peakWatts: 3480,
      savedRp: 22800,
      solarKwh: 16.0,
      status: 'Normal',
      isPeakDay: false,
    },
    {
      day: 'Minggu',
      date: 'Hari ini',
      lwbpKwh: todayLwbpKwh,
      wbpKwh: todayWbpKwh,
      totalKwh: todayTotalKwh,
      peakWatts: todayPeakWatts,
      savedRp: home.dailySavingsRp,
      solarKwh: solar.dailySolarYieldKwh,
      status: isOverloadNow ? 'Beban Lebih Aktif!' : 'Terkendali AI',
      isToday: true,
      isPeakDay: isOverloadNow,
    },
  ];

  const totalWeekSaved = consumptionData.reduce((acc, cur) => acc + cur.savedRp, 0);
  const totalWeekSolar = consumptionData.reduce((acc, cur) => acc + cur.solarKwh, 0);
  const totalWeekKwh = consumptionData.reduce((acc, cur) => acc + cur.totalKwh, 0);
  const avgDailyKwh = (totalWeekKwh / 7).toFixed(1);
  const highestPeakRecord = consumptionData.reduce((max, cur) => (cur.peakWatts > max.peakWatts ? cur : max), consumptionData[0]);

  const monthlyEst = home.dailySavingsRp * 30;
  const annualEst = home.dailySavingsRp * 365;
  const co2AvoidedKg = (totalWeekSolar * 0.785).toFixed(1); // 0.785 kg CO2 per kWh grid baseline
  const treesEquiv = Math.max(1, Math.round(Number(co2AvoidedKg) / 20));

  // Custom Tooltip for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-xl border border-slate-700 text-xs min-w-[210px] space-y-1.5 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-1.5">
            <span className="font-bold text-slate-200">
              {data.day} ({data.date})
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                data.peakWatts >= 3500
                  ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                  : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
              }`}
            >
              {data.status}
            </span>
          </div>

          <div className="space-y-1 text-[11px] pt-0.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span>
                Luar Beban Puncak (LWBP):
              </span>
              <span className="font-semibold text-slate-100">{data.lwbpKwh} kWh</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
                Beban Puncak (WBP 17-22):
              </span>
              <span className="font-semibold text-rose-300">{data.wbpKwh} kWh</span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-slate-200">
              <span className="font-bold">Total Konsumsi Harian:</span>
              <span className="font-extrabold text-amber-300">{data.totalKwh} kWh</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span>Tarikan Daya Puncak:</span>
              <span
                className={`font-bold ${
                  data.peakWatts >= 3500 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {data.peakWatts.toLocaleString('id-ID')} Watt
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[10px] pt-0.5">
              <span>Panen Mandiri Surya:</span>
              <span className="text-emerald-300 font-medium">{data.solarKwh} kWh</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
              <Coins className="w-3.5 h-3.5 text-amber-300" />
              <span>Efisiensi Finansial & Keberkahan Energi Berkelanjutan</span>
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              Dasbor Analitik Konsumsi Listrik & Penghematan
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5">
              Pemantauan komparatif konsumsi listrik 7 hari terakhir, deteksi tren beban puncak (WBP), serta optimasi biaya operasional harian.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/15 text-right">
              <span className="text-[10px] uppercase font-bold text-slate-300 block">
                Penghematan Hari Ini
              </span>
              <span className="text-2xl font-black text-amber-300">
                Rp {home.dailySavingsRp.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards: Daily, Monthly, Annual Savings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Hari Ini */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Biaya Nyata Hari Ini</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              -81% Lebih Murah
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-700">
              Rp {home.dailyCostRp.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-400 line-through">
              Rp {home.dailyCostWithoutSolarRp.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            Tanpa solar & AI: Rp {home.dailyCostWithoutSolarRp.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 2: Proyeksi Bulanan */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Estimasi Hemat 30 Hari</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
            Rp {monthlyEst.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-emerald-600 mt-2 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Mengurangi 75% tagihan bulanan PLN
          </p>
        </div>

        {/* Card 3: Proyeksi Tahunan */}
        <div className="bg-white rounded-2xl p-4.5 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold">Estimasi Hemat 1 Tahun</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-slate-800 mt-1 block">
            Rp {annualEst.toLocaleString('id-ID')}
          </span>
          <p className="text-[11px] text-slate-500 mt-2 font-medium">
            ROI Sistem Solar PV: ~3.8 Tahun
          </p>
        </div>

        {/* Card 4: Jejak Karbon & Pohon */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-4.5 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-1">
            <span className="text-xs font-bold">Dampak Ekologis (Hifz al-Bi'ah)</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-emerald-800">
              {co2AvoidedKg} <span className="text-sm">kg CO₂</span>
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-2 font-medium flex items-center gap-1">
            <TreeDeciduous className="w-3.5 h-3.5 text-emerald-600" />
            Setara menanam {treesEquiv} pohon rindang
          </p>
        </div>
      </div>

      {/* RECHARTS BAR CHART: 7-DAY ELECTRICITY CONSUMPTION & PEAK LOAD ANALYSIS */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs space-y-4">
        {/* Header Bar with View Mode Selectors */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                <BarChart3 className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                  Perbandingan Konsumsi Listrik Harian & Tren Beban Puncak (7 Hari)
                </h3>
                <p className="text-xs text-slate-500">
                  Visualisasi grafik batang interaktif untuk mengidentifikasi lonjakan beban puncak (Waktu Beban Puncak 17:00 - 22:00 WIB)
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-center">
            <button
              onClick={() => setChartViewMode('stacked_wbp')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartViewMode === 'stacked_wbp'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Komposisi Beban (WBP vs LWBP)
            </button>
            <button
              onClick={() => setChartViewMode('peak_demand')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartViewMode === 'peak_demand'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tarikan Daya Puncak (Watt)
            </button>
            <button
              onClick={() => setChartViewMode('total_kwh')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                chartViewMode === 'total_kwh'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Konsumsi (kWh)
            </button>
          </div>
        </div>

        {/* Quick Analytical Highlights Pill Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                Rata-rata Konsumsi Harian
              </span>
              <span className="text-base font-extrabold text-slate-800">{avgDailyKwh} kWh / hari</span>
            </div>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>

          <div className="bg-rose-50/70 p-3 rounded-xl border border-rose-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-rose-800 block font-bold uppercase tracking-wider">
                Lonjakan Puncak Tertinggi
              </span>
              <span className="text-base font-extrabold text-rose-700">
                {highestPeakRecord.day} ({highestPeakRecord.peakWatts.toLocaleString('id-ID')} W)
              </span>
            </div>
            <AlertTriangle className="w-5 h-5 text-rose-500" />
          </div>

          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-800 block font-bold uppercase tracking-wider">
                Mitigasi Beban AI
              </span>
              <span className="text-base font-extrabold text-emerald-700">Terkendali Mandiri</span>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Main Recharts Container */}
        <div className="pt-4 pb-2 w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartViewMode === 'stacked_wbp' ? (
              /* Stacked Bar Chart: LWBP (Off-Peak) + WBP (Peak) */
              <BarChart
                data={consumptionData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  unit=" kWh"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  domain={[0, 26]}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  dataKey="lwbpKwh"
                  name="Luar Waktu Beban Puncak (LWBP - Siang/Malam)"
                  stackId="a"
                  fill="#6366f1"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="wbpKwh"
                  name="Waktu Beban Puncak (WBP 17:00-22:00 WIB)"
                  stackId="a"
                  fill="#f43f5e"
                  radius={[6, 6, 0, 0]}
                >
                  {consumptionData.map((entry, index) => (
                    <Cell
                      key={`cell-wbp-${index}`}
                      fill={entry.isPeakDay ? '#e11d48' : '#f43f5e'}
                    />
                  ))}
                </Bar>
                <ReferenceLine
                  y={20}
                  stroke="#f59e0b"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Batas Peringatan 20 kWh',
                    fill: '#d97706',
                    fontSize: 10,
                    fontWeight: 600,
                    position: 'insideTopRight',
                  }}
                />
              </BarChart>
            ) : chartViewMode === 'peak_demand' ? (
              /* Bar Chart: Daily Peak Power Watts with Threshold Reference Lines */
              <BarChart
                data={consumptionData}
                margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  unit=" W"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  domain={[0, 5000]}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <ReferenceLine
                  y={3500}
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  label={{
                    value: 'Batas Peringatan Puncak: 3.500 W',
                    fill: '#d97706',
                    fontSize: 10,
                    fontWeight: 700,
                    position: 'insideTopLeft',
                  }}
                />
                <ReferenceLine
                  y={4400}
                  stroke="#ef4444"
                  strokeWidth={1.5}
                  strokeDasharray="2 2"
                  label={{
                    value: 'Kapasitas Kritis MCB PLN: 4.400 W',
                    fill: '#dc2626',
                    fontSize: 10,
                    fontWeight: 700,
                    position: 'insideTopLeft',
                  }}
                />
                <Bar
                  dataKey="peakWatts"
                  name="Tarikan Daya Puncak Tertinggi (Watt)"
                  radius={[6, 6, 0, 0]}
                >
                  {consumptionData.map((entry, index) => (
                    <Cell
                      key={`cell-peak-${index}`}
                      fill={
                        entry.peakWatts >= 4000
                          ? '#e11d48'
                          : entry.peakWatts >= 3500
                          ? '#f59e0b'
                          : '#059669'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              /* Bar Chart: Total Daily Consumption (kWh) */
              <BarChart
                data={consumptionData}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                />
                <YAxis
                  unit=" kWh"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  domain={[0, 26]}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
                />
                <Bar
                  dataKey="totalKwh"
                  name="Total Konsumsi Listrik Harian (kWh)"
                  fill="#059669"
                  radius={[6, 6, 0, 0]}
                >
                  {consumptionData.map((entry, index) => (
                    <Cell
                      key={`cell-total-${index}`}
                      fill={entry.isToday ? '#10b981' : '#059669'}
                    />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Footer Insight & Explanation */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />
            <span>
              <strong>Keterangan:</strong> Beban puncak (WBP) bertarif lebih tinggi dan memicu risiko trip sekering jika melampaui 3.500 W secara terus-menerus.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Terintegrasi Recharts Visual Engine
          </span>
        </div>
      </div>

      {/* 30-Day Daily Energy Efficiency Trend Line Chart (Lifestyle Long-term Impact) */}
      <MonthlyEfficiencyTrendChart currentDailySavingsRp={home.dailySavingsRp} />

      {/* Weekly Savings Bar Chart & Tariff Calculator */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Riwayat Penghematan Finansial 7 Hari Terakhir (Rupiah)
            </h3>
            <p className="text-xs text-slate-500">
              Total Penghematan Mingguan:{' '}
              <span className="font-bold text-emerald-700">
                Rp {totalWeekSaved.toLocaleString('id-ID')}
              </span>{' '}
              ({totalWeekSolar.toFixed(1)} kWh Panen Surya)
            </p>
          </div>

          {/* Tariff Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-semibold">Skema Tarif PLN:</span>
            <select
              value={selectedTariff}
              onChange={(e) => setSelectedTariff(Number(e.target.value))}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 focus:outline-emerald-600"
            >
              <option value={1444.7}>R-1/TR 1.300 - 2.200 VA (Rp 1.444,70/kWh)</option>
              <option value={1699.53}>R-2/TR 3.500 - 5.500 VA (Rp 1.699,53/kWh)</option>
              <option value={1444.7}>B-1 Bisnis Kecil (Rp 1.444,70/kWh)</option>
            </select>
          </div>
        </div>

        {/* 7-Day Savings Columns */}
        <div className="pt-6 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-44">
            {consumptionData.map((item, idx) => {
              const heightPercent = Math.min(100, Math.round((item.savedRp / 26000) * 100));
              return (
                <div key={idx} className="flex flex-col items-center h-full justify-end group">
                  <span className="text-[10px] font-bold text-emerald-700 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Rp {Math.round(item.savedRp / 1000)}rb
                  </span>
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 relative ${
                      item.isToday
                        ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-md ring-2 ring-emerald-500/30'
                        : 'bg-emerald-200 hover:bg-emerald-300'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {item.isToday && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-white"></span>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 mt-2">
                    {item.day}
                  </span>
                  <span className="text-[9px] text-slate-400">
                    {item.solarKwh.toFixed(1)} kWh
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
