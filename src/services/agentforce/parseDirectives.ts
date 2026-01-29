import type { UIDirective, UIAction } from '@/types/agent';
import type { RawAgentResponse } from './types';

export function parseUIDirective(response: RawAgentResponse): UIDirective | undefined {
  if (response.metadata?.uiDirective) {
    return {
      action: response.metadata.uiDirective.action as UIAction,
      payload: response.metadata.uiDirective.payload as UIDirective['payload'],
    };
  }

  const jsonMatch = response.rawText?.match(/\{[\s\S]*"uiDirective"[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.uiDirective) {
        return {
          action: parsed.uiDirective.action as UIAction,
          payload: parsed.uiDirective.payload,
        };
      }
    } catch {
      // JSON parsing failed, no directive
    }
  }

  return undefined;
}
