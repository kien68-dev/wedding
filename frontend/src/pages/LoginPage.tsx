import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('admin@wedding.com');
  const [password, setPassword] = useState('admin123');
  const [confirmPassword, setConfirmPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Vui lòng nhập tên của bạn');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Mật khẩu phải có ít nhất 6 ký tự');
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp');
        setLoading(false);
        return;
      }

      try {
        await api.post('/auth/register', { email, password, name: name.trim(), role: 'STAFF' });
        setMode('login');
        setError('');
        setPassword('');
        setConfirmPassword('');
      } catch (err: any) {
        setError(err?.response?.data?.message ?? 'Đăng ký thất bại');
      } finally {
        setLoading(false);
      }
      return;
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard');
    } catch {
      setError('Email hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Wedding Manager</h1>
          <p className="mt-2 text-sm text-slate-300">{mode === 'login' ? 'Đăng nhập để quản lý sự kiện cưới' : 'Tạo tài khoản mới để bắt đầu'}</p>
        </div>

        <div className="mb-6 flex rounded-full border border-white/10 bg-slate-900/70 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'login' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${mode === 'register' ? 'bg-amber-500 text-slate-950' : 'text-slate-300'}`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-2 block text-sm text-slate-200">Họ tên</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                placeholder="Nguyễn Văn A"
              />
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm text-slate-200">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              placeholder="admin@wedding.com"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-200">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
              placeholder="••••••••"
            />
          </div>
          {mode === 'register' && (
            <div>
              <label className="mb-2 block text-sm text-slate-200">Xác nhận mật khẩu</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none"
                placeholder="••••••••"
              />
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-amber-400 disabled:opacity-60"
          >
            {loading ? (mode === 'register' ? 'Đang đăng ký...' : 'Đang đăng nhập...') : (mode === 'register' ? 'Đăng ký' : 'Đăng nhập')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;
