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
 * To rename a family or change its line, edit FAMILIES (and the words in
 * components/kalio/i18n/senso.<lang>.ts).
 */
import { t } from "../kalio/i18n/kalio-i18n";

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

/* The words are getters, so they follow a language change (computed when
   drawn, not at import time); the keys and the matching words never change. */
export const FAMILIES: FamilyRule[] = [
  {
    key: "tv-display",
    get title() {
      return t("senso.family.tvDisplay.title", "TV & Display");
    },
    get line() {
      return t("senso.family.tvDisplay.line", "Made to be seen.");
    },
    get story() {
      return { heading: t("senso.family.tvDisplay.heading", "Screens for every room"), text: t("senso.family.tvDisplay.text", "Big, bright pictures for movie nights, match days and long workdays.") };
    },
    match: /\btvs?\b|television|monitor|display|projector|screen/,
  },
  {
    key: "audio",
    get title() {
      return t("senso.family.audio.title", "Audio");
    },
    get line() {
      return t("senso.family.audio.line", "Made to be heard.");
    },
    get story() {
      return { heading: t("senso.family.audio.heading", "Sound that goes with you"), text: t("senso.family.audio.text", "Listening and recording gear for music, calls and everything in between.") };
    },
    match: /head[\s-]?phone|headset|ear[\s-]?bud|earphone|micro[\s-]?phone|\bmics?\b|speaker|sound|audio/,
  },
  {
    key: "computing",
    get title() {
      return t("senso.family.computing.title", "Computing");
    },
    get line() {
      return t("senso.family.computing.line", "Made to keep up.");
    },
    get story() {
      return { heading: t("senso.family.computing.heading", "Your desk, upgraded"), text: t("senso.family.computing.text", "Machines and accessories that keep up, from the first email to the last match.") };
    },
    match: /laptop|notebook|computer|keyboard|\bmouse\b|\bmice\b|printer|scanner|tablet|\bpcs?\b/,
  },
  {
    key: "cameras",
    get title() {
      return t("senso.family.cameras.title", "Cameras");
    },
    get line() {
      return t("senso.family.cameras.line", "Made to capture it all.");
    },
    get story() {
      return { heading: t("senso.family.cameras.heading", "Moments, kept"), text: t("senso.family.cameras.text", "Cameras for trips, weekends and everything you want to remember.") };
    },
    match: /camera|lens|drone|dslr|mirrorless/,
  },
  {
    key: "storage-power",
    get title() {
      return t("senso.family.storagePower.title", "Storage & Power");
    },
    get line() {
      return t("senso.family.storagePower.line", "Made to keep going.");
    },
    get story() {
      return { heading: t("senso.family.storagePower.heading", "Space and power to spare"), text: t("senso.family.storagePower.text", "Drives and batteries that keep your files safe and your devices going.") };
    },
    match: /drive|storage|\bssd\b|\bhdd\b|flash|usb|memory|power|battery|charger|\brv\b|generator/,
  },
];

const MORE: FamilyRule = {
  key: "more",
  get title() {
    return t("senso.family.more.title", "More");
  },
  get line() {
    return t("senso.family.more.line", "Made for every day.");
  },
  get story() {
    return { heading: t("senso.family.more.heading", "Picked for every day"), text: t("senso.family.more.text", "Explore the range, one category at a time.") };
  },
  match: /$^/,
};

export interface Family extends FamilyRule {
  categories: any[];
  /** A "More" family named after its one category (a shop no family fits): the title is data. */
  named?: boolean;
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
    const own = cats.slice(0, 4).map((c: any) => ({ ...MORE, key: "more", title: c.title || c.name, categories: [c], named: true }));
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

/** A family's words by its key, read when drawn so they follow a language
 *  change (a component that keeps a family's title in its data would keep
 *  the language it was built in). */
export function familyRule(key: string): FamilyRule | null {
  return [...FAMILIES, MORE].find((f) => f.key === key) || null;
}
