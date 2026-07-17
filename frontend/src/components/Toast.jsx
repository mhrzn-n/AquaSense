import { useState, useEffect } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const typeClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full p-4 rounded-lg shadow-lg flex items-center justify-between gap-3 transform transition-all duration-300 ${typeClasses[type]}`}
      style={{
        animation: "slideInRight 0.3s ease-out",
      }}
    >
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-white opacity-70 hover:opacity-100 transition"
      >
        ×
      </button>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Manager (Container)
let toastCounter = 0;

const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    // Global function to show toast
    window.showToast = (message, type = "info", duration = 3000) => {
      const id = ++toastCounter;
      const newToast = { id, message, type, duration };

      setToasts((prev) => [...prev, newToast]);

      // Auto remove
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration + 300);
    };

    return () => {
      delete window.showToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed top-0 right-0 z-50 p-4 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
