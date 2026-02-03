import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/contexts/SceneContext';
import type { WelcomeData } from '@/types/scene';

interface WelcomeScreenProps {
  welcomeData?: WelcomeData;
  isActive: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  welcomeData,
  isActive,
}) => {
  const { dismissWelcome } = useScene();

  return (
    <AnimatePresence>
      {isActive && welcomeData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.2, duration: 0.5, ease: 'easeOut' }}
            className="text-center max-w-lg px-6 pointer-events-auto"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '3rem' }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="h-0.5 bg-[#59285D] mx-auto mb-6"
            />
            <h1 className="text-2xl md:text-3xl font-light text-white leading-snug mb-3">
              {welcomeData.message}
            </h1>
            {welcomeData.subtext && (
              <p className="text-white/60 text-sm leading-relaxed mb-6">
                {welcomeData.subtext}
              </p>
            )}
            <button
              onClick={dismissWelcome}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white text-sm transition-all"
            >
              Get started
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
