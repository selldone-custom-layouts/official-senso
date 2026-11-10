/*
 * Senso — the theme switcher's config (the header's "Theme" button: the
 * owner's rule of 9 November 2026, palettes + Custom colour + Light / Dark,
 * shown only on the showcase shops).
 *
 * The switcher itself is Layout-agnostic (components/theme-switcher/); this
 * file is everything Senso-specific: the palettes, which Senso and Kalio
 * variables each palette value feeds, the dark token set, and Vuetify's dark
 * surfaces. storefront.ts calls bootThemeSwitcher(SENSO_THEME, vuetify)
 * before mounting, so the chosen theme paints first, with no flash.
 *
 * Contrast (WCAG 2.1, measured): white on each light primary — teal 5.70,
 * ocean 6.29, violet 6.45, forest 6.42, ember 5.85; each light primary as
 * text on the pale mint tile 5.27 or more. White on each dark primary
 * (buttons on the dark card #132326, where each primary is 3:1 or more
 * against the card) — 4.61, 5.30, 5.24, 5.10, 5.24; each dark "text" on the
 * dark card — 9.28, 8.30, 8.45, 9.92, 9.37.
 * Senso's header is white (or clear over the hero), never painted with the
 * brand, so no band carries translucent white words on the primary.
 * "deco" is the decoration colour (line icons, the wordmark's mark, rings);
 * "mint" is the pale tile behind packshots, light in both modes.
 */
import type { ThemeSwitcherConfig } from "../theme-switcher/theme-switcher";
import { THEME_SETTINGS } from "./senso-theme.settings";

/** #rrggbb mixed toward white (t = share of white). */
function tint(hex: string, t: number): string {
  const h = hex.replace("#", "");
  return (
    "#" +
    [0, 2, 4]
      .map((i) => {
        const v = parseInt(h.substr(i, 2), 16);
        return Math.round(v + (255 - v) * t)
          .toString(16)
          .padStart(2, "0");
      })
      .join("")
  );
}

