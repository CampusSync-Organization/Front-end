const DICEBEAR_BASE = "https://api.dicebear.com/9.x";
const DEFAULT_STYLE = "lorelei";

/**
 * Returns a DiceBear avatar URL (SVG) for the given seed.
 * Uses the public DiceBear HTTP API - no backend required.
 */
export function getAvatarUrl(seed: string): string {
  const params = new URLSearchParams({ seed });
  return `${DICEBEAR_BASE}/${DEFAULT_STYLE}/svg?${params.toString()}`;
}
