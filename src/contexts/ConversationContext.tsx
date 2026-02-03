import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AgentMessage, UIAction } from '@/types/agent';
import type { CustomerSessionContext, CustomerProfile, AgentCapturedProfile, CapturedProfileField, ChatSummary, TaggedContextField } from '@/types/customer';
import { PROVENANCE_USAGE } from '@/types/customer';
import { useScene } from './SceneContext';
import { useCustomer } from './CustomerContext';
import { generateMockResponse, setMockCustomerContext, getMockAgentSnapshot, restoreMockAgentSnapshot } from '@/services/mock/mockAgent';
import type { MockAgentSnapshot } from '@/services/mock/mockAgent';
import type { AgentResponse } from '@/types/agent';
import { getAgentforceClient } from '@/services/agentforce/client';
import { getDataCloudWriteService } from '@/services/datacloud';
import { useActivityToast } from '@/components/ActivityToast';
import type { SceneSnapshot } from './SceneContext';

const useMockData = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

let sessionInitialized = false;

/** Snapshot of a persona's full session state for instant restore. */
interface SessionSnapshot {
  messages: AgentMessage[];
  suggestedActions: string[];
  sceneSnapshot: SceneSnapshot;
  agentSessionId: string | null;
  agentSequenceId: number;
  mockSnapshot: MockAgentSnapshot | null;
  sessionInitialized: boolean;
}

