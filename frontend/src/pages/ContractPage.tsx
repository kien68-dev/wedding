import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';

interface Contract {
  id: number;
  customerId: number;
  totalValue: number;
  depositAmount: number;
  status: string;
  pdfUrl?: string;
  customer?: { fullName: string };
}

interface Customer {
  id: number;
  fullName: string;
}

export default function ContractPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Contract>>({ status: 'PENDING' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const { data: contracts = [] } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => api.get('/contracts').then((r) => r.data)
  });

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then((r) => r.data)
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 2200);
  };

  const createMutation = useMutation({
    mutationFn: (data: Partial<Contract>) => api.post('/contracts', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setFormData({ status: 'PENDING' });
      setShowForm(false);
      showToast('Tạo hợp đồng thành công', 'success');
    },
    onError: () => showToast('Không thể tạo hợp đồng', 'error')
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Contract>) => api.put(`/contracts/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      setFormData({ status: 'PENDING' });
      setShowForm(false);
      setEditingId(null);
      showToast('Cập nhật hợp đồng thành công', 'success');
    },
    onError: () => showToast('Không thể cập nhật hợp đồng', 'error')
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/contracts/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      showToast('Xóa hợp đồng thành công', 'success');
    },
    onError: () => showToast('Không thể xóa hợp đồng', 'error')
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.totalValue) {
      showToast('Vui lòng chọn khách hàng và nhập tổng giá trị', 'error');
      return;
    }

    if (Number(formData.totalValue) <= 0) {
      showToast('Tổng giá trị phải lớn hơn 0', 'error');
      return;
    }

    if (formData.depositAmount !== undefined && Number(formData.depositAmount) < 0) {
      showToast('Tiền cọc không được âm', 'error');
      return;
    }

    if (editingId) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (contract: Contract) => {
    setFormData(contract);
    setEditingId(contract.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-amber-400">Contracts</p>
            <h1 className="text-4xl font-bold text-white">Quản lý Hợp đồng</h1>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({ status: 'PENDING' });
              setShowForm(!showForm);
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Tạo hợp đồng'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <select
                value={formData.customerId || ''}
                onChange={(e) => setFormData({ ...formData, customerId: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="">Chọn khách hàng</option>
                {(customers as Customer[]).map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.fullName}</option>
                ))}
              </select>
              <select
                value={formData.status || 'PENDING'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              >
                <option value="PENDING">Đang chờ</option>
                <option value="SIGNED">Đã ký</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>
              <input
                type="number"
                placeholder="Tổng giá trị"
                value={formData.totalValue ?? ''}
                onChange={(e) => setFormData({ ...formData, totalValue: Number(e.target.value) })}
                required
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="number"
                placeholder="Tiền cọc"
                value={formData.depositAmount ?? ''}
                onChange={(e) => setFormData({ ...formData, depositAmount: Number(e.target.value) })}
                className="rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
              <input
                type="text"
                placeholder="Link PDF"
                value={formData.pdfUrl || ''}
                onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                className="col-span-2 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              />
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
          {(contracts as Contract[]).map((contract) => (
            <div key={contract.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-400/40">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{contract.customer?.fullName || 'Khách hàng chưa rõ'}</h3>
                  <p className="mt-1 text-slate-300">💰 Tổng: {contract.totalValue.toLocaleString('vi-VN')}₫</p>
                  <p className="text-slate-300">🪙 Cọc: {contract.depositAmount.toLocaleString('vi-VN')}₫</p>
                  {contract.pdfUrl && <p className="mt-2 text-amber-300 underline">📄 {contract.pdfUrl}</p>}
                  <p className={`mt-2 text-sm font-medium ${contract.status === 'SIGNED' ? 'text-emerald-300' : contract.status === 'CANCELLED' ? 'text-red-300' : 'text-amber-300'}`}>
                    {contract.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(contract)} className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400">Sửa</button>
                  <button onClick={() => deleteMutation.mutate(contract.id)} className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500">Xóa</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
