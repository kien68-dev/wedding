import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';

interface Payment {
  id: number;
  eventId: number;
  amount: number;
  type: string;
  status: string;
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

export default function PaymentPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Payment>>({ status: 'PENDING', type: 'DEPOSIT' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: payments = [] } = useQuery({
    queryKey: ['payments'],
    queryFn: () => api.get('/payments').then((r) => r.data)
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
    mutationFn: (data: Partial<Payment>) => api.post('/payments', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setFormData({ status: 'PENDING', type: 'DEPOSIT' });
      setShowForm(false);
      showToast('Tạo giao dịch thanh toán thành công', 'success');
    },
    onError: () => showToast('Không thể tạo giao dịch', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Payment>) => api.put(`/payments/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setFormData({ status: 'PENDING', type: 'DEPOSIT' });
      setShowForm(false);
      setEditingId(null);
      showToast('Cập nhật giao dịch thành công', 'success');
    },
    onError: () => showToast('Không thể cập nhật giao dịch', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/payments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      showToast('Xóa giao dịch thành công', 'success');
    },
    onError: () => showToast('Không thể xóa giao dịch', 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.eventId || !formData.amount) {
      showToast('Vui lòng chọn sự kiện và nhập số tiền', 'error');
      return;
    }

    if (Number(formData.amount) <= 0) {
      showToast('Số tiền phải lớn hơn 0', 'error');
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (payment: Payment) => {
    setFormData(payment);
    setEditingId(payment.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Payments</p>
            <h1 className="text-4xl font-bold text-white">Quản lý Thanh toán</h1>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ status: 'PENDING', type: 'DEPOSIT' });
              setShowForm(!showForm);
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Thêm thanh toán'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={formData.eventId || ''}
                onChange={(e) => setFormData({ ...formData, eventId: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn sự kiện</option>
                {(events as WeddingEvent[]).map((event) => (
                  <option key={event.id} value={event.id}>{event.customer?.fullName || `Sự kiện #${event.id}`}</option>
                ))}
              </select>
              <select
                value={formData.type || 'DEPOSIT'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="DEPOSIT">Cọc</option>
                <option value="FINAL">Thanh toán cuối</option>
                <option value="REFUND">Hoàn tiền</option>
              </select>
              <input
                type="number"
                placeholder="Số tiền"
                value={formData.amount ?? ''}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <select
                value={formData.status || 'PENDING'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="PENDING">Đang chờ</option>
                <option value="PAID">Đã thanh toán</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
            </div>
            <div className="mt-4 flex gap-4">
              <button type="submit" className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-400">
                {editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ status: 'PENDING', type: 'DEPOSIT' }); }} className="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition hover:bg-slate-600">
                Hủy
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {(payments as Payment[]).map((payment) => (
            <div key={payment.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-400/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{payment.weddingEvent?.customer?.fullName || `Sự kiện #${payment.eventId}`}</h3>
                  <p className="mt-1 text-slate-300">💳 Loại: {payment.type}</p>
                  <p className="text-slate-300">💵 Số tiền: {payment.amount.toLocaleString('vi-VN')}₫</p>
                  <p className={`mt-2 text-sm font-medium ${payment.status === 'PAID' ? 'text-emerald-300' : payment.status === 'CANCELLED' ? 'text-red-300' : 'text-amber-300'}`}>
                    {payment.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(payment)} className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(payment.id)} className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