function buildSessionContext(customer: CustomerProfile): CustomerSessionContext {
  const recentOrders = (customer.orders || [])
    .sort((a, b) => b.orderDate.localeCompare(a.orderDate))
    .slice(0, 5);
  const recentPurchases = recentOrders.flatMap((o) =>
    o.lineItems.map((li) => li.productId)
  );
  const recentActivity = recentOrders.map((o) => {
    const items = o.lineItems.map((li) => {
      const qty = li.quantity ? ` (${li.quantity} units)` : '';
      return `${li.productName}${qty}`;
    }).join(', ');
    const status = o.status ? ` — ${o.status}` : '';
    return `PO ${o.orderId} on ${o.orderDate} (${o.channel}): ${items}${status}`;
  });

  const chatContext = (customer.chatSummaries || [])
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
    .slice(0, 3)
    .map((c) => `[${c.sessionDate}] ${c.summary}`);

  const meaningfulEvents = (customer.meaningfulEvents || [])
    .sort((a, b) => b.capturedAt.localeCompare(a.capturedAt))
    .map((e) => {
      const note = e.agentNote ? ` (Note: ${e.agentNote})` : '';
      return `[${e.capturedAt}] ${e.description}${note}`;
    });

  const browseInterests = (customer.browseSessions || [])
    .sort((a, b) => b.sessionDate.localeCompare(a.sessionDate))
    .slice(0, 3)
    .map((b) => `Browsed ${b.categoriesBrowsed.join(', ')} on ${b.sessionDate} (${b.durationMinutes}min, ${b.device})`);

  if (!recentActivity.length && customer.recentActivity?.length) {
    recentActivity.push(...customer.recentActivity.map((a) => a.description));
  }
  if (!recentPurchases.length && customer.purchaseHistory?.length) {
    recentPurchases.push(...customer.purchaseHistory.map((p) => p.productId));
  }

  const captured = customer.agentCapturedProfile;
  const capturedProfile: string[] = [];
  const missingProfileFields: string[] = [];

  if (captured) {
    const fieldLabel: Record<string, string> = {
      annualVolume: 'Annual procurement volume',
      budgetCycle: 'Budget cycle',
      qualityStandards: 'Quality standards',
      sustainabilityGoals: 'Sustainability goals',
      preferredLeadTime: 'Preferred lead time',
      primaryApplication: 'Primary application',
      projectPipeline: 'Project pipeline',
      gridInterconnection: 'Grid interconnection',
      siteConditions: 'Site conditions',
      warehouseLocations: 'Warehouse / ship-to location',
      inventoryStrategy: 'Inventory strategy',
    };
    for (const [key, label] of Object.entries(fieldLabel)) {
      const field = captured[key as keyof AgentCapturedProfile] as CapturedProfileField | undefined;
      if (field) {
        const val = Array.isArray(field.value) ? field.value.join(', ') : field.value;
        capturedProfile.push(`${label}: ${val} (${field.confidence}, ${field.capturedFrom})`);
      } else {
        missingProfileFields.push(label);
      }
    }
  } else {
    missingProfileFields.push(
      'Annual procurement volume', 'Budget cycle', 'Quality standards',
      'Sustainability goals', 'Primary application', 'Preferred lead time',
      'Project pipeline',
    );
  }

  // ─── Build provenance-tagged context ───────────────────────────
  const taggedContext: TaggedContextField[] = [];

  if (customer.beautyProfile?.industry) {
    taggedContext.push({ value: `Industry: ${customer.beautyProfile.industry}`, provenance: 'declared', usage: 'direct' });
  }
  if (customer.beautyProfile?.primaryApplications?.length) {
    taggedContext.push({ value: `Applications: ${customer.beautyProfile.primaryApplications.join(', ')}`, provenance: 'declared', usage: 'direct' });
  }
  if (customer.beautyProfile?.certifications?.length) {
    taggedContext.push({ value: `Certifications: ${customer.beautyProfile.certifications.join(', ')}`, provenance: 'declared', usage: 'direct' });
  }
  if (customer.beautyProfile?.preferredBrands?.length) {
    taggedContext.push({ value: `Preferred brands: ${customer.beautyProfile.preferredBrands.join(', ')}`, provenance: 'declared', usage: 'direct' });
  }

  for (const order of (customer.orders || []).slice(0, 5)) {
    const items = order.lineItems.map((li) => {
      const qty = li.quantity ? ` (${li.quantity} units)` : '';
      return `${li.productName}${qty}`;
    }).join(', ');
    const status = order.status ? ` — ${order.status}` : '';
    taggedContext.push({ value: `PO ${order.orderId}: ${items} on ${order.orderDate} (${order.channel})${status}`, provenance: 'observed', usage: 'direct' });
  }

  if (customer.loyalty) {
    const pts = customer.loyalty.pointsBalance ? ` (volume credit: ${customer.loyalty.pointsBalance})` : '';
    taggedContext.push({ value: `Account tier: ${customer.loyalty.tier}${pts}`, provenance: 'observed', usage: 'direct' });
  }

  for (const chat of (customer.chatSummaries || []).slice(0, 3)) {
    taggedContext.push({ value: `[${chat.sessionDate}] ${chat.summary}`, provenance: 'observed', usage: 'direct' });
  }

  for (const event of customer.meaningfulEvents || []) {
    const prov = event.eventType === 'preference' || event.eventType === 'milestone' ? 'stated' : 'agent_inferred';
    taggedContext.push({ value: event.description, provenance: prov, usage: PROVENANCE_USAGE[prov] });
  }

  for (const session of (customer.browseSessions || []).slice(0, 3)) {
    taggedContext.push({
      value: `Browsed ${session.categoriesBrowsed.join(', ')} on ${session.sessionDate} (${session.durationMinutes}min)`,
      provenance: 'inferred',
      usage: 'soft',
    });
  }

  if (customer.agentCapturedProfile) {
    for (const [key, field] of Object.entries(customer.agentCapturedProfile)) {
      if (!field) continue;
      const typedField = field as CapturedProfileField;
      const prov = typedField.confidence === 'stated' ? 'stated' : 'agent_inferred';
      const val = Array.isArray(typedField.value) ? typedField.value.join(', ') : typedField.value;
      taggedContext.push({ value: `${key}: ${val}`, provenance: prov, usage: PROVENANCE_USAGE[prov] });
    }
  }

  if (customer.appendedProfile?.interests) {
    for (const interest of customer.appendedProfile.interests) {
      taggedContext.push({ value: interest, provenance: 'appended', usage: 'influence_only' });
    }
  }
  if (customer.appendedProfile?.lifestyleSignals) {
    for (const signal of customer.appendedProfile.lifestyleSignals) {
      taggedContext.push({ value: signal, provenance: 'appended', usage: 'influence_only' });
    }
  }

  return {
    customerId: customer.id,
    name: customer.name,
    email: customer.email,
    company: customer.company,
    identityTier: customer.merkuryIdentity?.identityTier || 'anonymous',
    industry: customer.beautyProfile?.industry,
    primaryApplications: customer.beautyProfile?.primaryApplications,
    recentPurchases,
    recentActivity,
    appendedInterests: customer.appendedProfile?.interests || [],
    loyaltyTier: customer.loyalty?.tier,
    loyaltyPoints: customer.loyalty?.pointsBalance,
    chatContext,
    meaningfulEvents,
    browseInterests,
    capturedProfile,
    missingProfileFields,
    taggedContext,
  };
}

