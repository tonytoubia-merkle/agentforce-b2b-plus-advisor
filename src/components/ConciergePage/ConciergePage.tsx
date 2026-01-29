import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/contexts/SceneContext';
import { useConversation } from '@/contexts/ConversationContext';
import { GenerativeBackground } from '@/components/GenerativeBackground';
import { ChatInterface } from '@/components/ChatInterface';
import { ProductShowcase } from '@/components/ProductShowcase';
import { CheckoutOverlay } from '@/components/CheckoutOverlay';
import { sceneAnimationVariants } from '@/utils/animations';

export const ConciergePage: React.FC = () => {
  const { scene } = useScene();
  const { messages, sendMessage, isAgentTyping } = useConversation();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GenerativeBackground 
        background={scene.background}
        setting={scene.setting}
      />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={scene.transitionKey}
          variants={sceneAnimationVariants[scene.layout]}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10 min-h-screen flex flex-col"
        >
          {scene.layout !== 'conversation-centered' && (
            <ProductShowcase 
              products={scene.products}
              layout={scene.layout}
            />
          )}
          
          <ChatInterface
            position={scene.chatPosition}
            messages={messages}
            onSendMessage={sendMessage}
            isAgentTyping={isAgentTyping}
            isMinimized={scene.layout === 'checkout'}
          />
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        {scene.checkoutActive && (
          <CheckoutOverlay />
        )}
      </AnimatePresence>
    </div>
  );
};
