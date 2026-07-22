import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') ?? 'null');

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/customers', label: 'Khách hàng', icon: '👥' },
    { path: '/wedding-events', label: 'Sự kiện', icon: '💒' },
    { path: '/guests', label: 'Khách mời', icon: '🎉' },
    { path: '/contracts', label: 'Hợp đồng', icon: '📝' },
    { path: '/payments', label: 'Thanh toán', icon: '💳' },
    { path: '/admin', label: 'Quản lý', icon: '⚙️' }
  ];

  return (
    <nav className="sticky top-0 z-20 border-b border-white/10 bg-[linear-gradient(90deg,_rgba(15,23,42,0.95),_rgba(30,41,59,0.92))] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="rounded-full bg-gradient-to-br from-amber-400 to-rose-400 px-2 py-1 text-base">💍</span>
          <span>Wedding Manager</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {links.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`rounded-full px-3 py-2 text-sm transition duration-200 ${
                  active ? 'bg-gradient-to-r from-amber-400 to-rose-400 text-slate-950 shadow-lg shadow-amber-900/20' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
          <div className="ml-2 flex items-center gap-2 rounded-full border border-amber-400/20 bg-gradient-to-r from-white/10 to-amber-500/10 px-3 py-2 text-sm text-slate-200">
            <span>👤 {user?.name ?? 'Admin'}</span>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
              }}
              className="rounded-full bg-red-500/90 px-2 py-1 text-xs text-white hover:bg-red-600"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
