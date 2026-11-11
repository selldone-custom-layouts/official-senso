/* The compare page's words and choices in Senso (9 November 2026).
   KalioCompare.vue is the same page in every Layout built from Molino; this
   file and the Senso dress at the end of style/senso-pages.scss make it
   this Layout's own: picks pinned at the top as white cards, differing rows
   marked by a dot and bold values, one Only differences switch, a teal
   share card. The words are getters, so they follow the visitor's language. */
import { t } from "../i18n/kalio-i18n";

export const SKIN = {
  /** The page's heading (and the tab's title). */
  get title(): string {
    return t("senso.compare.title", "Compare products");
  },
  /** A small line over the heading, or none. */
  get eyebrow(): string | null {
    return t("senso.compare.eyebrow", "Side by side");
  },
  /** Under "Your picks", beside the pinned cards. */
  get hint(): string {
    return t("senso.compare.hint", "They stay at the top while you scroll. Remove one with ×.");
  },
  /** "switch": one Only differences switch; "segmented": Everything / Only differences. */
  toggle: "switch" as "switch" | "segmented",
  get emptyTitle(): string {
    return t("compare.empty.title", "Nothing to compare yet");
  },
  get browse(): string {
    return t("senso.compare.empty.browse", "Shop all categories");
  },
  get shareTitle(): string {
    return t("compare.shareTitle", "Share this comparison");
  },
  /** The Layout's mark in the share card and on the empty page (else an icon). */
  mark: true,
  /** Number the groups 01, 02, … */
  numbered: false,
};
