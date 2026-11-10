/*
 * Senso — one set of thin line icons (24 grid, 1.6 stroke, round caps),
 * drawn for Senso, and one line icon per kind of product (48 grid) for the
 * category tiles. SensoIcon draws these by the Material Symbols names the
 * components use; a name not here falls back to the Material Symbols font
 * (kalio-fonts.ts), so nothing ever shows blank.
 *
 * Category icons are picked by the category's own name and title (any
 * shop's "TVs", "Televisions" or "tv" get the screen), never by id, so a
 * cloned shop's categories find their icon too; an unknown kind gets the
 * generic device.
 */

const UI: Record<string, string> = {
  search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
  palette:
    '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.15 0 1.8-.8 1.8-1.7 0-.45-.17-.86-.47-1.18-.3-.33-.48-.74-.48-1.2 0-.95.77-1.72 1.72-1.72h2.07a3.86 3.86 0 0 0 3.86-3.86C20.5 6.98 16.7 3.5 12 3.5z"/><circle cx="7.6" cy="11.4" r="1.05"/><circle cx="10.2" cy="7.6" r="1.05"/><circle cx="14.8" cy="7.9" r="1.05"/>',
  shopping_cart: '<path d="M5 8.5h14l-1.15 10.6a2 2 0 0 1-2 1.8H8.15a2 2 0 0 1-2-1.8z"/><path d="M9 8.5V7.2a3 3 0 0 1 6 0v1.3"/>',
  add_shopping_cart: '<path d="M5 8.5h14l-1.15 10.6a2 2 0 0 1-2 1.8H8.15a2 2 0 0 1-2-1.8z"/><path d="M9 8.5V7.2a3 3 0 0 1 6 0v1.3M12 11.8v5.4M9.3 14.5h5.4"/>',
  person: '<circle cx="12" cy="8.3" r="3.9"/><path d="M4.6 20.2a7.4 7.4 0 0 1 14.8 0"/>',
  account_circle: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="10" r="3"/><path d="M6.6 18.4a6.2 6.2 0 0 1 10.8 0"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h11"/>',
  chevron_left: '<path d="M14.5 5.5L8 12l6.5 6.5"/>',
  chevron_right: '<path d="M9.5 5.5L16 12l-6.5 6.5"/>',
  expand_more: '<path d="M6 9.5l6 6 6-6"/>',
  expand_less: '<path d="M6 14.5l6-6 6 6"/>',
  arrow_forward: '<path d="M5 12h14M13.5 6.5L19 12l-5.5 5.5"/>',
  arrow_back: '<path d="M19 12H5M10.5 6.5L5 12l5.5 5.5"/>',
  favorite: '<path d="M12 19.6s-7.4-4.5-7.4-9.9A4.3 4.3 0 0 1 12 7.1a4.3 4.3 0 0 1 7.4 2.6c0 5.4-7.4 9.9-7.4 9.9z"/>',
  photo: '<rect x="3.5" y="5" width="17" height="14" rx="2.6"/><circle cx="9" cy="10" r="1.6"/><path d="M4.2 17.2l4.8-4.3 3.4 2.9 3-2.5 4.4 3.9"/>',
  check: '<path d="M5.5 12.5l4.2 4.2L18.5 8"/>',
  check_circle: '<circle cx="12" cy="12" r="8.5"/><path d="M8.2 12.3l2.6 2.6 5-5.2"/>',
  close: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
  tune: '<path d="M4 7.5h9.5M17.5 7.5H20M4 16.5h3.5M11.5 16.5H20"/><circle cx="15.5" cy="7.5" r="2"/><circle cx="9.5" cy="16.5" r="2"/>',
  filter_list: '<path d="M4 7.5h9.5M17.5 7.5H20M4 16.5h3.5M11.5 16.5H20"/><circle cx="15.5" cy="7.5" r="2"/><circle cx="9.5" cy="16.5" r="2"/>',
  compare_arrows: '<path d="M4.5 8.5h13l-3.2-3.2M19.5 15.5h-13l3.2 3.2"/>',
  schedule: '<circle cx="12" cy="12" r="8"/><path d="M12 7.8v4.5l2.9 1.8"/>',
  public: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.5 3.4 5.4 3.4 8.5s-1 6-3.4 8.5c-2.4-2.5-3.4-5.4-3.4-8.5s1-6 3.4-8.5z"/>',
  light_mode: '<circle cx="12" cy="12" r="3.8"/><path d="M12 3.5v1.6M12 18.9v1.6M3.5 12h1.6M18.9 12h1.6M6 6l1.1 1.1M16.9 16.9L18 18M6 18l1.1-1.1M16.9 7.1L18 6"/>',
  dark_mode: '<path d="M19.5 14.6A7.6 7.6 0 0 1 9.4 4.5a7.6 7.6 0 1 0 10.1 10.1z"/>',
  package_2: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  inventory_2: '<path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>',
  verified: '<path d="M12 3.8l6.8 2.6v5.2c0 4.3-2.9 7.3-6.8 8.6-3.9-1.3-6.8-4.3-6.8-8.6V6.4z"/><path d="M9 12l2.2 2.2L15.3 10"/>',
  help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 0 1 4.9.6c0 1.7-2.5 2.2-2.5 3.7"/><path d="M12 16.6v.1"/>',
  support_agent: '<path d="M5 13v-1.5a7 7 0 0 1 14 0V13"/><rect x="3.8" y="12.2" width="3.6" height="5.6" rx="1.6"/><rect x="16.6" y="12.2" width="3.6" height="5.6" rx="1.6"/><path d="M18.4 17.8c0 1.6-1.6 2.7-4.2 2.7h-1.4"/>',
  local_shipping: '<path d="M3.5 7h10v9.5h-10zM13.5 10.5h3.6l3.4 3.2v2.8h-7z"/><circle cx="7.2" cy="17.4" r="1.7"/><circle cx="16.8" cy="17.4" r="1.7"/>',
  assignment_return: '<path d="M9 7.5H5.5V11"/><path d="M5.8 10.8A7 7 0 1 1 6 15.6"/>',
  receipt_long: '<path d="M6.5 3.8h11v16.4l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.3-1.5z"/><path d="M9.3 8.5h5.4M9.3 12h5.4M9.3 15.5h3"/>',
  mail: '<rect x="3.5" y="6" width="17" height="12.5" rx="2.4"/><path d="M4.5 7.5l7.5 5.6 7.5-5.6"/>',
  local_offer: '<path d="M12.6 3.9h6.2a1.3 1.3 0 0 1 1.3 1.3v6.2a1.6 1.6 0 0 1-.47 1.13l-7.4 7.4a1.6 1.6 0 0 1-2.26 0l-5.17-5.17a1.6 1.6 0 0 1 0-2.26l7.4-7.4a1.6 1.6 0 0 1 1.13-.47z"/><circle cx="16" cy="8" r="1.3"/>',
  sell: '<path d="M12.6 3.9h6.2a1.3 1.3 0 0 1 1.3 1.3v6.2a1.6 1.6 0 0 1-.47 1.13l-7.4 7.4a1.6 1.6 0 0 1-2.26 0l-5.17-5.17a1.6 1.6 0 0 1 0-2.26l7.4-7.4a1.6 1.6 0 0 1 1.13-.47z"/><circle cx="16" cy="8" r="1.3"/>',
  bolt: '<path d="M13.2 3.5L6.5 13.2h5.2L10.8 20.5l6.7-9.7h-5.2z"/>',
  new_releases: '<path d="M12 3.5l2.2 2 2.9-.4.6 2.9 2.6 1.4-1.3 2.6 1.3 2.6-2.6 1.4-.6 2.9-2.9-.4-2.2 2-2.2-2-2.9.4-.6-2.9-2.6-1.4 1.3-2.6-1.3-2.6 2.6-1.4.6-2.9 2.9.4z"/><path d="M9.4 12.2l1.8 1.8 3.5-3.6"/>',
  apps: '<rect x="4.5" y="4.5" width="6" height="6" rx="1.6"/><rect x="13.5" y="4.5" width="6" height="6" rx="1.6"/><rect x="4.5" y="13.5" width="6" height="6" rx="1.6"/><rect x="13.5" y="13.5" width="6" height="6" rx="1.6"/>',
  share: '<circle cx="17.5" cy="6" r="2.4"/><circle cx="6.5" cy="12" r="2.4"/><circle cx="17.5" cy="18" r="2.4"/><path d="M8.6 10.8l6.8-3.6M8.6 13.2l6.8 3.6"/>',
  add: '<path d="M12 5.5v13M5.5 12h13"/>',
  remove: '<path d="M5.5 12h13"/>',
  delete: '<path d="M5 7h14M9.5 7V5.3h5V7M7 7l.9 12.2a1.5 1.5 0 0 0 1.5 1.3h5.2a1.5 1.5 0 0 0 1.5-1.3L17 7M10.3 10.5v6.5M13.7 10.5v6.5"/>',
  storefront: '<path d="M4.5 9.5l1.4-5h12.2l1.4 5M4.5 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0M5.5 11.5v8h13v-8M10 19.5v-4.5h4v4.5"/>',
  location_on: '<path d="M12 20.5s-6.2-5.6-6.2-10.6a6.2 6.2 0 0 1 12.4 0c0 5-6.2 10.6-6.2 10.6z"/><circle cx="12" cy="9.9" r="2.3"/>',
  lock: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2.2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
  logout: '<path d="M10 4.5H6.5a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5H10M14.5 8l4 4-4 4M18.5 12H9.5"/>',
  history: '<path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3L4.5 9"/><path d="M4.5 4.8V9h4.2M12 8v4.3l2.8 1.7"/>',
  trending_up: '<path d="M3.5 16.5l5.5-5.5 4 4 7-7"/><path d="M15 8h5v5"/>',
  instagram: '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.7"/><path d="M16.7 7.3v.01"/>',
  youtube: '<rect x="2.8" y="5.8" width="18.4" height="12.4" rx="4"/><path d="M10.3 9.4l4.4 2.6-4.4 2.6z"/>',
  x: '<path d="M5 4.8h3.9L19 19.2h-3.9z"/><path d="M18.4 4.8l-5.5 6.3M11.1 12.9l-5.5 6.3"/>',
  facebook: '<path d="M14.6 20.2v-7.1h2.4l.4-2.9h-2.8V8.4c0-.85.25-1.4 1.45-1.4h1.5V4.4a19 19 0 0 0-2.2-.12c-2.2 0-3.7 1.35-3.7 3.8v2.1H9.2v2.9h2.45v7.1"/>',
  linkedin: '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8.2 10.5v5.8M8.2 7.8v.01M11.6 16.3v-3.4a2.1 2.1 0 0 1 4.2 0v3.4M11.6 10.5v5.8"/>',
  tiktok: '<path d="M13.5 4.5v10.2a3 3 0 1 1-3-3"/><path d="M13.5 4.5c.4 2.3 2 3.8 4.5 4"/>',
  photo_camera:
    '<path d="M4 9a2 2 0 0 1 2-2h2.3l1.6-2.2h4.2L15.7 7H18a2 2 0 0 1 2 2v8.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.4"/>',
};

