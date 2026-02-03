import type { SceneSetting } from '@/types/scene';

export const SCENE_PROMPTS: Record<SceneSetting, string> = {
  neutral:
    'Clean modern workspace with soft ambient lighting, neutral gray and white tones, professional atmosphere, empty surface',

  warehouse:
    'Modern distribution warehouse interior with tall metal shelving, clean concrete floors, overhead LED lighting, organized pallets in the background, empty foreground surface',

  factory:
    'Clean modern manufacturing floor with injection molding machines in the background, bright industrial lighting, organized production environment, empty foreground',

  lab:
    'Modern materials testing laboratory with white surfaces, analytical instruments in the background, bright even lighting, clean scientific environment',

  office:
    'Minimalist modern office with large window, natural daylight, clean desk surface with a small plant, calm productive atmosphere',

  'loading-dock':
    'Commercial loading dock with semi-trailer backed up, organized pallets, bright daylight from the open bay door, industrial distribution setting',

  cleanroom:
    'ISO cleanroom interior with white walls and ceiling, HEPA filtration units visible, bright sterile lighting, gowning area in the background',

  'production-floor':
    'Active production floor with extrusion lines in the background, overhead cranes, organized material bins, industrial lighting',

  conference:
    'Modern corporate conference room with glass walls, large screen on the wall, clean table surface, professional business setting',
};

export function buildScenePrompt(setting: SceneSetting): string {
  const base = SCENE_PROMPTS[setting];
  return `${base}. Empty background scene only, no products, no people, no text or labels. Professional industrial photography, clean and organized, soft diffused shadows, ultra high quality, photorealistic.`;
}

/**
 * Prompts for generating a product image on a pure white background.
 * The white background is then removed via CSS mix-blend-mode: multiply,
 * allowing the product to composite onto the scene background.
 */
export const STAGING_PROMPTS: Record<SceneSetting, string> = {
  neutral:
    'A single plastic resin pellet sample or material package, soft studio lighting from above and side, subtle shadow beneath',

  warehouse:
    'A single bag or box of plastic resin pellets, clean studio lighting, industrial product photography',

  factory:
    'A single container of engineering resin material, bright even studio lighting, crisp industrial product shot',

  lab:
    'A single sample container of polymer material, bright clean laboratory lighting, scientific product photography',

  office:
    'A single product specification sheet or material sample, clean natural daylight, professional product shot',

  'loading-dock':
    'A single pallet of bagged resin material, clean studio lighting, distribution product photography',

  cleanroom:
    'A single sealed container of high-purity polymer material, bright sterile lighting, cleanroom product photography',

  'production-floor':
    'A single gaylord box of resin pellets, bright industrial lighting, production material photography',

  conference:
    'A single material sample set or product brochure, clean professional lighting, business product photography',
};

export function buildStagingPrompt(setting: SceneSetting): string {
  const base = STAGING_PROMPTS[setting];
  return `${base}. Product centered on a perfectly pure white background. No other objects, no surface, no scene, no environment — ONLY the product on solid white. Professional e-commerce product photography, ultra high quality, photorealistic. No text, no labels, no logos.`;
}
