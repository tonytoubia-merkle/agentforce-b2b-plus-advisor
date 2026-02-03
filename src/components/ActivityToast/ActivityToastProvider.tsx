import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ActivityToast } from './ActivityToast';
import type { CaptureNotification } from '@/types/agent';

interface ToastItem {
  id: number;
  notification: CaptureNotification;
}

interface ActivityToastContextValue {
  showCaptures: (captures: CaptureNotification[]) => void;
}

const ActivityToastContext = createContext<ActivityToastContextValue | null>(null);

export const useActivityToast = (): ActivityToastContextValue => {
  const ctx = useContext(ActivityToastContext);
  if (!ctx) throw new Error('useActivityToast must be used within ActivityToastProvider');
  return ctx;
};

export const ActivityToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const showCaptures = useCallback((captures: CaptureNotification[]) => {
    const newToasts = captures.map((n, i) => ({
      id: ++nextId.current,
      notification: n,
    }));

    // Stagger toasts
    newToasts.forEach((toast, i) => {
      setTimeout(() => {
        setToasts((prev) => [...prev, toast]);
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, 4000);
      }, i * 600);
    });
  }, []);

  return (
    <ActivityToastContext.Provider value={{ showCaptures }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {toasts.map((t) => (
            <ActivityToast
              key={t.id}
              notification={t.notification}
              onDismiss={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </ActivityToastContext.Provider>
  );
};