function buildWelcomeMessage(ctx: CustomerSessionContext): string {
  const isAppended = ctx.identityTier === 'appended';
  const isAnonymous = ctx.identityTier === 'anonymous';

  const lines: string[] = ['[WELCOME]'];

  lines.push('[SYSTEM INSTRUCTIONS]');
  lines.push('You are a Parts Plus renewable energy advisor — the advisory service of Parts, a leading B2B distributor of wind turbine components, solar equipment, and energy storage solutions.');
  lines.push('Maintain a professional B2B tone. You have deep technical knowledge of renewable energy equipment and components.');
  lines.push('Focus on account management, order tracking, reorder assistance, equipment selection, and technical guidance.');
  lines.push('When discussing equipment, reference relevant specifications (power rating, efficiency, certifications, warranty) where appropriate.');
  lines.push('Help customers find the right equipment for their projects, track existing orders, and manage their account efficiently.');
  lines.push('');

  if (isAppended) {
    lines.push(`Customer: First-time visitor (identity resolved via Merkury, NOT a hand-raiser)`);
    lines.push(`Identity: appended`);
    lines.push(`[INSTRUCTION] Do NOT greet by name. Do NOT reference specific company data or industry signals directly. Instead, use appended signals to subtly curate product selections and equipment recommendations. Frame suggestions as "popular in your sector", "commonly specified for these applications", or "you might consider" — never "based on your profile" or "we know your company".`);
  } else if (isAnonymous) {
    lines.push(`Customer: Anonymous visitor`);
    lines.push(`Identity: anonymous`);
  } else {
    const nameLine = `Customer: ${ctx.name}`;
    lines.push(nameLine, `Email: ${ctx.email || 'unknown'}`, `Identity: ${ctx.identityTier}`);
    if (ctx.loyaltyTier) lines.push(`Account tier: ${ctx.loyaltyTier}`);
    if (ctx.email) lines.push(`[INSTRUCTION] The customer has been identified via their email address (${ctx.email}). Call Identify Customer By Email with this address to resolve their contactId before performing any profile updates or event captures.`);
  }

  lines.push('');
  lines.push('[DATA USAGE RULES]');
  lines.push('Context below is tagged by provenance. Follow these rules strictly:');
  lines.push('- [CONFIRMED]: Customer stated or declared this (industry, applications, certifications, preferred brands, order history). Reference explicitly ("Your account shows...", "Based on your specifications...").');
  lines.push('- [OBSERVED/INFERRED]: Behavioral signals or agent inferences (browse behavior, inferred project needs). Reference gently ("You were looking at...", "It appears you may need...").');
  lines.push('- [INFLUENCE ONLY]: Third-party appended data (company size, estimated revenue, industry vertical). NEVER mention directly. Use only to curate equipment recommendations, prioritize product categories, or tailor technical depth.');

  if (ctx.taggedContext?.length) {
    const direct = ctx.taggedContext.filter(f => f.usage === 'direct');
    const soft = ctx.taggedContext.filter(f => f.usage === 'soft');
    const influence = ctx.taggedContext.filter(f => f.usage === 'influence_only');

    if (direct.length) {
      lines.push('');
      lines.push('[CONFIRMED — OK to reference directly]');
      direct.forEach(f => lines.push(`  ${f.value}`));
    }
    if (soft.length) {
      lines.push('');
      lines.push('[OBSERVED/INFERRED — reference gently]');
      soft.forEach(f => lines.push(`  ${f.value}`));
    }
    if (influence.length) {
      lines.push('');
      lines.push('[INFLUENCE ONLY — use to curate equipment selections, NEVER reference directly]');
      influence.forEach(f => lines.push(`  ${f.value}`));
    }
  }

  if (ctx.missingProfileFields?.length) {
    lines.push('');
    lines.push(`[ENRICHMENT OPPORTUNITY] Try to naturally learn: ${ctx.missingProfileFields.join(', ')}`);
  }

  return lines.join('\n');
}

