/* The compare page's words and choices in Senso (9 November 2026).
   KalioCompare.vue is the same page in every Layout built from Molino; this
   file and the Senso dress at the end of style/senso-pages.scss make it
   this Layout's own: picks pinned at the top as white cards, differing rows
   marked by a dot and bold values, one Only differences switch, a teal
   share card. */
export const SKIN = {
  /** The page's heading (and the tab's title). */
  title: "Compare products",
  /** A small line over the heading, or none. */
  eyebrow: "Side by side" as string | null,
  /** Under "Your picks", beside the pinned cards. */
  hint: "They stay at the top while you scroll. Remove one with ×.",
  /** "switch": one Only differences switch; "segmented": Everything / Only differences. */
  toggle: "switch" as "switch" | "segmented",
  emptyTitle: "Nothing to compare yet",
  browse: "Shop all categories",
  shareTitle: "Share this comparison",
  /** The Layout's mark in the share card and on the empty page (else an icon). */
  mark: true,
  /** Number the groups 01, 02, … */
  numbered: false,
};
