import React, { useState } from 'react';
import {
  TrendingUp,
  Leaf,
  Calendar,
  Sparkles,
  CheckCircle2,
  Award,
  Activity,
  Zap,
  Clock,
  Coins,
  Info,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';

interface MonthlyEfficiencyTrendChartProps {
  currentDailySavingsRp?: number;
}

export const MonthlyEfficiencyTrendChart: React.FC<MonthlyEfficiencyTrendChartProps> = ({
  currentDailySavingsRp = 21600,
}) => {
  const [activeMetric, setActiveMetric] = useState<'all' | 'efficiency' | 'savings'>('all');

  // Realistic 30-day lifestyle change and energy efficiency history
  // Demonstrating gradual rise from conventional habits (~66%) to high Islamic eco-stewardship (~94%)
  const rawHistoryData = [
    { day: 1, date: '06 Okt', score: 66, selfSufficiency: 52, savingsRp: 12500, note: 'Pola konvensional awal' },
    { day: 2, date: '07 Okt', score: 68, selfSufficiency: 54, savingsRp: 13200, note: 'Mulai pemantauan UPIC' },
    { day: 3, date: '08 Okt', score: 67, selfSufficiency: 53, savingsRp: 13000, note: 'AC masih di suhu 20°C' },
    { day: 4, date: '09 Okt', score: 71, selfSufficiency: 58, savingsRp: 14500, note: 'Audit beban malam hari' },
    { day: 5, date: '10 Okt', score: 74, selfSufficiency: 61, savingsRp: 15200, note: '🌱 Mileston 1: Setpoint AC 25°C Eco diterapkan' },
    { day: 6, date: '11 Okt', score: 75, selfSufficiency: 63, savingsRp: 15800, note: 'Penerangan LED otomatis musholla aktif' },
    { day: 7, date: '12 Okt', score: 73, selfSufficiency: 60, savingsRp: 15000, note: 'Akhir pekan, beban kulkas terkendali' },
    { day: 8, date: '13 Okt', score: 76, selfSufficiency: 65, savingsRp: 16400, note: 'Steker siaga dapur mulai dicabut berkala' },
    { day: 9, date: '14 Okt', score: 78, selfSufficiency: 67, savingsRp: 17100, note: 'Keluarga mulai terbiasa adab anti-israf' },
    { day: 10, date: '15 Okt', score: 79, selfSufficiency: 69, savingsRp: 17600, note: 'Evaluasi mingguan pertama' },
    { day: 11, date: '16 Okt', score: 81, selfSufficiency: 71, savingsRp: 18200, note: 'Beban pompa air digeser ke siang' },
    { day: 12, date: '17 Okt', score: 83, selfSufficiency: 75, savingsRp: 19100, note: '⚡ Milestone 2: AI Shifting Pemanas Air ke Jam Surya' },
    { day: 13, date: '18 Okt', score: 82, selfSufficiency: 73, savingsRp: 18800, note: 'Cuaca agak mendung, baterai ESS menutup defisit' },
    { day: 14, date: '19 Okt', score: 84, selfSufficiency: 76, savingsRp: 19400, note: 'Swasembada siang hari menembus 80%' },
    { day: 15, date: '20 Okt', score: 85, selfSufficiency: 77, savingsRp: 19800, note: 'Separuh bulan: Hemat Rp 245.000' },
    { day: 16, date: '21 Okt', score: 84, selfSufficiency: 76, savingsRp: 19500, note: 'Stabilitas beban harian tercapai' },
    { day: 17, date: '22 Okt', score: 86, selfSufficiency: 79, savingsRp: 20200, note: 'Proteksi vampire drain terpasang penuh' },
    { day: 18, date: '23 Okt', score: 87, selfSufficiency: 80, savingsRp: 20600, note: 'Hari Jumat berkah: Shalat & doa kebersihan bumi' },
    { day: 19, date: '24 Okt', score: 88, selfSufficiency: 82, savingsRp: 21000, note: 'Efisiensi inverter mencapai 97.6%' },
    { day: 20, date: '25 Okt', score: 90, selfSufficiency: 85, savingsRp: 21900, note: '🚗 Milestone 3: Pengisian EV 100% Surya Siang Hari' },
    { day: 21, date: '26 Okt', score: 89, selfSufficiency: 83, savingsRp: 21500, note: 'Nir-polusi: Tanpa impor PLN di siang terik' },
    { day: 22, date: '27 Okt', score: 91, selfSufficiency: 86, savingsRp: 22200, note: 'Penghematan menembus target harian Rp 22rb' },
    { day: 23, date: '28 Okt', score: 90, selfSufficiency: 85, savingsRp: 22000, note: 'Konsistensi seluruh anggota keluarga' },
    { day: 24, date: '29 Okt', score: 92, selfSufficiency: 87, savingsRp: 22600, note: 'Siklus baterai ESS terjaga di suhu dingin' },
    { day: 25, date: '30 Okt', score: 91, selfSufficiency: 86, savingsRp: 22400, note: 'Cadangan darurat 30% selalu terkunci rapi' },
    { day: 26, date: '31 Okt', score: 93, selfSufficiency: 88, savingsRp: 23100, note: 'Target bulanan Rp 650rb resmi terlampaui' },
    { day: 27, date: '01 Nov', score: 92, selfSufficiency: 87, savingsRp: 22800, note: 'Awal bulan baru dengan kebiasaan istiqomah' },
    { day: 28, date: '02 Nov', score: 94, selfSufficiency: 89, savingsRp: 23500, note: '🛡️ Milestone 4: Enkripsi Telemetri & Zero Israf' },
    { day: 29, date: '03 Nov', score: 93, selfSufficiency: 88, savingsRp: 23200, note: 'Mitigasi beban puncak 100% mandiri baterai' },
    { day: 30, date: '04 Nov', score: 94, selfSufficiency: 90, savingsRp: currentDailySavingsRp, note: 'Puncak Gaya Hidup Lestari Islami (Hari Ini)' },
  ];

  // Aggregated 30-day stats
  const initialScore = rawHistoryData[0].score;
  const latestScore = rawHistoryData[rawHistoryData.length - 1].score;
  const scoreImprovementPct = (((latestScore - initialScore) / initialScore) * 100).toFixed(1);
  const total30DaySavingsRp = rawHistoryData.reduce((acc, cur) => acc + cur.savingsRp, 0);
  const avgEfficiency = (rawHistoryData.reduce((acc, cur) => acc + cur.score, 0) / rawHistoryData.length).toFixed(1);
  const totalCo2SavedKg = Math.round(total30DaySavingsRp * 0.0031); // Estimated kg CO2 avoided

  // Custom Interactive Tooltip
  const CustomTrendTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-xl shadow-2xl border border-slate-700 text-xs min-w-[230px] space-y-1.5 animate-in fade-in-50">
          <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              {data.date} (Hari ke-{data.day})
            </span>
            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Skor {data.score}%
            </span>
          </div>

          <div className="space-y-1 text-[11px] pt-0.5">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                Efisiensi Gaya Hidup:
              </span>
              <span className="font-extrabold text-emerald-300">{data.score}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-400"></span>
                Swasembada Tenaga Surya:
              </span>
              <span className="font-semibold text-teal-300">{data.selfSufficiency}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                Penghematan Hari Tersebut:
              </span>
              <span className="font-bold text-amber-300">Rp {data.savingsRp.toLocaleString('id-ID')}</span>
            </div>

            <div className="mt-1 pt-1.5 border-t border-slate-800 text-[10px] text-slate-300 italic bg-white/5 p-1.5 rounded-lg">
              <span className="font-semibold text-emerald-300 not-italic block mb-0.5">Catatan Perubahan:</span>
              "{data.note}"
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 lg:p-6 shadow-xs space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shadow-md shadow-emerald-700/20">
            <TrendingUp className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                Tren Efisiensi Energi Harian 30 Hari Terakhir
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Dampak Gaya Hidup Jangka Panjang
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Grafik garis komparatif memperlihatkan bagaimana adab hemat energi, optimasi jam surya, dan pencegahan israf meningkatkan penghematan bulanan secara berkelanjutan.
            </p>
          </div>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start md:self-center">
          <button
            onClick={() => setActiveMetric('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeMetric === 'all'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Multi-Tren (Efisiensi & Swasembada)
          </button>
          <button
            onClick={() => setActiveMetric('efficiency')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeMetric === 'efficiency'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Skor Efisiensi (%)
          </button>
          <button
            onClick={() => setActiveMetric('savings')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeMetric === 'savings'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penghematan Rupiah (Rp)
          </button>
        </div>
      </div>

      {/* KPI Highlights: Long-term Transformation Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/70 p-3.5 rounded-xl border border-emerald-200/90">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
            Peningkatan Efisiensi Gaya Hidup
          </span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl sm:text-2xl font-black text-emerald-700">
              +{scoreImprovementPct}%
            </span>
            <span className="text-xs text-emerald-600 font-semibold">(66% → {latestScore}%)</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <Award className="w-3 h-3 text-amber-500" /> Transformasi Konsisten
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Rata-rata Skor 30 Hari
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800 mt-0.5 block">
            {avgEfficiency}%
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Kategori: Istiqomah & Hemat
          </span>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50/60 p-3.5 rounded-xl border border-amber-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
            Akumulasi Hemat 30 Hari
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-700 mt-0.5 block">
            Rp {total30DaySavingsRp.toLocaleString('id-ID')}
          </span>
          <span className="text-[11px] text-amber-800 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Melampaui Target Bulanan
          </span>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Pengurangan Emisi Karbon
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-800 mt-0.5 block">
            ~{totalCo2SavedKg} kg CO₂
          </span>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <Leaf className="w-3 h-3 text-emerald-600" /> Amanah Hifz al-Bi'ah
          </span>
        </div>
      </div>

      {/* Main 30-Day Line Chart Container */}
      <div className="pt-3 pb-1 w-full h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rawHistoryData}
            margin={{ top: 20, right: 25, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="efficiencyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
              interval={4}
            />

            {/* Left YAxis: Percentage (0 - 100%) */}
            {activeMetric !== 'savings' && (
              <YAxis
                yAxisId="pct"
                unit="%"
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                domain={[45, 100]}
              />
            )}

            {/* Right YAxis: Rupiah */}
            {(activeMetric === 'savings' || activeMetric === 'all') && (
              <YAxis
                yAxisId="rp"
                orientation={activeMetric === 'savings' ? 'left' : 'right'}
                tickLine={false}
                axisLine={false}
                tick={{ fill: '#d97706', fontSize: 10 }}
                tickFormatter={(val) => `Rp ${(val / 1000).toFixed(0)}k`}
                domain={[8000, 26000]}
              />
            )}

            <Tooltip content={<CustomTrendTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontWeight: 600 }}
            />

            {/* Reference target line 90% */}
            {activeMetric !== 'savings' && (
              <ReferenceLine
                yAxisId="pct"
                y={90}
                stroke="#10b981"
                strokeDasharray="4 4"
                label={{
                  value: 'Ambang Istiqomah: 90%',
                  fill: '#059669',
                  fontSize: 10,
                  fontWeight: 700,
                  position: 'insideTopLeft',
                }}
              />
            )}

            {/* Area shading for efficiency */}
            {activeMetric !== 'savings' && (
              <Area
                yAxisId="pct"
                type="monotone"
                dataKey="score"
                fill="url(#efficiencyAreaGrad)"
                stroke="none"
              />
            )}

            {/* Primary Line: Skor Efisiensi Energi */}
            {activeMetric !== 'savings' && (
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="score"
                name="Skor Efisiensi Energi (%)"
                stroke="#059669"
                strokeWidth={3}
                dot={{ r: 2.5, fill: '#059669', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#059669', stroke: '#fff', strokeWidth: 2 }}
              />
            )}

            {/* Secondary Line: Swasembada Tenaga Surya */}
            {activeMetric === 'all' && (
              <Line
                yAxisId="pct"
                type="monotone"
                dataKey="selfSufficiency"
                name="Swasembada Tenaga Surya (%)"
                stroke="#0d9488"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 2, fill: '#0d9488' }}
              />
            )}

            {/* Tertiary Line: Penghematan Harian Rupiah */}
            {(activeMetric === 'savings' || activeMetric === 'all') && (
              <Line
                yAxisId="rp"
                type="monotone"
                dataKey="savingsRp"
                name="Penghematan Harian (Rp)"
                stroke="#f59e0b"
                strokeWidth={activeMetric === 'savings' ? 3 : 2}
                dot={{ r: 2.5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: '#f59e0b', stroke: '#fff', strokeWidth: 2 }}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Key Lifestyle Transformation Milestones Journey */}
      <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-2.5">
          <Compass className="w-3.5 h-3.5 text-emerald-600" />
          <span>Milestone Perubahan Gaya Hidup yang Berdampak Signifikan (Jangka Panjang):</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px]">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-extrabold text-emerald-700 block">Hari ke-5 (10 Okt)</span>
            <span className="font-bold text-slate-800 block">Suhu AC 25°C Eco Mode</span>
            <span className="text-slate-500 text-[10px]">Mengurangi 18% tarikan kompresor pendingin.</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-extrabold text-teal-700 block">Hari ke-12 (17 Okt)</span>
            <span className="font-bold text-slate-800 block">AI Solar Shifting Water Heater</span>
            <span className="text-slate-500 text-[10px]">Memanaskan air saat puncak radiasi jam 11:00.</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-extrabold text-amber-700 block">Hari ke-20 (25 Okt)</span>
            <span className="font-bold text-slate-800 block">Jadwal Pengisian EV 100% Surya</span>
            <span className="text-slate-500 text-[10px]">Baterai mobil terisi gratis tanpa lonjakan WBP PLN.</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-2xs">
            <span className="text-[10px] font-extrabold text-indigo-700 block">Hari ke-28 (02 Nov)</span>
            <span className="font-bold text-slate-800 block">Eliminasi Beban Vampir Siaga</span>
            <span className="text-slate-500 text-[10px]">Keluarga mematikan steker siaga otomatis malam hari.</span>
          </div>
        </div>
      </div>

      {/* Footer Insight */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>
            <strong>Kesimpulan Jangka Panjang:</strong> Disiplin gaya hidup hemat (anti-israf) meningkatkan rata-rata penghematan harian dari Rp 12.500 menjadi Rp 23.500/hari (+88% laba efisiensi bulanan).
          </span>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex-shrink-0">
          Analisis 30 Hari Lengkap
        </span>
      </div>
    </div>
  );
};
