import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import { ChatInput } from './ChatInput';
import { ChatMessages } from './ChatMessages';
import { TypingIndicator } from './TypingIndicator';
import type { AgentMessage } from '@/types/agent';

interface ChatInterfaceProps {
  position: 'center' | 'bottom' | 'minimized';
  messages: AgentMessage[];
  onSendMessage: (message: string) => void;
  isAgentTyping: boolean;
  isMinimized?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  position,
  messages,
  onSendMessage,
  isAgentTyping,
  isMinimized = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isMinimized) {
    return (
      <motion.button
        className="fixed bottom-4 right-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </motion.button>
    );
  }

  return (
    <motion.div
      layout
      className={cn(
        'flex flex-col w-full max-w-2xl mx-auto px-4',
        position === 'center' && 'flex-1 justify-center',
        position === 'bottom' && 'mt-auto pb-8'
      )}
    >
      {position === 'center' && messages.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-light text-white mb-2">
            I'm your beauty concierge
          </h1>
          <p className="text-white/70 text-lg">
            How can I help you today?
          </p>
        </motion.div>
      )}

      {messages.length > 0 && (
        <ChatMessages messages={messages} />
      )}
      
      {isAgentTyping && <TypingIndicator />}
      
      <div ref={messagesEndRef} />

      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSubmit={handleSubmit}
        placeholder="Ask me anything..."
        isCentered={position === 'center'}
      />
    </motion.div>
  );
};
