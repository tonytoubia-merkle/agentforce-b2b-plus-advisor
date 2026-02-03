import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { CustomerProfile } from '@/types/customer';
import { resolveMerkuryIdentity } from '@/services/merkury/mockTag';
import { getPersonaById, PERSONA_STUBS } from '@/mocks/customerPersonas';
import { getDataCloudService } from '@/services/datacloud';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

interface CustomerContextValue {
  customer: CustomerProfile | null;
  selectedPersonaId: string | null;
  isLoading: boolean;
  isResolving: boolean;
  error: Error | null;
  selectPersona: (personaId: string) => Promise<void>;
  identifyByEmail: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetPersonaSession: (personaId: string) => void;
  /** @internal Used by ConversationContext to detect refresh vs switch. */
  _isRefreshRef: React.MutableRefObject<boolean>;
  /** @internal Register callback for session reset notifications. */
  _onSessionReset: (cb: (personaId: string) => void) => () => void;
}

const CustomerContext = createContext<CustomerContextValue | null>(null);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  /** When true, the next customer update is a profile refresh — don't reset conversation. */
  const isRefreshRef = useRef(false);
  /** Callbacks registered by ConversationContext to clear a persona's cached session. */
  const sessionResetCallbacksRef = useRef<Set<(personaId: string) => void>>(new Set());
  const hasAutoSelected = useRef(false);

  /** Register a callback to be notified when a persona session should be reset. */
  const onSessionReset = useCallback((cb: (personaId: string) => void) => {
    sessionResetCallbacksRef.current.add(cb);
    return () => { sessionResetCallbacksRef.current.delete(cb); };
  }, []);

  const selectPersona = useCallback(async (personaId: string) => {
    setSelectedPersonaId(personaId);
    setIsResolving(true);
    setError(null);

    try {
      // Simulate Merkury tag resolution
      const resolution = await resolveMerkuryIdentity(personaId);
      console.log('[merkury] Identity resolved:', resolution.identityTier, 'confidence:', resolution.confidence);

      // Appended-tier: Merkury resolved identity via 3P data only.
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

  /** Identify an anonymous visitor by email mid-conversation. */
  const identifyByEmail = useCallback(async (email: string) => {
    if (!email) return;
    isRefreshRef.current = true;

    try {
      if (useMockData) {
        // Match against existing personas by email
        for (const stub of PERSONA_STUBS) {
          const persona = getPersonaById(stub.id);
          if (persona && persona.profile.email.toLowerCase() === email.toLowerCase()) {
            console.log('[identity] Email matched persona:', stub.id);
            setSelectedPersonaId(stub.id);
            setCustomer(persona.profile);
            return;
          }
        }
        // No match — create minimal known profile
        console.log('[identity] No persona match for email, creating minimal profile');
        const minimalProfile: CustomerProfile = {
          id: `email-${email}`,
          name: email.split('@')[0],
          email,
          beautyProfile: {} as CustomerProfile['beautyProfile'],
          orders: [],
          purchaseHistory: [],
          chatSummaries: [],
          meaningfulEvents: [],
          browseSessions: [],
          loyalty: null,
          savedPaymentMethods: [],
          shippingAddresses: [],
          merkuryIdentity: {
            merkuryId: `email-${email}`,
            identityTier: 'known',
            confidence: 0.85,
            resolvedAt: new Date().toISOString(),
          },
        };
        setCustomer(minimalProfile);
      } else {
        // Real mode: query Data Cloud by email
        const dataCloudService = getDataCloudService();
        const profile = await (dataCloudService as any).getCustomerProfileByEmail?.(email);
        if (profile) {
          setCustomer(profile);
        }
      }
    } catch (err) {
      console.error('[identity] Email identification failed:', err);
    } finally {
      isRefreshRef.current = false;
    }
  }, []);

  /** Re-fetch the current persona's profile without resetting the conversation. */
  const refreshProfile = useCallback(async () => {
    if (!selectedPersonaId) return;
    isRefreshRef.current = true;
    await selectPersona(selectedPersonaId);
    isRefreshRef.current = false;
  }, [selectedPersonaId, selectPersona]);

  /** Clear a persona's cached session so their next switch re-fires welcome. */
  const resetPersonaSession = useCallback((personaId: string) => {
    for (const cb of sessionResetCallbacksRef.current) cb(personaId);
    if (personaId === selectedPersonaId) {
      selectPersona(personaId);
    }
  }, [selectedPersonaId, selectPersona]);

  // Auto-select anonymous persona on startup
  useEffect(() => {
    if (!hasAutoSelected.current) {
      hasAutoSelected.current = true;
      selectPersona('anonymous');
    }
  }, [selectPersona]);

  return (
    <CustomerContext.Provider value={{
      customer, selectedPersonaId, isLoading, isResolving, error,
      selectPersona, identifyByEmail, refreshProfile, resetPersonaSession,
      _isRefreshRef: isRefreshRef, _onSessionReset: onSessionReset,
    }}>
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
