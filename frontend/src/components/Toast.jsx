import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container" role="region" aria-live="polite">
      {toasts.map((toast) => {
        const Icon =
          toast.type === 'error'
            ? AlertCircle
            : toast.type === 'info'
            ? Info
            : CheckCircle2;

        return (
          <div key={toast.id} className={`toast ${toast.type || 'success'}`}>
            <div className="toast-content">
              <Icon
                size={18}
                style={{
                  color:
                    toast.type === 'error'
                      ? 'var(--danger)'
                      : toast.type === 'info'
                      ? 'var(--info)'
                      : 'var(--success)',
                  flexShrink: 0,
                }}
              />
              <span>{toast.message}</span>
            </div>
            <button
              className="toast-close"
              onClick={() => onDismiss(toast.id)}
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
