import { useApp } from '../context/AppContext.jsx';

export const ToastHost = () => {
  const { toasts } = useApp();
  if (!toasts.length) return null;
  return (
    <div className="toast-host">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-notice">
          {toast.message}
        </div>
      ))}
    </div>
  );
};
