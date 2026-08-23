import { toast } from 'react-hot-toast';

export const toastSuccess = (message: string) => {
  toast.success(message);
};

export const toastError = (message: string) => {
  toast.error(message);
};

export const toastLoading = (message: string) => {
  return toast.loading(message);
};

export const toastDismiss = (id?: string) => {
  toast.dismiss(id);
};

export const toastInfo = (message: string) => {
  toast(message, {
    icon: 'ℹ️',
  });
};