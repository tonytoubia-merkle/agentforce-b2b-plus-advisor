export interface AgentforceConfig {
  baseUrl: string;
  agentId: string;
  accessToken: string;
}

export interface RawAgentResponse {
  message: string;
  metadata?: {
    uiDirective?: {
      action: string;
      payload: Record<string, unknown>;
    };
  };
  rawText?: string;
}
