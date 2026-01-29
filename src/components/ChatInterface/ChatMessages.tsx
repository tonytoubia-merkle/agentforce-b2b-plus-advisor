import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import type { AgentMessage } from '@/types/agent';

interface ChatMessagesProps {
  messages: AgentMessage[];
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="flex flex-col gap-3 mb-4 max-h-60 overflow-y-auto scrollbar-thin">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'max-w-[80%] px-4 py-3 rounded-2xl text-sm',
            msg.role === 'user'
              ? 'ml-auto bg-white/20 text-white rounded-br-md'
              : 'mr-auto bg-white/10 text-white/90 rounded-bl-md'
          )}
        >
          {msg.content}
        </motion.div>
      ))}
    </div>
  );
};
