import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomer } from '@/contexts/CustomerContext';
import { useConversation } from '@/contexts/ConversationContext';

interface RememberMeButtonProps {
  className?: string;
}

export const RememberMeButton: React.FC<RememberMeButtonProps> = ({ className = '' }) => {
  const { customer } = useCustomer();
  const { sendMessage } = useConversation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Only show for anonymous users
  const isAnonymous = !customer || customer.merkuryIdentity?.identityTier === 'anonymous';
  if (!isAnonymous) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);
    try {
      // Inject a natural message into the conversation that triggers IdentityCapture
      await sendMessage(`My name is ${name.trim()} and my email is ${email.trim()}`);
      setIsModalOpen(false);
      setName('');
      setEmail('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className={`px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 text-white/80 hover:text-white rounded-lg backdrop-blur-sm border border-white/10 transition-all ${className}`}
      >
        Remember Me
      </button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-white/10 rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold text-white mb-2">
                Stay Connected
              </h2>
              <p className="text-sm text-white/60 mb-4">
                Share your details so we can personalize your experience and save your preferences.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2 text-sm text-white/60 hover:text-white/80 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !name.trim() || !email.trim()}
                    className="flex-1 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-purple-600/50 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