/** The UI icon's inner SVG, or null (then the Material Symbols font draws it). */
export function lineIcon(name: string): string | null {
  return UI[name] || null;
}

/* ━━━━━━━━━━━━ Category icons (48 grid) ━━━━━━━━━━━━ */
const KINDS: Record<string, string> = {
  tv: '<rect x="4.5" y="9" width="39" height="25" rx="2.5"/><path d="M13 39l3-5M35 39l-3-5M9 39h6M33 39h6"/>',
  monitor: '<rect x="6" y="7" width="36" height="25" rx="2.5"/><path d="M6 27h36M24 32v6.5M16 40.5h16"/>',
  laptop:
    '<path d="M10 12.5A2.5 2.5 0 0 1 12.5 10h23a2.5 2.5 0 0 1 2.5 2.5V31H10z"/><path d="M4.5 31h39l-1.7 5.2a2.4 2.4 0 0 1-2.3 1.8H8.5a2.4 2.4 0 0 1-2.3-1.8z"/><path d="M21 34.5h6"/>',
  keyboard: '<rect x="4" y="13" width="40" height="23" rx="3.5"/><path d="M10 20h2M16 20h2M22 20h2M28 20h2M34 20h4M10 25.5h4M18 25.5h2M24 25.5h2M30 25.5h2M36 25.5h2M15 31h18"/>',
  mouse: '<rect x="14" y="5.5" width="20" height="37" rx="10"/><path d="M24 11v6M14 20h20"/>',
  printer: '<path d="M14 18V6.5h20V18"/><rect x="5.5" y="18" width="37" height="16" rx="3"/><path d="M14 28h20v13.5H14zM35 23h2.5M19 33h10M19 37h7"/>',
  headphones: '<path d="M8 31v-7a16 16 0 0 1 32 0v7"/><rect x="5.5" y="27" width="8.5" height="14" rx="3.5"/><rect x="34" y="27" width="8.5" height="14" rx="3.5"/>',
  earbuds:
    '<circle cx="15" cy="15.5" r="7"/><rect x="12.5" y="22" width="5" height="17" rx="2.5"/><circle cx="33" cy="15.5" r="7"/><rect x="30.5" y="22" width="5" height="17" rx="2.5"/><path d="M15 13v.01M33 13v.01"/>',
  microphone: '<rect x="18" y="4.5" width="12" height="22" rx="6"/><path d="M12 21.5a12 12 0 0 0 24 0M24 33.5v8M17 41.5h14M18 12h4M18 17h4"/>',
  camera:
    '<path d="M5.5 16.5a3 3 0 0 1 3-3h6.2l3.2-4.5h12.2l3.2 4.5h6.2a3 3 0 0 1 3 3V36a3 3 0 0 1-3 3h-31a3 3 0 0 1-3-3z"/><circle cx="24" cy="25.5" r="7.5"/><path d="M36 19h2.5"/>',
  "action-camera":
    '<rect x="6.5" y="12.5" width="35" height="25" rx="4.5"/><circle cx="17.5" cy="25" r="6.5"/><circle cx="17.5" cy="25" r="2.2"/><rect x="28.5" y="18" width="8" height="6" rx="1.5"/><path d="M11 12.5V9h6.5v3.5M29 31h7"/>',
  "flash-drive": '<path d="M18 18V5.5h12V18"/><path d="M21.5 10h1M25.5 10h1"/><rect x="14" y="18" width="20" height="25" rx="4"/><path d="M24 26v9"/>',
  "hard-drive": '<rect x="10" y="4.5" width="28" height="39" rx="4.5"/><circle cx="24" cy="19.5" r="8"/><circle cx="24" cy="19.5" r="1.6"/><path d="M15.5 36h7M31.5 36h.01"/>',
  "power-bank": '<rect x="13" y="4.5" width="22" height="39" rx="4.5"/><path d="M25.8 13.5l-5.3 9.2h7l-5.3 9.3M20 38.5h8"/>',
  "power-station":
    '<rect x="5.5" y="14" width="37" height="27" rx="4"/><path d="M15 14V9.5a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 33 9.5V14"/><rect x="11" y="20" width="13" height="8.5" rx="1.5"/><circle cx="30.5" cy="31" r="2.4"/><circle cx="37" cy="31" r="2.4"/><path d="M11 34.5h13M29 22.5h9.5"/>',
  phone: '<rect x="14" y="4.5" width="20" height="39" rx="4.5"/><path d="M21 9h6M22 38.5h4"/>',
  speaker: '<rect x="11" y="4.5" width="26" height="39" rx="5"/><circle cx="24" cy="29" r="7"/><circle cx="24" cy="14" r="3"/>',
  watch: '<rect x="13" y="13" width="22" height="22" rx="6"/><path d="M17 13l1.5-8.5h11L31 13M17 35l1.5 8.5h11L31 35M24 19v5.5l3.5 2"/>',
  tablet: '<rect x="8.5" y="5" width="31" height="38" rx="4.5"/><path d="M21 38.5h6"/>',
  console: '<path d="M14 16h20a8 8 0 0 1 7.8 9.8l-1.6 7a4.5 4.5 0 0 1-8 1.6L29 30H19l-3.2 4.4a4.5 4.5 0 0 1-8-1.6l-1.6-7A8 8 0 0 1 14 16z"/><path d="M15 21v6M12 24h6M31 22.5h.01M34 25.5h.01"/>',
  device: '<rect x="7" y="9" width="34" height="24" rx="3"/><path d="M17 40h14M24 33v7"/>',
};

