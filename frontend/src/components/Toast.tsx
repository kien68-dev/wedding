interface ToastProps {
  message: string;
  type?: 'success' | 'error';
}

export default function Toast({ message, type = 'success' }: ToastProps) {
  const palette = type === 'error'
    ? 'border-red-500/30 bg-red-500/10 text-red-200'
    : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200';

  return (
    <div className={`fixed right-4 top-4 z-50 rounded-xl border px-4 py-3 shadow-lg backdrop-blur ${palette}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
