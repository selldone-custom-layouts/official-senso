/*
 * Senso — the photo slots: every lifestyle photo the Layout can show, in one
 * place.
 *
 * Each slot has a file name. When `assets/senso/photos/<file>` exists at
 * build time (WebP, JPG or PNG with that base name), the slot shows it;
 * otherwise SensoSlot draws a designed placeholder: a calm tinted panel of
 * the slot's exact shape with a small photo icon and the file name, so the
 * page looks intentional and the owner can see where each photo goes. To
 * add the photos: drop the files in assets/senso/photos/, build, release.
 * No code change.
 *
 * The prompts that make them (for Codex) are in the design folder:
 * digini-design/codex-photos-senso.md.
 *
 * Family slots are named by the family's key (senso-families.ts):
 * hero-tv-display, listing-audio, highlight-cameras…
 *
 * The hero also uses the owner's own wide photos of a category
 * (assets/senso/wide-<category name>.webp) when its family has no hero photo
 * yet.
 */

export interface Slot {
  file: string;
  width: number;
  height: number;
  /** "dark": white words sit on it (a deep teal-ink placeholder); "light": a pale one. */
  tone: "dark" | "light";
  where: string;
}

const FAMILY_KEYS = ["tv-display", "audio", "computing", "cameras", "storage-power"];

export const SLOTS: Record<string, Slot> = {
  ...Object.fromEntries(
    FAMILY_KEYS.map((k) => [`hero-${k}`, { file: `hero-${k}.webp`, width: 2400, height: 1350, tone: "dark", where: "Home hero, the family's slide" }]),
  ),
  "feature-wide": { file: "feature-wide.webp", width: 2400, height: 1000, tone: "dark", where: "Home, FEATURED wide card" },
  "lifestyle-wide": { file: "lifestyle-wide.webp", width: 2400, height: 1000, tone: "dark", where: "Home, LIFESTYLE wide card" },
  ...Object.fromEntries(
    FAMILY_KEYS.map((k) => [`listing-${k}`, { file: `listing-${k}.webp`, width: 1600, height: 900, tone: "dark", where: "Category page banner (its right half), every category of the family" }]),
  ),
  ...Object.fromEntries(
    FAMILY_KEYS.map((k) => [`highlight-${k}`, { file: `highlight-${k}.webp`, width: 1600, height: 1200, tone: "dark", where: "Product page, first Highlights band" }]),
  ),
  "about-hero": { file: "about-hero.webp", width: 2400, height: 1000, tone: "dark", where: "About page banner" },
  "support-hero": { file: "support-hero.webp", width: 2400, height: 800, tone: "dark", where: "Support pages (FAQ, Contact) banner" },
};

const FILES = import.meta.glob("../../assets/senso/photos/*.{webp,jpg,jpeg,png}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const BY_BASE = new Map<string, string>(
  Object.entries(FILES).map(([path, url]) => [path.split("/").pop()!.replace(/\.\w+$/, ""), url]),
);

/** The slot's photo, when its file is in assets/senso/photos/, else null. */
export function slotPhoto(slot: string): string | null {
  const s = SLOTS[slot];
  if (!s) return null;
  return BY_BASE.get(s.file.replace(/\.\w+$/, "")) || null;
}

export function slotOf(slot: string): Slot | null {
  return SLOTS[slot] || null;
}
