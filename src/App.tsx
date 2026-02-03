import { SceneProvider } from '@/contexts/SceneContext';
import { ConversationProvider } from '@/contexts/ConversationContext';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { AdvisorPage } from '@/components/AdvisorPage';

function App() {
  return (
    <CustomerProvider>
      <SceneProvider>
        <ConversationProvider>
          <AdvisorPage />
        </ConversationProvider>
      </SceneProvider>
    </CustomerProvider>
  );
}

export default App;
