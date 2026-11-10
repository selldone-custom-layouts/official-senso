/*
 * Senso — product families, built from the shop's live categories.
 *
 * A brand site groups its range into a few families ("TV & Display",
 * "Audio"…); the header's nav, its mega panels, the hero's slides, the
 * phone menu's accordions, the footer's first column and the photo slots
 * all use them. A category joins the first family whose words match its own
 * name or title, so a new category ("Projectors", "Soundbars") finds its
 * family with no code change, and a category no family claims goes to
 * "More". A family with no category is not shown. Nothing here names a
 * category id: a cloned shop's categories are sorted the same way.
 *
 * To rename a family or change its line, edit FAMILIES.
 */

export interface FamilyRule {
  /** Used in photo slot names (hero-<key>, listing-<key>, highlight-<key>). */
  key: string;
  title: string;
  /** The hero's second line: "<Category>. <line>" */
  line: string;
  /** The home's wide image card when it tells this family's story. */
  story: { heading: string; text: string };
  match: RegExp;
}

export const FAMILIES: FamilyRule[] = [
  { key: "tv-display", title: "TV & Display", line: "Made to be seen.", story: { heading: "Screens for every room", text: "Big, bright pictures for movie nights, match days and long workdays." }, match: /\btvs?\b|television|monitor|display|projector|screen/ },
  { key: "audio", title: "Audio", line: "Made to be heard.", story: { heading: "Sound that goes with you", text: "Listening and recording gear for music, calls and everything in between." }, match: /head[\s-]?phone|headset|ear[\s-]?bud|earphone|micro[\s-]?phone|\bmics?\b|speaker|sound|audio/ },
  { key: "computing", title: "Computing", line: "Made to keep up.", story: { heading: "Your desk, upgraded", text: "Machines and accessories that keep up, from the first email to the last match." }, match: /laptop|notebook|computer|keyboard|\bmouse\b|\bmice\b|printer|scanner|tablet|\bpcs?\b/ },
  { key: "cameras", title: "Cameras", line: "Made to capture it all.", story: { heading: "Moments, kept", text: "Cameras for trips, weekends and everything you want to remember." }, match: /camera|lens|drone|dslr|mirrorless/ },
  { key: "storage-power", title: "Storage & Power", line: "Made to keep going.", story: { heading: "Space and power to spare", text: "Drives and batteries that keep your files safe and your devices going." }, match: /drive|storage|\bssd\b|\bhdd\b|flash|usb|memory|power|battery|charger|\brv\b|generator/ },
];

const MORE: FamilyRule = { key: "more", title: "More", line: "Made for every day.", story: { heading: "Picked for every day", text: "Explore the range, one category at a time." }, match: /$^/ };

export interface Family extends FamilyRule {
  categories: any[];
}

/** The families in use, in FAMILIES order, each with its categories (in the shop's order). */
export function familiesOf(categories: any[]): Family[] {
  const out: Family[] = [...FAMILIES, MORE].map((f) => ({ ...f, categories: [] as any[] }));
  for (const c of categories || []) {
    const text = `${c?.name || ""} ${c?.title || ""}`.toLowerCase().replace(/[_-]+/g, " ");
    const fam = out.find((f) => f.match.test(text)) || out[out.length - 1];
    fam.categories.push(c);
  }
  /* A shop none of whose categories fit (a cloned shop in another trade):
     one family per category, up to five, and "More" for the rest. */
  const used = out.filter((f) => f.categories.length);
  if (used.length === 1 && used[0].key === "more" && used[0].categories.length > 1) {
    const cats = used[0].categories;
    const own = cats.slice(0, 4).map((c: any) => ({ ...MORE, key: "more", title: c.title || c.name, categories: [c] }));
    const rest = cats.slice(4);
    return rest.length ? [...own, { ...MORE, categories: rest }] : own;
  }
  return used;
}

/** The family a category belongs to. */
export function familyOf(category: any, families: Family[]): Family | null {
  if (!category) return null;
  return families.find((f) => f.categories.some((c) => c.id === category.id)) || null;
}
