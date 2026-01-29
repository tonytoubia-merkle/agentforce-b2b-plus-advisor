import type { AgentResponse } from '@/types/agent';
import type { AgentforceConfig } from './types';
import { parseUIDirective } from './parseDirectives';

export class AgentforceClient {
  private config: AgentforceConfig;
  private sessionId: string | null = null;

  constructor(config: AgentforceConfig) {
    this.config = config;
  }

  async initSession(customerId?: string): Promise<string> {
    const response = await fetch(`${this.config.baseUrl}/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId: this.config.agentId,
        context: { customerId, channel: 'web', platform: 'agentic-commerce-demo' },
      }),
    });

    const data = await response.json();
    this.sessionId = data.sessionId;
    return this.sessionId!;
  }

  async sendMessage(message: string): Promise<AgentResponse> {
    if (!this.sessionId) {
      throw new Error('Session not initialized. Call initSession() first.');
    }

    const response = await fetch(
      `${this.config.baseUrl}/sessions/${this.sessionId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, requestUIDirective: true }),
      }
    );

    const data = await response.json();
    const uiDirective = parseUIDirective(data);

    return {
      sessionId: this.sessionId,
      message: data.message,
      uiDirective,
      suggestedActions: data.suggestedActions || [],
      confidence: data.confidence || 1,
    };
  }

  async endSession(): Promise<void> {
    if (this.sessionId) {
      await fetch(`${this.config.baseUrl}/sessions/${this.sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${this.config.accessToken}` },
      });
      this.sessionId = null;
    }
  }
}

let agentforceClient: AgentforceClient | null = null;

export const getAgentforceClient = (): AgentforceClient => {
  if (!agentforceClient) {
    agentforceClient = new AgentforceClient({
      baseUrl: import.meta.env.VITE_AGENTFORCE_BASE_URL || '',
      agentId: import.meta.env.VITE_AGENTFORCE_AGENT_ID || '',
      accessToken: import.meta.env.VITE_AGENTFORCE_ACCESS_TOKEN || '',
    });
  }
  return agentforceClient;
};