async function getAgentResponse(content: string): Promise<AgentResponse> {
  if (useMockData) {
    return generateMockResponse(content);
  }
  const client = getAgentforceClient();
  if (!sessionInitialized) {
    await client.initSession();
    sessionInitialized = true;
  }
  return client.sendMessage(content);
}

function writeConversationSummary(customerId: string, msgs: AgentMessage[]): void {
  if (msgs.length < 2) return;

  const topics = extractTopicsFromMessages(msgs);
  const summary: ChatSummary = {
    sessionDate: new Date().toISOString().split('T')[0],
    summary: `Customer discussed ${topics.join(', ')}. ${msgs.length} messages exchanged.`,
    sentiment: 'neutral',
    topicsDiscussed: topics,
  };

  const sessionId = uuidv4();
  getDataCloudWriteService().writeChatSummary(customerId, sessionId, summary).catch((err) => {
    console.error('[datacloud] Failed to write chat summary:', err);
  });
}

function extractTopicsFromMessages(msgs: AgentMessage[]): string[] {
  const allText = msgs.map((m) => m.content.toLowerCase()).join(' ');
  const topics: string[] = [];
  if (allText.includes('turbine') || allText.includes('blade') || allText.includes('nacelle')) topics.push('wind turbines');
  if (allText.includes('solar') || allText.includes('panel') || allText.includes('photovoltaic')) topics.push('solar');
  if (allText.includes('inverter')) topics.push('inverters');
  if (allText.includes('battery') || allText.includes('storage') || allText.includes('megapack')) topics.push('energy storage');
  if (allText.includes('mount') || allText.includes('tracker') || allText.includes('rack')) topics.push('mounting/tracking');
  if (allText.includes('transformer') || allText.includes('combiner')) topics.push('balance of system');
  if (allText.includes('monitor') || allText.includes('scada')) topics.push('monitoring');
  if (allText.includes('order') || allText.includes('track') || allText.includes('shipment')) topics.push('order tracking');
  if (allText.includes('reorder') || allText.includes('replenish')) topics.push('reorder');
  if (allText.includes('quote') || allText.includes('pricing')) topics.push('quote/pricing');
  if (allText.includes('warranty') || allText.includes('maintenance')) topics.push('warranty/service');
  if (allText.includes('certif') || allText.includes('compliance')) topics.push('certifications/compliance');
  if (allText.includes('sustain') || allText.includes('carbon') || allText.includes('clean energy')) topics.push('sustainability');
  return topics.length ? topics : ['general inquiry'];
}

interface ConversationContextValue {
  messages: AgentMessage[];
  isAgentTyping: boolean;
  isLoadingWelcome: boolean;
  suggestedActions: string[];
  sendMessage: (content: string) => Promise<void>;
  clearConversation: () => void;
}

const ConversationContext = createContext<ConversationContextValue | null>(null);

