# Customize

The design lives in Senso's own components and style sheets, over the components it shares with Molino and Tario. Selldone's commerce logic underneath stays untouched.

## The name, the logo, the photos

- **Name:** `BRAND.name` in `components/kalio/kalio-brand.ts` (one line). The wordmark (`SensoWordmark.vue`) writes it in lower case with a yellow square over every "i"; the tab title and every line that names the shop follow. `null` shows the shop's own title.
- **Mark:** `assets/brand/senso-mark.svg` (64 × 64): the tab icon, the chat avatar on the order page, the compare page's badge. Selldone accepts only plain SVG attributes (no `style`).
- **Photos:** `assets/senso/<shape>-<category name>.webp` (see [Shop Requirements](Shop-Requirements)). The file name is the map; nothing else to edit.

## Colours, type and spacing

- **Tokens:** `style/kalio-tokens.scss` — the action blue (`--k-green`, `--k-green-deep`: Kalio's names are kept so every shared component follows), the sale red (`--k-coral`), the grey floor (`--k-paper`), ink, lines, radii. Vuetify's primary colour is the same blue (`--v-theme-primary`), so Selldone's own parts don't show the theme's purple.
- **Senso's palette:** the `--sn-*` variables at the top of `style/senso-skin.scss` (blue, yellow accent, red, navy, the floor, radii, the font).
- **Typefaces:** Plus Jakarta Sans and Material Symbols Rounded, loaded in `components/kalio/kalio-fonts.ts` (from the app, not `index.html`). Only the icons in its `ICONS` list are loaded: add a new icon there, or it shows as its name.

## Where each part is

| Part | Files |
| --- | --- |
| Home sections | `components/senso/SensoHome.vue` (the order), `SensoHero.vue`, `SensoCategories.vue`, `SensoRail.vue`, `SensoDoorbusters.vue`, `SensoBento.vue`, `SensoTagSplit.vue`, `SensoSignInNudge.vue`, `SensoMoments.vue`, `SensoBudget.vue`, `SensoBrands.vue`, `SensoBlog.vue`; shared reads in `senso-home.ts` |
| The product card (home and every listing) | `components/senso/SensoCard.vue`; `senso-card.ts` puts it in place of Selldone's card |
| The quick-buy sheet (capacities) | `senso-quick.ts`, `SensoQuickHost.vue`, `components/kalio/KalioQuickBuy.vue` |
| Header, mega menu, footer, drawers, sign-in | `components/kalio/shell/`, `components/senso/SensoMegaMenu.vue` |
| Category, catalogue, search, deals | `pages/products/StorefrontPageProducts.vue`, `components/senso/SensoShopTop.vue`, `SensoFilterPanel.vue` |
| Product page | `components/senso/SensoProductOverview.vue`, `SensoFbt.vue`, `pages/product/StorefrontPageProduct.vue` |
| Cart, address sheet, delivery, payment window | `pages/basket/cart/`, `components/kalio/checkout/`, `components/kalio/shell/KalioBasketDrawer.vue` |
| Order page | `pages/basket/order/`, `components/kalio/order/` |
| Buyer account | `components/kalio/account/`, `pages/user/` |
| About, Contact, 404, blog | `pages/official/`, `pages/errors/404/`, `pages/blog/` |
| Compare | `components/kalio/compare/` (words in `compare-skin.ts`) |
| Styles | `style/senso-skin.scss` (home, header, footer, cards, listings), `style/senso-pages.scss` (every other page), both loaded last |
| Theme in the header (palettes, Custom colour, Light / Dark; the action is in `components/kalio/shell/KalioHeader.vue`) | **Your choice: `components/senso/senso-theme.settings.ts`** (palette or brand colour, light or dark, the visitor switcher "showcase", "on" or "off"; see [Theme and colours](Theme-and-colours)). The palettes themselves, the custom colour's options, which variables each colour feeds and the dark values are in `components/senso/senso-theme.ts`. The switcher itself is `components/theme-switcher/` (no Senso names inside). Dark values for fixed colours come from the build step in `vite.config.ts` (`postcss-dark-tokens`). A new palette needs white text at 4.5:1 or more on its colour: check with `components/theme-switcher/tools/contrast-audit.cjs` |

[`SENSO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/SENSO.md) explains what Senso changed and why; [`KALIO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/KALIO.md) explains every shared behaviour and each workaround.

## Rules that keep it working

- **Re-skin, don't replace.** Keep Selldone's scripts for the cart, bill, checkout, variants and orders; change templates and styles.
- **Prefix every class** (`sn-…`). Short names collide with Selldone's.
- **Live data only.** Never hard-code product names, prices, categories or URLs.
- **No line under any word or icon** (only links inside an article's text). Put `text-decoration: none` on the clickable element itself: a card is a link and its hover line reaches every word inside.
- **Flat buttons, hover = colour only.** No lift, no shadow.
- **Two-row grids stay even.** Use `categoryTiles()` for category grids; for any other grid, set the columns so every row is full.
- **Vuetify draws icons as `<i>`; Senso's icons are `<span class="sn-ms">`.** A rule that hides `span` hides the icon too: write `span:not(.sn-ms)`.
- **Sticky needs `overflow: clip`.** `.v-application` has `overflow: hidden`.
- **Fixed panels:** teleport them to `body`; inside a Vuetify overlay they land off-screen on a phone.
- **Never commit inside `modules/*`.** Keep a fix there as a patch in `patches/`.

## Test before you release

- Check the phone first: 360 and 390 px wide. Then tablet (768, 1024), laptop (1366, 1440) and desktop (1920).
- Walk through as a shopper: add products from cards (a colour, a capacity), open the drawer, the cart, add an address on the map, fill the checkout up to Pay.
- Hover every link and button: no underline anywhere.
- Look for overlapping or clipped text, off-centre icons, empty boxes, half-empty rows, anything under a fixed bar, Selldone's default look showing through.
