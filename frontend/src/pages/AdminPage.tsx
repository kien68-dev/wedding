import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';

type Venue = { id: number; name: string; capacity: number; price: number; status: string };

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', capacity: '', price: '', status: 'AVAILABLE' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: venues = [] } = useQuery({
    queryKey: ['venues'],
    queryFn: () => api.get('/venues').then((res) => res.data)
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2200);
  };

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Venue, 'id'>) => api.post('/venues', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      resetForm();
      showToast('Thêm sảnh cưới thành công', 'success');
    },
    onError: () => showToast('Không thể thêm sảnh cưới', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Omit<Venue, 'id'> }) => api.put(`/venues/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      resetForm();
      showToast('Cập nhật sảnh cưới thành công', 'success');
    },
    onError: () => showToast('Không thể cập nhật sảnh cưới', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/venues/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues'] });
      showToast('Xóa sảnh cưới thành công', 'success');
    },
    onError: () => showToast('Không thể xóa sảnh cưới', 'error')
  });

  const resetForm = () => {
    setEditingId(null);
    setForm({ name: '', capacity: '', price: '', status: 'AVAILABLE' });
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: form.name.trim(),
      capacity: Number(form.capacity),
      price: Number(form.price),
      status: form.status
    };

    if (!payload.name) {
      showToast('Vui lòng nhập tên sảnh', 'error');
      return;
    }

    if (!Number.isFinite(payload.capacity) || payload.capacity <= 0) {
      showToast('Sức chứa phải là số lớn hơn 0', 'error');
      return;
    }

    if (!Number.isFinite(payload.price) || payload.price <= 0) {
      showToast('Giá sảnh phải là số lớn hơn 0', 'error');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (venue: Venue) => {
    setEditingId(venue.id);
    setForm({
      name: venue.name,
      capacity: String(venue.capacity),
      price: String(venue.price),
      status: venue.status
    });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Admin</p>
            <h1 className="text-4xl font-bold text-white">Quản lý sảnh cưới</h1>
          </div>
          <button
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setShowForm(true);
              }
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Thêm sảnh'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
                placeholder="Tên sảnh"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
                placeholder="Sức chứa"
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              />
              <input
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
                placeholder="Giá"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
              <select
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="AVAILABLE">Có sẵn</option>
                <option value="BOOKED">Đã đặt</option>
              </select>
            </div>
            <div className="mt-4 flex gap-3">
              <button className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-400" type="submit">
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button type="button" onClick={resetForm} className="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition hover:bg-slate-600">
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {(venues as Venue[]).map((venue) => (
            <div key={venue.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{venue.name}</h2>
                  <p className="mt-2 text-slate-300">Sức chứa: {venue.capacity} khách</p>
                  <p className="text-slate-300">Giá: {venue.price.toLocaleString('vi-VN')}₫</p>
                  <p className="mt-2 text-sm font-medium text-amber-300">Trạng thái: {venue.status}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(venue)} className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(venue.id)} className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