export const SENSO_THEME: ThemeSwitcherConfig = {
  /* The merchant's choice (palette or brand colour, light or dark, whether
     visitors get the switcher): senso-theme.settings.ts, the one file to edit. */
  settings: THEME_SETTINGS,

  /* The owner (9 November 2026): a merchant who imports Senso into their own
     shop must not see the switcher. With themeSwitcher "showcase" it shows
     only on these shops; the shop is told by window.shop.id, else
     <meta name="shop-name">. */
  showcaseShops: [
    { id: 15549, name: "digini-hzgablru" }, // Digini: Digito, Besti, Argon, Senso
    { id: 15645, name: "molino" }, // Molino: Molino, Tario, Walio, Dino, Valero
  ],

  storageKey: "senso-theme",
  darkClass: "sn-dark",

  palettes: [
    {
      id: "teal",
      name: "Senso teal",
      light: { primary: "#00736f", deep: "#005a57", soft: "#e1f4f3", onPrimary: "#ffffff", text: "#00736f", deco: "#00a3a1", mint: "#eef8f8" },
      dark: { primary: "#008380", deep: "#006b68", soft: "#12322f", onPrimary: "#ffffff", text: "#5fd6d1", deco: "#3cc6c2", mint: "#eef8f8" },
    },
    {
      id: "ocean",
      name: "Ocean blue",
      light: { primary: "#1a5fb4", deep: "#134a8e", soft: "#e6effa", onPrimary: "#ffffff", text: "#1a5fb4", deco: "#3b8ee0", mint: "#eef4fb" },
      dark: { primary: "#2c6cba", deep: "#22599c", soft: "#14263f", onPrimary: "#ffffff", text: "#8cbcff", deco: "#6aa8ee", mint: "#eef4fb" },
    },
    {
      id: "violet",
      name: "Violet",
      light: { primary: "#6b3fd1", deep: "#5530ab", soft: "#efe9fc", onPrimary: "#ffffff", text: "#6b3fd1", deco: "#8f6cf0", mint: "#f3f0fd" },
      dark: { primary: "#7a52d6", deep: "#6540c0", soft: "#241c40", onPrimary: "#ffffff", text: "#c2b0ff", deco: "#a58cf5", mint: "#f3f0fd" },
    },
    {
      id: "forest",
      name: "Forest",
      light: { primary: "#2e6b34", deep: "#235229", soft: "#e5f2e6", onPrimary: "#ffffff", text: "#2e6b34", deco: "#4f9a57", mint: "#eff6ef" },
      dark: { primary: "#437a48", deep: "#36653a", soft: "#17301a", onPrimary: "#ffffff", text: "#8fdc98", deco: "#6dbb75", mint: "#eff6ef" },
    },
    {
      id: "ember",
      name: "Ember",
      light: { primary: "#ad4314", deep: "#8a3510", soft: "#fbeae2", onPrimary: "#ffffff", text: "#ad4314", deco: "#e0773f", mint: "#fcf1ec" },
      dark: { primary: "#b24e22", deep: "#94401b", soft: "#3a2015", onPrimary: "#ffffff", text: "#ffb48a", deco: "#f08f5a", mint: "#fcf1ec" },
    },
  ],

  /* Palette value -> the variables that carry it. Senso's own (--sn-*) and
     the Kalio base's (--k-green* is Kalio's name for the action colour). */
  tokens: {
    "--sn-brand": "primary",
    "--sn-brand-d": "deep",
    "--sn-brand-l": "soft",
    "--sn-link": "text",
    "--sn-link-d": "deep",
    "--sn-head": "light.primary",
    "--sn-pop": "light.mint",
    "--sn-deco": "deco",
    "--sn-mint": "light.mint",
    "--sn-primary-rgb": "primary:rgb",
    "--k-green": "primary",
    "--k-green-deep": "primary",
    "--k-green-hover": "deep",
    "--k-green-lift": "primary",
    "--k-leaf": "primary",
    "--k-green-soft": "soft",
    "--k-on-green": "onPrimary",
    "--sn-on-brand": "onPrimary",
    "--sn-on-brand-rgb": "onPrimary:rgb",
  },

  /* While dark. Photo wells (--k-well, --k-tint, --sn-mint, --sn-well) stay
     light so a white packshot keeps its edge hidden; the sale red lightens
     for text (--sn-red-solid stays #c4122f for badges with white words). */
  dark: {
    "--sn-link-d": "#e6efef",
    "--sn-page": "#0b1618",
    "--sn-ground": "#0b1618",
    "--sn-foot": "#0f1d1f",
    "--sn-skel-a": "#1a2c2f",
    "--sn-skel-b": "#243a3d",
    "--sn-card": "#132326",
    "--sn-line": "#263b3e",
    "--sn-line-2": "#33494c",
    "--sn-ink": "#e6efef",
    "--sn-muted": "#9db0b2",
    "--sn-soft": "#93a7a9",
    "--sn-red": "#ff7084",
    "--sn-green": "#4ade80",
    "--sn-raise": "#1a2c2f",
    "--sn-ink-bg": "var(--sn-brand)",
    "--sn-on-ink-bg": "var(--sn-on-brand)",
    "--sn-navy-ink": "#c9d6d7",
    "--sn-night": "#06100f",
    "--k-ink": "#e6efef",
    "--k-ink-2": "#d1dddd",
    "--k-muted": "#9db0b2",
    "--k-paper": "#0b1618",
    "--k-wash": "#1a2c2f",
    "--k-card": "#132326",
    "--k-plain": "#1a2c2f",
    "--k-line": "#263b3e",
    "--k-line-strong": "#6c8285",
    "--k-line-soft": "#1f3134",
    "--k-coral": "#ff7084",
    "--k-coral-soft": "#3d1a22",
    "--k-amber": "#fbbf24",
    "--k-star-off": "#6c8285",
    "--k-shadow": "0 10px 28px -14px rgba(0, 0, 0, 0.7)",
  },

  vuetify: {
    light: "light",
    dark: "dark",
    paletteColors: { primary: "primary", "on-primary": "onPrimary" },
    darkColors: {
      background: "#0b1618",
      surface: "#132326",
      "surface-bright": "#1a2c2f",
      "surface-variant": "#263b3e",
      "on-background": "#e6efef",
      "on-surface": "#e6efef",
      "on-surface-variant": "#c9d6d7",
      "on-primary": "#ffffff",
      secondary: "#e6efef",
      "on-secondary": "#0b1618",
      error: "#ff7084",
      info: "#7ab8ff",
      success: "#4ade80",
      warning: "#fbbf24",
    },
  },

  metaThemeColor: "light.primary",
  ui: { ink: "var(--sn-ink)", muted: "var(--sn-muted)", line: "var(--sn-line)", surface: "var(--sn-card)", font: "var(--sn-font)" },
  labels: { theme: "Theme", palettes: "Colour", mode: "Light or dark", modeTitle: "Mode", light: "Light", dark: "Dark", custom: "Custom colour", adjusted: "Adjusted for readability", brand: "Brand colour" },

  /* "Custom colour" (the owner, 9 November 2026): any colour, made readable
     by paletteFromColor(). Senso's header is white, so white on the light
     primary needs 4.5:1; 5.5 keeps a margin for the pills on the mint tiles. */
  custom: {
    headerContrast: 5.5,
    lightSurfaces: ["#ffffff", "#f3f5f5", "#eef8f8"],
    darkSurfaces: ["#0b1618", "#132326", "#1a2c2f"],
    darkText: "#0d1b1e",
    /* The decoration colour and the pale tile, from the pick. */
    extras: (v) => ({ deco: v.primary, mint: tint(v.primary.length === 7 ? v.primary : "#00736f", 0.93) }),
  },
};
