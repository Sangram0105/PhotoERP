import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export type ToastType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastItem;
  onClose: (id: string) => void;
}

const Toast = ({
  toast,
  onClose,
}: ToastProps) => {
  const styles = {
    success: {
      border: 'border-green-500',
      icon: (
        <CheckCircle
          className="text-green-600"
          size={22}
        />
      ),
    },

    error: {
      border: 'border-red-500',
      icon: (
        <XCircle
          className="text-red-600"
          size={22}
        />
      ),
    },

    warning: {
      border: 'border-yellow-500',
      icon: (
        <AlertTriangle
          className="text-yellow-600"
          size={22}
        />
      ),
    },

    info: {
      border: 'border-blue-500',
      icon: (
        <Info
          className="text-blue-600"
          size={22}
        />
      ),
    },
  };

  return (
    <div
      className={`
        flex
        items-center
        gap-3
        w-96
        rounded-xl
        border-l-4
        bg-white
        px-4
        py-3
        shadow-xl
        animate-in
        slide-in-from-right
        duration-300
        ${styles[toast.type].border}
      `}
    >
      {styles[toast.type].icon}

      <p className="flex-1 text-sm text-slate-700">
        {toast.message}
      </p>

      <button
        onClick={() => onClose(toast.id)}
      >
        <X
          size={18}
          className="text-slate-400 hover:text-slate-700"
        />
      </button>
    </div>
  );
};

export default Toast;