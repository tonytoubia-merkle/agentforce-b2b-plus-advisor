import type { SceneSetting } from '@/types/scene';

export interface PreseededAsset {
  setting: SceneSetting;
  variant: string;
  path: string;
  tags: string[];
}

/**
 * Pre-seeded background images for B2B industrial settings.
 * For the B2B materials distribution use-case, backgrounds are
 * deliberately minimal — mostly clean gradients are preferred.
 * These exist as fallbacks but the app primarily uses gradient mode.
 */
export const PRESEEDED_BACKGROUNDS: PreseededAsset[] = [
  // Neutral (default professional)
  { setting: 'neutral', variant: '1', path: '/assets/backgrounds/neutral-1.jpg', tags: ['scene-neutral'] },
  { setting: 'neutral', variant: '2', path: '/assets/backgrounds/neutral-2.jpg', tags: ['scene-neutral'] },
  { setting: 'neutral', variant: '3', path: '/assets/backgrounds/neutral-3.jpg', tags: ['scene-neutral'] },

  // Office
  { setting: 'office', variant: '1', path: '/assets/backgrounds/office-1.jpg', tags: ['scene-office'] },

  // Warehouse
  { setting: 'warehouse', variant: '1', path: '/assets/backgrounds/warehouse-1.jpg', tags: ['scene-warehouse'] },

  // Factory / Production floor
  { setting: 'factory', variant: '1', path: '/assets/backgrounds/factory-1.jpg', tags: ['scene-factory'] },
  { setting: 'production-floor', variant: '1', path: '/assets/backgrounds/factory-1.jpg', tags: ['scene-production-floor'] },
];

/** Track last used variant per setting to avoid repeats. */
const lastUsed: Record<string, string> = {};

export function pickRandom(setting: SceneSetting): PreseededAsset | null {
  const candidates = PRESEEDED_BACKGROUNDS.filter((a) => a.setting === setting);
  if (candidates.length === 0) return null;

  const last = lastUsed[setting];
  const pool = candidates.length > 1
    ? candidates.filter((a) => a.variant !== last)
    : candidates;

  const pick = pool[Math.floor(Math.random() * pool.length)];
  lastUsed[setting] = pick.variant;
  return pick;
}

export function findPreseeded(setting: SceneSetting, variant?: string): PreseededAsset | null {
  if (!variant) return pickRandom(setting);
  return PRESEEDED_BACKGROUNDS.find(
    (a) => a.setting === setting && a.variant === variant
  ) || null;
}

export async function preseededExists(asset: PreseededAsset): Promise<boolean> {
  try {
    const resp = await fetch(asset.path, { method: 'HEAD' });
    if (!resp.ok) return false;
    const ct = resp.headers.get('content-type') || '';
    return ct.startsWith('image/');
  } catch {
    return false;
  }
}
