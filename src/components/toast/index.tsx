// components/Toast.tsx
import React, { useEffect } from 'react';
import styles from './toast.module.css';
import { useToastStore } from '../../store/toastStore';

const Toast: React.FC = () => {
  const { toast, removeToast } = useToastStore();

  useEffect(() => {
    if (toast && toast.autoClose) {
      const timer = setTimeout(() => {
        removeToast();
      }, toast.duration || 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, removeToast]);

  if (!toast) return null;

  return (
    <div className={`${styles.toast} ${styles[toast.type]}`}>
      <span>{toast.message}</span>
      {!toast.autoClose && (
        <button className={styles.closeButton} onClick={removeToast}>
          ×
        </button>
      )}
    </div>
  );
};

export default Toast;
