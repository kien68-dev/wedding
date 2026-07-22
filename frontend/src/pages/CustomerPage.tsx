import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import Toast from '../components/Toast';
import UserProfileCard from '../components/UserProfileCard';

interface Customer {
  id: number;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
}

export default function CustomerPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'phone'>('name');

  const { data: customers = [] } = useQuery({
    queryKey: ['customers'],
    queryFn: () => api.get('/customers').then(r => r.data)
  });

  const createMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => api.post('/customers', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setFormData({});
      setShowForm(false);
      setToast({ message: 'Tạo khách hàng thành công', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    },
    onError: () => {
      setToast({ message: 'Tạo khách hàng thất bại', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Customer>) => 
      api.put(`/customers/${editingId}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setFormData({});
      setEditingId(null);
      setShowForm(false);
      setToast({ message: 'Cập nhật khách hàng thành công', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    },
    onError: () => {
      setToast({ message: 'Cập nhật khách hàng thất bại', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setToast({ message: 'Xóa khách hàng thành công', type: 'success' });
      setTimeout(() => setToast(null), 2000);
    },
    onError: () => {
      setToast({ message: 'Xóa khách hàng thất bại', type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = formData.fullName?.trim();
    const trimmedPhone = formData.phone?.trim();

    if (!trimmedName || !trimmedPhone) {
      setToast({ message: 'Vui lòng nhập họ tên và số điện thoại', type: 'error' });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (trimmedPhone.length < 9) {
      setToast({ message: 'Số điện thoại phải có ít nhất 9 chữ số', type: 'error' });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    if (editingId) {
      updateMutation.mutate({ ...formData, fullName: trimmedName, phone: trimmedPhone });
    } else {
      createMutation.mutate({ ...formData, fullName: trimmedName, phone: trimmedPhone });
    }
  };

  const handleEdit = (customer: Customer) => {
    setFormData(customer);
    setEditingId(customer.id);
    setShowForm(true);
  };

  const filteredCustomers = [...customers]
    .filter((customer: Customer) => {
      const term = search.trim().toLowerCase();
      if (!term) return true;
      return `${customer.fullName} ${customer.phone} ${customer.email ?? ''}`.toLowerCase().includes(term);
    })
    .sort((a: Customer, b: Customer) => {
      if (sortBy === 'phone') return a.phone.localeCompare(b.phone);
      return a.fullName.localeCompare(b.fullName);
    });

  const exportReport = () => {
    const rows = filteredCustomers.map((customer: Customer) => [customer.fullName, customer.phone, customer.email ?? '', customer.address ?? ''].join('\t'));
    const content = [['Họ tên', 'Số điện thoại', 'Email', 'Địa chỉ'].join('\t'), ...rows].join('\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers-report.txt';
    link.click();
    URL.revokeObjectURL(url);
    setToast({ message: 'Đã xuất báo cáo khách hàng', type: 'success' });
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(251,191,36,0.12),_transparent_25%),linear-gradient(135deg,_#020617,_#111827)] p-8 text-white">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400">CRM</p>
          <h1 className="text-4xl font-bold text-white">Quản lý Khách hàng</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportReport}
            className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
          >
            Xuất báo cáo
          </button>
          <button
            onClick={() => {
              setFormData({});
              setEditingId(null);
              setShowForm(!showForm);
            }}
            className="rounded-full bg-amber-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-amber-400"
          >
            {showForm ? 'Đóng' : 'Thêm Khách hàng'}
          </button>
        </div>
      </div>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/20 backdrop-blur">
          <label className="mb-2 block text-sm text-slate-300">Tìm kiếm khách hàng</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
            placeholder="Tên, số điện thoại hoặc email"
          />
        </div>
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 shadow-lg shadow-black/20 backdrop-blur">
          <label className="mb-2 block text-sm text-slate-300">Sắp xếp</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'phone')}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
          >
            <option value="name">Tên A → Z</option>
            <option value="phone">Số điện thoại</option>
          </select>
        </div>
      </div>

      <div className="mb-6">
        <UserProfileCard />
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ và tên"
              value={formData.fullName || ''}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="tel"
              placeholder="Số điện thoại"
              value={formData.phone || ''}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              required
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Địa chỉ"
              value={formData.address || ''}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Ghi chú"
              value={formData.notes || ''}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="col-span-2 rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-amber-400"
              rows={3}
            />
          </div>
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="rounded-full bg-emerald-500 px-5 py-2 font-semibold text-white transition hover:bg-emerald-400"
            >
              {editingId ? 'Cập nhật' : 'Tạo mới'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                setFormData({});
              }}
              className="rounded-full bg-slate-700 px-5 py-2 font-semibold text-white transition hover:bg-slate-600"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {filteredCustomers.map((customer: Customer) => (
          <div key={customer.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 shadow-lg shadow-black/20 backdrop-blur transition hover:border-amber-400/40">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-white">{customer.fullName}</h3>
                <p className="mt-1 text-slate-300">📱 {customer.phone}</p>
                {customer.email && <p className="text-slate-300">✉️ {customer.email}</p>}
                {customer.address && <p className="text-slate-300">📍 {customer.address}</p>}
                {customer.notes && <p className="mt-2 text-sm italic text-slate-400">{customer.notes}</p>}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(customer)}
                  className="rounded-full bg-yellow-500 px-4 py-2 font-semibold text-slate-950 transition hover:bg-yellow-400"
                >
                  Sửa
                </button>
                <button
                  onClick={() => deleteMutation.mutate(customer.id)}
                  className="rounded-full bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-500"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
