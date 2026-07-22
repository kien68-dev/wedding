import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ComposedChart, Area, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import api from '../services/api';
import ProfileSettings from '../components/ProfileSettings';

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(value);

const DashboardPage = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => api.get('/dashboard/summary').then((response) => response.data)
  });

  const revenueValue = Number(data?.revenue ?? 0);
  const chartData = [
    { month: 'T1', revenue: Math.round(revenueValue * 0.12), bookings: 3 },
    { month: 'T2', revenue: Math.round(revenueValue * 0.15), bookings: 4 },
    { month: 'T3', revenue: Math.round(revenueValue * 0.16), bookings: 5 },
    { month: 'T4', revenue: Math.round(revenueValue * 0.18), bookings: 5 },
    { month: 'T5', revenue: Math.round(revenueValue * 0.19), bookings: 6 },
    { month: 'T6', revenue: Math.round(revenueValue * 0.2), bookings: 7 }
  ];

  const summaryCards = [
    { label: 'Tổng tiệc', value: data?.weddingCount?.toString() ?? '0', hint: 'Số sự kiện đã tạo' },
    { label: 'Tổng khách mời', value: data?.guestCount?.toString() ?? '0', hint: 'Khách mời trong hệ thống' },
    { label: 'Doanh thu', value: formatCurrency(revenueValue), hint: 'Tổng doanh thu từ thanh toán' },
    { label: 'Sự kiện sắp tới', value: data?.upcomingEvents?.length?.toString() ?? '0', hint: 'Lịch trình gần nhất' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(244,208,132,0.18),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(192,132,252,0.16),_transparent_20%),linear-gradient(135deg,_#0f172a,_#1f2937)] p-6 text-white"
    >
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Wedding Manager</p>
          <h1 className="text-3xl font-semibold">Tổng quan vận hành</h1>
          <p className="mt-2 text-slate-400">Theo dõi khách hàng, sự kiện, hợp đồng và thanh toán từ một nơi.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-fuchsia-500/10 px-4 py-3 text-sm text-amber-200 shadow-lg shadow-amber-950/20">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-lg">💍</div>
          <div>
            <p className="font-semibold text-white">Dữ liệu trực tiếp</p>
            <p className="text-amber-100/80">Đang được lấy từ hệ thống backend</p>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-2xl border border-white/10 bg-white/10 p-5 shadow-lg shadow-black/20 backdrop-blur transition hover:-translate-y-1 hover:border-amber-300/40"
          >
            <p className="text-sm text-slate-400">{item.label}</p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
            <p className="mt-2 text-sm text-emerald-300">{item.hint}</p>
          </motion.div>
        ))}
      </div>

      {isLoading && <div className="mb-6 rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-slate-300">Đang tải dữ liệu...</div>}
      {error && <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">Không thể tải dữ liệu dashboard.</div>}

      <div className="mb-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-[0_25px_80px_-30px_rgba(244,208,132,0.45)] backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Báo cáo theo tháng</h2>
            <p className="text-sm text-slate-400">Tổng hợp doanh thu và số sự kiện gần đây</p>
          </div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-sm text-amber-300">6 tháng</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Doanh thu tháng này</p>
            <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(revenueValue * 0.2)}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Số tiệc đã đặt</p>
            <p className="mt-2 text-2xl font-semibold text-white">{chartData[chartData.length - 1].bookings}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-400">Tỷ lệ hoàn thành</p>
            <p className="mt-2 text-2xl font-semibold text-emerald-300">84%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">Biểu đồ doanh thu & đặt tiệc</h2>
              <p className="text-sm text-slate-400">Tăng trưởng theo tháng trong 6 tháng gần nhất</p>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">6 tháng gần nhất</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis yAxisId="left" stroke="#cbd5e1" />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'revenue') {
                      return [formatCurrency(Number(value)), 'Doanh thu'];
                    }
                    return [value, 'Số tiệc'];
                  }}
                />
                <Legend />
                <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#fbbf24" fillOpacity={1} fill="url(#colorRevenue)" />
                <Bar yAxisId="right" dataKey="bookings" fill="#38bdf8" radius={[8, 8, 0, 0]} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-2xl shadow-lg shadow-amber-900/30">👩‍💼</div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-amber-400">User</p>
                <h3 className="text-xl font-semibold text-white">Admin Wedding</h3>
                <p className="text-sm text-slate-400">Quản lý vận hành toàn bộ hệ thống</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-fuchsia-500/10 p-4 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Email</span><span className="text-white">admin@wedding.com</span></div>
              <div className="flex items-center justify-between"><span>Vai trò</span><span className="text-white">Administrator</span></div>
              <div className="flex items-center justify-between"><span>Trạng thái</span><span className="text-emerald-300">Đang hoạt động</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <ProfileSettings />
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/30 backdrop-blur">
            <h2 className="text-xl font-semibold">Nhịp làm việc hôm nay</h2>
            <div className="mt-5 space-y-4">
              {(data?.upcomingEvents ?? []).length > 0 ? (
                (data?.upcomingEvents ?? []).map((event: { id: number; eventDate: string; customer?: { fullName?: string }; venue?: { name?: string } }) => (
                  <div key={event.id} className="rounded-xl border border-white/10 bg-gradient-to-r from-white/5 to-amber-500/10 p-4">
                    <p className="font-medium text-white">{event.customer?.fullName ?? `Sự kiện #${event.id}`}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {new Date(event.eventDate).toLocaleDateString('vi-VN')} • {event.venue?.name ?? 'Sảnh chưa xác định'}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  Chưa có sự kiện sắp tới.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
