import { useMemo } from 'react';

interface UserProfileCardProps {
  name?: string;
  role?: string;
  email?: string;
  avatar?: string;
}

export default function UserProfileCard({ name, role, email, avatar }: UserProfileCardProps) {
  const user = useMemo(() => {
    const stored = localStorage.getItem('user');
    if (!stored) {
      return null;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  const displayName = name ?? user?.name ?? 'Administrator';
  const displayRole = role ?? user?.role ?? 'ADMIN';
  const displayEmail = email ?? user?.email ?? 'admin@wedding.com';
  const displayAvatar = avatar ?? '👩‍💼';

  return (
    <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 via-white/5 to-fuchsia-500/10 p-5 shadow-lg shadow-amber-950/20">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-3xl shadow-lg shadow-amber-900/30">
          {displayAvatar}
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Tài khoản</p>
          <h3 className="text-xl font-semibold text-white">{displayName}</h3>
          <p className="text-sm text-slate-300">{displayEmail}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
        <span>Vai trò</span>
        <span className="font-semibold text-white">{displayRole}</span>
      </div>
    </div>
  );
}
