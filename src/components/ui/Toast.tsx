import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 3000,

        style: {
          background: '#fff',
          color: '#333',
          borderRadius: '10px',
          padding: '14px 18px',
          fontSize: '14px',
          border: '1px solid #e5e7eb',
          boxShadow:
            '0 10px 25px rgba(0,0,0,.08)',
        },

        success: {
          iconTheme: {
            primary: '#16a34a',
            secondary: '#fff',
          },
        },

        error: {
          iconTheme: {
            primary: '#dc2626',
            secondary: '#fff',
          },
        },
      }}
    />
  );
};

export default Toast;