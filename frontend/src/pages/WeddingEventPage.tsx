import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';

interface WeddingEvent {
  id: number;
  eventDate: string;
  eventTime: string;
  venueId: number;
  customerId: number;
  menuId?: number;
  serviceId?: number;
  status: string;
  totalAmount: number;
  depositAmount?: number;
  venue?: { name: string };
  customer?: { fullName: string };
  menu?: { appetizer: string };
  service?: { name: string };
}

interface Venue { id: number; name: string }
interface Customer { id: number; fullName: string }
interface Menu { id: number; appetizer: string }
interface Service { id: number; name: string }

export default function WeddingEventPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<WeddingEvent>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: events = [] } = useQuery({
    queryKey: ['wedding-events'],
    queryFn: () => api.get('/wedding-events').then((r) => r.data)
  });

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => api.get('/venues').then((r) => r.data)
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then((r) => r.data)
  });

  const { data: menus = [] } = useQuery({
    queryKey: ['menus'],
    queryFn: () => api.get('/menus').then((r) => r.data)
  });

  const { data: services = [] } = useQuery({
    queryKey: ['services'],
    queryFn: () => api.get('/services').then((r) => r.data)
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2200);
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<WeddingEvent>) => api.post('/wedding-events', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding-events'] });
      setFormData({});
      setShowForm(false);
      showToast('Tạo sự kiện thành công', 'success');
    },
    onError: () => showToast('Không thể tạo sự kiện', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<WeddingEvent>) => api.put(`/wedding-events/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding-events'] });
      setFormData({});
      setShowForm(false);
      setEditingId(null);
      showToast('Cập nhật sự kiện thành công', 'success');
    },
    onError: () => showToast('Không thể cập nhật sự kiện', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/wedding-events/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wedding-events'] });
      showToast('Xóa sự kiện thành công', 'success');
    },
    onError: () => showToast('Không thể xóa sự kiện', 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.venueId || !formData.customerId || !formData.eventDate || !formData.eventTime || !formData.totalAmount) {
      showToast('Vui lòng nhập đầy đủ thông tin sự kiện', 'error');
      return;
    }

    if (Number(formData.totalAmount) <= 0) {
      showToast('Tổng tiền phải lớn hơn 0', 'error');
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (event: WeddingEvent) => {
    const eventDate = new Date(event.eventDate).toISOString().slice(0, 16);
    setFormData({ ...event, eventDate });
    setEditingId(event.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Events</p>
            <h1 className="text-4xl font-bold text-white">Quản lý Sự kiện Cưới</h1>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({});
              setShowForm(!showForm);
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Tạo Sự kiện'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="mb-4 text-2xl font-semibold">{editingId ? 'Chỉnh sửa Sự kiện' : 'Tạo Sự kiện Mới'}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="datetime-local"
                value={formData.eventDate || ''}
                onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="time"
                value={formData.eventTime || ''}
                onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <select
                value={formData.venueId || ''}
                onChange={(e) => setFormData({ ...formData, venueId: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn Sảnh</option>
                {(venues as Venue[]).map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
              <select
                value={formData.customerId || ''}
                onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn Khách hàng</option>
                {(customers as Customer[]).map((c) => (
                  <option key={c.id} value={c.id}>{c.fullName}</option>
                ))}
              </select>
              <select
                value={formData.menuId || ''}
                onChange={(e) => setFormData({ ...formData, menuId: Number(e.target.value) || undefined })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn Thực đơn</option>
                {(menus as Menu[]).map((m) => (
                  <option key={m.id} value={m.id}>{m.appetizer}</option>
                ))}
              </select>
              <select
                value={formData.serviceId || ''}
                onChange={(e) => setFormData({ ...formData, serviceId: Number(e.target.value) || undefined })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn Dịch vụ</option>
                {(services as Service[]).map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Tổng tiền"
                value={formData.totalAmount || ''}
                onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Tiền cọc"
                value={formData.depositAmount || ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
            </div>
            <div className="mt-4 flex gap-4">
              <button type="submit" className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-400">
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({}); }} className="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition hover:bg-slate-600">
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {(events as WeddingEvent[]).map((event) => (
            <div key={event.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-400/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {event.customer?.fullName} - {event.venue?.name}
                  </h3>
                  <p className="mt-1 text-slate-300">📅 {new Date(event.eventDate).toLocaleDateString('vi-VN')} - {event.eventTime}</p>
                  {event.menu && <p className="text-slate-300">🍽️ {event.menu.appetizer}</p>}
                  {event.service && <p className="text-slate-300">🎤 {event.service.name}</p>}
                  <p className="mt-2 font-semibold text-emerald-300">Tổng: {event.totalAmount.toLocaleString('vi-VN')}₫</p>
                  <p className={`mt-2 text-sm font-medium ${event.status === 'CONFIRMED' ? 'text-emerald-300' : event.status === 'PENDING' ? 'text-amber-300' : 'text-red-300'}`}>
                    {event.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(event)} className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(event.id)} className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
