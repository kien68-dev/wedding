import { useEffect, useState } from 'react';
import api from '../services/api';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch {
        setError('Không thể tải thông tin hồ sơ');
      }
    };

    loadProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await api.post('/auth/change-password', { currentPassword, newPassword });
      setMessage(response.data.message ?? 'Đổi mật khẩu thành công');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-white">Hồ sơ cá nhân</h3>
        <p className="text-sm text-slate-400">Quản lý thông tin và mật khẩu của bạn</p>
      </div>

      <div className="mb-6 rounded-2xl border border-amber-400/20 bg-gradient-to-r from-amber-500/10 to-fuchsia-500/10 p-4">
        <p className="text-sm text-slate-300">Tên</p>
        <p className="text-lg font-semibold text-white">{profile?.name ?? 'Đang tải...'}</p>
        <p className="mt-2 text-sm text-slate-300">Email: {profile?.email ?? '---'}</p>
        <p className="text-sm text-slate-300">Vai trò: {profile?.role ?? '---'}</p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm text-slate-300">Mật khẩu hiện tại</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-slate-300">Mật khẩu mới</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none"
            placeholder="••••••••"
          />
        </div>
        {message && <p className="text-sm text-emerald-300">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-amber-500 px-5 py-2 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
        >
          {loading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}