export const ConversationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [isLoadingWelcome, setIsLoadingWelcome] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([
    'Browse solar panels',
    'Show wind turbine components',
    'Request a quote',
  ]);
  const { processUIDirective, resetScene, getSceneSnapshot, restoreSceneSnapshot } = useScene();
  const { customer, selectedPersonaId, identifyByEmail, _isRefreshRef, _onSessionReset } = useCustomer();
  const { showCaptures } = useActivityToast();
  const messagesRef = useRef<AgentMessage[]>([]);
  const suggestedActionsRef = useRef<string[]>([]);
  const prevCustomerIdRef = useRef<string | null>(null);
  const prevPersonaIdRef = useRef<string | null>(null);
  const sessionCacheRef = useRef<Map<string, SessionSnapshot>>(new Map());

  useEffect(() => { messagesRef.current = messages; }, [messages]);
  useEffect(() => { suggestedActionsRef.current = suggestedActions; }, [suggestedActions]);

  useEffect(() => {
    return _onSessionReset((personaId: string) => {
      sessionCacheRef.current.delete(personaId);
      console.log('[session] Cleared cached session for', personaId);
    });
  }, [_onSessionReset]);

  useEffect(() => {
    const prevId = prevCustomerIdRef.current;
    prevCustomerIdRef.current = customer?.id || null;
    if (prevId && prevId !== customer?.id && messagesRef.current.length > 1) {
      writeConversationSummary(prevId, messagesRef.current);
    }
  }, [customer?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveCurrentSession = useCallback((personaId: string) => {
    const client = getAgentforceClient();
    const agentSnap = client.getSessionSnapshot();
    const snapshot: SessionSnapshot = {
      messages: [...messagesRef.current],
      suggestedActions: [...suggestedActionsRef.current],
      sceneSnapshot: getSceneSnapshot(),
      agentSessionId: agentSnap.sessionId,
      agentSequenceId: agentSnap.sequenceId,
      mockSnapshot: useMockData ? getMockAgentSnapshot() : null,
      sessionInitialized,
    };
    sessionCacheRef.current.set(personaId, snapshot);
    console.log('[session] Saved session for', personaId, `(${snapshot.messages.length} messages)`);
  }, [getSceneSnapshot]);

  useEffect(() => {
    if (_isRefreshRef.current) {
      console.log('[session] Profile refresh — keeping conversation intact');
      return;
    }

    const prevPersonaId = prevPersonaIdRef.current;
    prevPersonaIdRef.current = selectedPersonaId;

    if (prevPersonaId && prevPersonaId !== selectedPersonaId && messagesRef.current.length > 0) {
      saveCurrentSession(prevPersonaId);
    }

    if (!customer) {
      resetScene();
      setMessages([]);
      setSuggestedActions(['Browse solar panels', 'Show wind turbine components', 'Request a quote']);
      setIsLoadingWelcome(false);
      return;
    }

    const cached = selectedPersonaId ? sessionCacheRef.current.get(selectedPersonaId) : null;

    if (cached) {
      console.log('[session] Restoring cached session for', selectedPersonaId, `(${cached.messages.length} messages)`);
      setMessages(cached.messages);
      setSuggestedActions(cached.suggestedActions);
      restoreSceneSnapshot(cached.sceneSnapshot);
      setIsLoadingWelcome(false);

      if (useMockData && cached.mockSnapshot) {
        restoreMockAgentSnapshot(cached.mockSnapshot);
      } else if (cached.agentSessionId) {
        getAgentforceClient().restoreSession(cached.agentSessionId, cached.agentSequenceId);
      }
      sessionInitialized = cached.sessionInitialized;
      return;
    }

    const sessionCtx = buildSessionContext(customer);

    if (useMockData) {
      setMockCustomerContext(sessionCtx);
    } else {
      sessionInitialized = false;
    }

    resetScene();
    setMessages([]);
    setSuggestedActions([]);
    setIsLoadingWelcome(true);

    const welcomeMsg = buildWelcomeMessage(sessionCtx);

    const timer = setTimeout(async () => {
      try {
        if (!useMockData) {
          try {
            await getAgentforceClient().initSession(sessionCtx);
            sessionInitialized = true;
          } catch (err) {
            console.error('Failed to init session:', err);
          }
        }
        const response = await getAgentResponse(welcomeMsg);

        if (response.uiDirective && response.uiDirective.action !== 'WELCOME_SCENE') {
          const d = response.uiDirective;
          response.uiDirective = {
            ...d,
            action: 'WELCOME_SCENE' as UIAction,
            payload: {
              ...d.payload,
              welcomeMessage: d.payload?.welcomeMessage || response.message?.split('.')[0] || 'Welcome!',
              welcomeSubtext: d.payload?.welcomeSubtext || response.message || '',
            },
          };
        }

        if (sessionCtx.identityTier !== 'known' && response.uiDirective?.payload) {
          response.uiDirective.payload.sceneContext = {
            ...response.uiDirective.payload.sceneContext,
            setting: 'neutral',
            generateBackground: false,
          };
        }

        const agentMessage: AgentMessage = {
          id: uuidv4(),
          role: 'agent',
          content: response.message,
          timestamp: new Date(),
          uiDirective: response.uiDirective,
        };
        setMessages([agentMessage]);
        let actions = response.suggestedActions || [];
        if (!actions.length && response.uiDirective?.action === 'WELCOME_SCENE') {
          if (sessionCtx.identityTier === 'known' && sessionCtx.recentPurchases?.length) {
            actions = ['Track my orders', 'Reorder equipment', "What's new in solar?", 'Request a quote'];
          } else if (sessionCtx.identityTier === 'appended') {
            actions = ['Browse our catalog', 'See solar panels', 'Request a sample', 'Talk to a rep'];
          } else {
            actions = ['Browse solar panels', 'Show wind turbine components', 'Request a quote'];
          }
        }
        setSuggestedActions(actions);

        if (response.uiDirective?.payload?.captures?.length) {
          showCaptures(response.uiDirective.payload.captures);
        }

        if (response.uiDirective) {
          await processUIDirective(response.uiDirective);
        }
      } catch (error) {
        console.error('Welcome failed:', error);
      } finally {
        setIsLoadingWelcome(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [customer, selectedPersonaId]); // eslint-disable-line react-hooks/exhaustive-deps

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: AgentMessage = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setSuggestedActions([]);
    setIsAgentTyping(true);

    try {
      const response = await getAgentResponse(content);

      if (response.uiDirective?.action === 'WELCOME_SCENE') {
        response.uiDirective = {
          ...response.uiDirective,
          action: (response.uiDirective.payload?.products?.length ? 'SHOW_PRODUCTS' : 'CHANGE_SCENE') as UIAction,
        };
      }

      // Handle IDENTIFY_CUSTOMER directive
      if (response.uiDirective?.action === 'IDENTIFY_CUSTOMER' && response.uiDirective.payload?.customerEmail) {
        await identifyByEmail(response.uiDirective.payload.customerEmail);
      }

      const agentMessage: AgentMessage = {
        id: uuidv4(),
        role: 'agent',
        content: response.message,
        timestamp: new Date(),
        uiDirective: response.uiDirective,
      };
      setMessages((prev) => [...prev, agentMessage]);
      setSuggestedActions(response.suggestedActions || []);
      setIsAgentTyping(false);

      // Process captures for activity toasts
      if (response.uiDirective?.payload?.captures?.length) {
        showCaptures(response.uiDirective.payload.captures);
      }

      if (response.uiDirective && response.uiDirective.action !== 'IDENTIFY_CUSTOMER') {
        await processUIDirective(response.uiDirective);
      }
    } catch (error) {
      console.error('Failed to get agent response:', error);
      const errorMessage: AgentMessage = {
        id: uuidv4(),
        role: 'agent',
        content: "I'm sorry, I encountered an issue. Could you try again?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsAgentTyping(false);
    }
  }, [processUIDirective, identifyByEmail, showCaptures]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setSuggestedActions(['Browse solar panels', 'Show wind turbine components', 'Request a quote']);
  }, []);

  return (
    <ConversationContext.Provider
      value={{ messages, isAgentTyping, isLoadingWelcome, suggestedActions, sendMessage, clearConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export const useConversation = (): ConversationContextValue => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider');
  }
  return context;
};
