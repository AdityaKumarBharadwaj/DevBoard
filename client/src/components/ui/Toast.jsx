import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, X, Info } from 'lucide-react';

const toastStyles = {
  success: {
    border: 'border-green-500',
    bg: 'bg-green-950',
    icon: CheckCircle,
    iconColor: 'text-green-400',
  },
  error: {
    border: 'border-red-500',
    bg: 'bg-red-950',
    icon: XCircle,
    iconColor: 'text-red-400',
  },
  warning: {
    border: 'border-yellow-500',
    bg: 'bg-yellow-950',
    icon: AlertTriangle,
    iconColor: 'text-yellow-400',
  },
  info: {
    border: 'border-indigo-500',
    bg: 'bg-indigo-950',
    icon: Info,
    iconColor: 'text-indigo-400',
  },
};

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
}

export default function Toast({ toasts = [], removeToast, duration = 3000 }) {
  useEffect(() => {
    if (!toasts.length) return;

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        removeToast(toast.id);
      }, duration)
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [toasts, duration, removeToast]);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => {
        const config = toastStyles[toast.type] || toastStyles.info;
        const Icon = config.icon;
        return (
          <div
            key={toast.id}
            className={`animate-slide-in flex items-start gap-3 rounded-xl border-l-4 ${config.border} ${config.bg} px-4 py-3 shadow-card min-w-[16rem] max-w-sm text-white transition-transform duration-300`}
          >
            <div className={`mt-0.5 ${config.iconColor}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1 text-sm leading-5">{toast.message}</div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-gray-300 transition hover:text-white"
              aria-label="Close notification"
            >
              <X size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
