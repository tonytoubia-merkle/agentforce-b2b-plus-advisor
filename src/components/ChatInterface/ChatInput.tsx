import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isCentered?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Type a message...',
  isCentered = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div
      layout
      className={cn(
        'relative w-full',
        isCentered ? 'max-w-xl mx-auto' : 'max-w-2xl'
      )}
    >
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full px-6 py-4 rounded-full',
            'bg-white/10 backdrop-blur-md',
            'border border-white/20',
            'text-white placeholder-white/50',
            'focus:outline-none focus:ring-2 focus:ring-white/30',
            'transition-all duration-200',
            isCentered && 'text-lg'
          )}
        />
        
        <button
          className="absolute right-14 p-2 text-white/60 hover:text-white transition-colors"
          aria-label="Voice input"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </button>

        <button
          onClick={onSubmit}
          disabled={!value.trim()}
          className={cn(
            'absolute right-3 p-2 rounded-full',
            'bg-white/20 hover:bg-white/30',
            'text-white transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};
