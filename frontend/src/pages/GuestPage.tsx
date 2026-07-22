import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';

interface Guest {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  tableNumber?: number;
  status: string;
  weddingEventId?: number;
  weddingEvent?: {
    id: number;
    customer?: { fullName: string };
    venue?: { name: string };
  };
}

interface WeddingEvent {
  id: number;
  customer?: { fullName: string };
  venue?: { name: string };
}

export default function GuestPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Guest>>({ status: 'PENDING' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: guests = [] } = useQuery({
    queryKey: ['guests'],
    queryFn: () => api.get('/guests').then((r) => r.data)
  });

  const { data: events = [] } = useQuery({
    queryKey: ['wedding-events'],
    queryFn: () => api.get('/wedding-events').then((r) => r.data)
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2200);
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<Guest>) => api.post('/guests', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setFormData({ status: 'PENDING' });
      setShowForm(false);
      showToast('Thêm khách mời thành công', 'success');
    },
    onError: () => showToast('Không thể thêm khách mời', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Guest>) => api.put(`/guests/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      setFormData({ status: 'PENDING' });
      setShowForm(false);
      setEditingId(null);
      showToast('Cập nhật khách mời thành công', 'success');
    },
    onError: () => showToast('Không thể cập nhật khách mời', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/guests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests'] });
      showToast('Xóa khách mời thành công', 'success');
    },
    onError: () => showToast('Không thể xóa khách mời', 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name?.trim();
    if (!name) {
      showToast('Vui lòng nhập tên khách mời', 'error');
      return;
    }

    if (formData.phone && formData.phone.replace(/\D/g, '').length < 9) {
      showToast('Số điện thoại không hợp lệ', 'error');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ ...formData, name });
    } else {
      createMutation.mutate({ ...formData, name });
    }
  };

  const handleEdit = (guest: Guest) => {
    setFormData(guest);
    setEditingId(guest.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Guests</p>
            <h1 className="text-4xl font-bold text-white">Quản lý Danh sách Khách mời</h1>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ status: 'PENDING' });
              setShowForm(!showForm);
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Thêm Khách mời'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                placeholder="Tên khách mời"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="tel"
                placeholder="Số điện thoại"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Số bàn"
                value={formData.tableNumber ?? ''}
                onChange={(e) => setFormData({ ...formData, tableNumber: Number(e.target.value) || undefined })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <select
                value={formData.weddingEventId || ''}
                onChange={(e) => setFormData({ ...formData, weddingEventId: Number(e.target.value) || undefined })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn sự kiện</option>
                {(events as WeddingEvent[]).map((event) => (
                  <option key={event.id} value={event.id}>{event.customer?.fullName || `Sự kiện #${event.id}`}</option>
                ))}
              </select>
              <select
                value={formData.status || 'PENDING'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="PENDING">Đang chờ</option>
                <option value="CONFIRMED">Đã xác nhận</option>
                <option value="CANCELLED">Hủy</option>
              </select>
            </div>
            <div className="mt-4 flex gap-4">
              <button type="submit" className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-400">
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ status: 'PENDING' }); }} className="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition hover:bg-slate-600">
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {(guests as Guest[]).map((guest) => (
            <div key={guest.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-400/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{guest.name}</h3>
                  {guest.phone && <p className="mt-1 text-slate-300">📱 {guest.phone}</p>}
                  {guest.email && <p className="text-slate-300">✉️ {guest.email}</p>}
                  {guest.tableNumber && <p className="text-slate-300">🪑 Bàn {guest.tableNumber}</p>}
                  <p className="text-slate-300">💒 {guest.weddingEvent?.customer?.fullName || 'Chưa gán sự kiện'}</p>
                  <p className={`mt-2 text-sm font-medium ${guest.status === 'CONFIRMED' ? 'text-emerald-300' : guest.status === 'CANCELLED' ? 'text-red-300' : 'text-amber-300'}`}>
                    {guest.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(guest)} className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(guest.id)} className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