const RULES: [RegExp, string][] = [
  [/power[\s-]?station|\brv\b|generator/, "power-station"],
  [/power[\s-]?bank|battery|charger/, "power-bank"],
  [/action[\s-]?cam|go[\s-]?pro/, "action-camera"],
  [/camera|lens|dslr|mirrorless/, "camera"],
  [/ear[\s-]?bud|earphone|in[\s-]?ear/, "earbuds"],
  [/head[\s-]?phone|headset/, "headphones"],
  [/micro[\s-]?phone|\bmic\b/, "microphone"],
  [/speaker|sound[\s-]?bar|audio/, "speaker"],
  [/monitor|display/, "monitor"],
  [/\btvs?\b|television|projector/, "tv"],
  [/laptop|notebook|computer|\bpc\b/, "laptop"],
  [/keyboard/, "keyboard"],
  [/\bmouse\b|\bmice\b/, "mouse"],
  [/printer|scanner/, "printer"],
  [/flash|usb|thumb|memory[\s-]?card/, "flash-drive"],
  [/hard[\s-]?drive|\bssd\b|\bhdd\b|storage|drive/, "hard-drive"],
  [/phone|mobile/, "phone"],
  [/tablet|ipad/, "tablet"],
  [/watch|wearable/, "watch"],
  [/console|gaming|controller/, "console"],
];

/** The icon kind for a category (by its name/slug and title). */
export function kindOf(category: any): string {
  const text = `${category?.name || ""} ${category?.title || ""}`.toLowerCase().replace(/[_-]+/g, " ");
  for (const [re, kind] of RULES) if (re.test(text)) return kind;
  return "device";
}

/** The category's line icon as an inner SVG (48 grid). */
export function categoryIcon(category: any): string {
  return KINDS[kindOf(category)] || KINDS.device;
}
