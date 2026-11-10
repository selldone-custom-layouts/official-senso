/*
 * Senso — typefaces.
 *
 * Poppins sets everything; Senso's own icons are thin line SVGs
 * (senso-icons.ts), and Material Symbols Rounded draws the few names that
 * have no line icon (SensoIcon falls back to it, the `.sn-ms` class). They are requested from the
 * app at start-up rather than from index.html: in production the Layout runs
 * inside the HTML Selldone renders for the shop, and index.html never
 * reaches the visitor. Selldone's own parts keep the Material Icons font
 * they ship with (v-icon).
 *
 * The icon font is asked for only the icons Senso draws (Google's
 * `icon_names`), a few kilobytes instead of the whole set. A new icon in a
 * Senso component must be added to ICONS, or it shows as its name.
 */

export const ICONS = [
  "account_circle", "add", "add_shopping_cart", "alternate_email", "apps", "arrow_back", "arrow_forward",
  "assignment_return", "bolt", "check", "check_circle", "chevron_left", "chevron_right", "close",
  "compare_arrows", "credit_card", "delete", "expand_less", "expand_more", "favorite", "filter_list", "help",
  "history", "home", "inventory_2", "local_mall", "local_offer", "local_shipping", "location_on", "lock", "logout",
  "mail", "menu", "new_releases", "notifications", "package_2", "palette", "payments", "person", "photo_camera", "public",
  "receipt_long", "remove", "schedule", "search", "sell", "share", "shopping_cart", "smart_display", "storefront",
  "support_agent", "trending_up", "tune", "verified", "workspace_premium",
];

const FONTS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Poppins:wght@400;500;600;700;800" +
  "&display=swap";

const ICONS_HREF =
  "https://fonts.googleapis.com/css2" +
  "?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,500,0..1,0" +
  "&icon_names=" +
  [...new Set(ICONS)].sort().join(",") +
  "&display=block";

function addLink(attrs: Record<string, string>) {
  if (document.head.querySelector(`link[href="${attrs.href}"]`)) return;
  const link = document.createElement("link");
  Object.entries(attrs).forEach(([key, value]) => link.setAttribute(key, value));
  document.head.appendChild(link);
}

addLink({ rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" });
addLink({ rel: "stylesheet", href: FONTS_HREF });
addLink({ rel: "stylesheet", href: ICONS_HREF });
