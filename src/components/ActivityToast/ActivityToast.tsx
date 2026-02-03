import { motion } from 'framer-motion';
import type { CaptureNotification } from '@/types/agent';

const TOAST_CONFIG: Record<CaptureNotification['type'], { color: string; icon: string }> = {
  contact_created: { color: 'bg-emerald-600', icon: '+ Contact' },
  meaningful_event: { color: 'bg-amber-600', icon: 'Event' },
  profile_enrichment: { color: 'bg-sky-600', icon: 'Profile' },
};

interface ActivityToastProps {
  notification: CaptureNotification;
  onDismiss: () => void;
}

export const ActivityToast: React.FC<ActivityToastProps> = ({ notification, onDismiss }) => {
  const config = TOAST_CONFIG[notification.type];

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 80 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      onAnimationComplete={(def) => {
        if (typeof def === 'object' && 'opacity' in def && def.opacity === 0) onDismiss();
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm bg-black/70 text-white max-w-xs"
    >
      <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-medium text-white ${config.color}`}>
        {config.icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium truncate">{notification.label}</p>
        {notification.detail && (
          <p className="text-xs text-white/60 truncate">{notification.detail}</p>
        )}
      </div>
    </motion.div>
  );
};
