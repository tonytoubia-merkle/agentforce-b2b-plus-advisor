import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CustomerProfile } from '@/types/customer';
import { resolveMerkuryIdentity } from '@/services/merkury/mockTag';
import { getPersonaById } from '@/mocks/customerPersonas';
import { getDataCloudService } from '@/services/datacloud';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

interface CustomerContextValue {
  customer: CustomerProfile | null;
  selectedPersonaId: string | null;
  isLoading: boolean;
  isResolving: boolean;
  error: Error | null;
  selectPersona: (personaId: string) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const selectPersona = useCallback(async (personaId: string) => {
    setSelectedPersonaId(personaId);
    setIsResolving(true);
    setError(null);

    try {
      // Simulate Merkury tag resolution
      const resolution = await resolveMerkuryIdentity(personaId);
      console.log('[merkury] Identity resolved:', resolution.identityTier, 'confidence:', resolution.confidence);

      // Appended-tier: Merkury resolved identity via 3P data only.
      // These people are NOT in Data Cloud — don't look them up there.
      // Build a minimal anonymous-like profile with only appended signals attached.
      if (resolution.identityTier === 'appended') {
        const appendedProfile: CustomerProfile = {
          id: resolution.merkuryId || `appended-${personaId}`,
          name: 'Guest',
          email: '',
          beautyProfile: {} as CustomerProfile['beautyProfile'],
          orders: [],
          purchaseHistory: [],
          chatSummaries: [],
          meaningfulEvents: [],
          browseSessions: [],
          loyalty: null,
          savedPaymentMethods: [],
          shippingAddresses: [],
          recentActivity: [],
          merkuryIdentity: {
            merkuryId: resolution.merkuryId || '',
            identityTier: 'appended',
            confidence: resolution.confidence,
            resolvedAt: new Date().toISOString(),
          },
          appendedProfile: resolution.appendedData,
        };
        console.log('[customer] Appended-tier identity — using minimal profile with 3P signals only');
        setCustomer(appendedProfile);
      } else if (resolution.identityTier === 'anonymous' || !resolution.merkuryId) {
        // Anonymous: Merkury found no match. Stay on the default starting page —
        // no agent session, no welcome, no profile data. Just the baseline experience.
        console.log('[customer] Anonymous — no identity resolved, staying on default experience');
        setCustomer(null);
      } else if (useMockData) {
        // MOCK MODE: Load known profiles from mock personas
        const persona = getPersonaById(personaId);
        if (persona) {
          setCustomer(persona.profile);
        } else {
          setCustomer(null);
        }
      } else {
        // REAL MODE: Fetch known profile from Data Cloud
        setIsLoading(true);
        // Stamp Merkury resolution onto the profile so the UI knows identity tier
        const merkuryIdentity = {
          merkuryId: resolution.merkuryId!,
          identityTier: resolution.identityTier,
          confidence: resolution.confidence,
          resolvedAt: new Date().toISOString(),
        };
        try {
          const dataCloudService = getDataCloudService();
          const profile = await dataCloudService.getCustomerProfile(resolution.merkuryId);
          profile.merkuryIdentity = merkuryIdentity;
          if (resolution.appendedData) profile.appendedProfile = resolution.appendedData;
          setCustomer(profile);
        } catch (dcError) {
          console.error('[datacloud] Profile fetch failed:', dcError);
          console.warn('[datacloud] Falling back to mock persona data');
          const persona = getPersonaById(personaId);
          if (persona) {
            const fallback = { ...persona.profile, merkuryIdentity };
            setCustomer(fallback);
          } else {
            throw new Error('Failed to load customer profile from Data Cloud');
          }
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Identity resolution failed:', err);
      setError(err instanceof Error ? err : new Error('Identity resolution failed'));
      setCustomer(null);
    } finally {
      setIsResolving(false);
    }
  }, []);

  return (
    <CustomerContext.Provider value={{ customer, selectedPersonaId, isLoading, isResolving, error, selectPersona }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = (): CustomerContextValue => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within CustomerProvider');
  }
  return context;
};
