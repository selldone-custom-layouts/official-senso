# Customize

The design lives in Senso's own components and style sheets, over the components it shares with other Layouts built on Kalio (the shared base in `components/kalio/`). Selldone's commerce logic underneath stays untouched.

## The name and the logo

- **Name:** `BRAND.name` in `components/kalio/kalio-brand.ts` (one line). The browser tab's title and every line that names the shop follow. `null` shows the shop's own title.
- **Wordmark:** `components/senso/SensoWordmark.vue` draws the mark (a rounded square with a soft wave, in the palette's decoration colour) and the name in bold rounded lower case.
- **Mark file:** `assets/brand/senso-mark.svg` (64 × 64): the browser tab's icon, the chat avatar on the order page and the compare page's badge. If you change the mark, change it in both places. Selldone accepts only plain SVG attributes (no `style`).

## Product families

The header, its panels, the hero slides, the phone menu, the footer's first column and some photo slots are built from **families**: groups of your categories.

- They are in `FAMILIES` in `components/senso/senso-families.ts`. Each family has:
  - `key`: a short id, used in photo file names (`hero-audio.webp`);
  - `title`: the name in the header ("Audio");
  - `line`: the hero's second line ("Made to be heard.");
  - `story`: the heading and text of the home's wide card when it tells this family's story;
  - `match`: the words that put a category in this family.
- A category joins the **first** family whose words match its name or title. A category no family claims goes to **More**. A family with no category is not shown.
- **To rename a family or change its line, edit `FAMILIES`.** To move a category, add a word from its name to the right family's `match`.
- A shop where no category fits any family gets one family per category (up to five) and "More" for the rest.

## Category icons

Each category gets a thin line icon picked by its name and title ("TVs", "Earbuds", "Power station"…), never by its id. The rules are `RULES` in `components/senso/senso-icons.ts`; the drawings are `KINDS` in the same file. An unknown kind gets a generic device. To give a new kind its own icon, add a drawing to `KINDS` (48 × 48 grid) and a rule to `RULES`.

## Photo slots

Senso has **19 photo slots**, listed in one file, `components/senso/senso-photos.ts`:

| Slots | Size | Where |
| --- | --- | --- |
| `hero-<family>.webp` (5) | 2400 × 1350 | the home's carousel, one slide per family |
| `feature-wide.webp`, `lifestyle-wide.webp` | 2400 × 1000 | the home's FEATURED and LIFESTYLE cards |
| `listing-<family>.webp` (5) | 1600 × 900 | the category banner, for every category of the family |
| `highlight-<family>.webp` (5) | 1600 × 1200 | the product page's first Highlights band |
| `about-hero.webp` | 2400 × 1000 | the About banner |
| `support-hero.webp` | 2400 × 800 | the support centre and Contact banners |

`<family>` is the family's `key`: `tv-display`, `audio`, `computing`, `cameras`, `storage-power`.

- **To add photos:** drop the files in `assets/senso/photos/` with these exact names (WebP, JPG or PNG with the same base name). Build and release. No code change.
- **Until a file exists**, the slot shows a designed placeholder: a calm tinted panel of the slot's exact shape, a small photo icon and the file name. So you can see where each photo goes.
- **Meanwhile**, the hero and About use your wide category photos, `assets/senso/wide-<category name>.webp`, when they exist.
- **Words sit on most photos.** Keep the calm side of each photo (the left, for most) dark and quiet. No text, logos or faces.
- **New family?** Add its key to `FAMILY_KEYS` in `senso-photos.ts` to give it its three slots.

## Colours, type and icons

- **Your colour or dark mode:** one file, `components/senso/senso-theme.settings.ts`. See [Theme and colours](Theme-and-colours).
- **Senso's tokens:** the `--sn-*` variables at the top of `style/senso-skin.scss`. A "token" is a named value used everywhere: the teal, the mint tile, the ink, the sale red, the grey ground, the corners (`--sn-r` 18px, `--sn-r-tile` 20px), the font.
- **Senso's shapes:** `style/senso-brand.scss`, loaded last: buttons and chips, the header, photo slots, the hero, the home's tiles, rails, the card, the footer, listing pages, the product page, the support centre and the 404.
- **Shared tokens:** `style/kalio-tokens.scss`: the teal action colour `#00736f` (named `--k-green`, the base's name, so every shared component follows), the white page, the grey `#f3f5f5` listing ground, lines and radii. Vuetify's primary colour (`--v-theme-primary`) follows the palette, so Selldone's own parts don't show another colour.
- **Typeface:** Poppins, loaded in `components/kalio/kalio-fonts.ts` (from the app, not `index.html`).
- **Icons:** Senso's own thin line icons, in `components/senso/senso-icons.ts`. A name with no line icon falls back to Material Symbols Rounded. Only the names in the `ICONS` list in `kalio-fonts.ts` are loaded: add a new fallback icon there, or it shows as its name.

## Where each part is

| Part | Files |
| --- | --- |
| Home sections | `components/senso/SensoHome.vue` (the order), `SensoHero.vue` (carousel), `SensoShowcase.vue` (FEATURED, LIFESTYLE), `SensoCollections.vue` (tag tabs), `SensoRail.vue` (DEALS, NEW, "You may also like"), `SensoShelf.vue` ("Shop the latest"), `SensoBlog.vue` (STORIES), `SensoNewsletter.vue`; shared reads and the showcase product rule in `senso-home.ts` |
| Families and photo slots | `senso-families.ts`, `senso-photos.ts`, `SensoSlot.vue` |
| The product card (home and every listing) | `components/senso/SensoCard.vue`; `senso-card.ts` puts it in place of Selldone's card; deal clocks in `senso-clock.ts` |
| The quick-buy sheet (capacities) | `senso-quick.ts`, `SensoQuickHost.vue`, `components/kalio/KalioQuickBuy.vue` |
| Header, family panels, footer, drawers, sign-in | `components/kalio/shell/` (`KalioHeader.vue`, `KalioFooter.vue`, `KalioBasketDrawer.vue`, `KalioSignIn.vue`), `components/senso/SensoMegaMenu.vue`, `SensoWordmark.vue` |
| Category, catalogue, search, offers | `pages/products/StorefrontPageProducts.vue`, `components/senso/SensoShopTop.vue` (banner, kinds chips, toolbar), `SensoFilterPanel.vue`, `senso-listing-loading.ts` |
| Product page | `components/senso/SensoProductOverview.vue`, `SensoHighlights.vue`, `SensoSimilar.vue`, `SensoFbt.vue`, `pages/product/StorefrontPageProduct.vue` |
| Support centre, Contact, About, Terms, Privacy | `pages/faq/`, `pages/official/` |
| 404, blog | `pages/errors/404/`, `pages/blog/` |
| Cart, address sheet, delivery, payment window | `pages/basket/cart/`, `components/kalio/checkout/`, `components/kalio/shell/KalioBasketDrawer.vue` |
| Order page | `pages/basket/order/`, `components/kalio/order/` |
| Buyer account | `components/kalio/account/`, `pages/user/` |
| Compare | `components/kalio/compare/` (words in `compare-skin.ts`), `pages/comparison/` |
| Styles | `style/senso-skin.scss` (tokens and the base dress), `style/senso-pages.scss` (the pages after the home), `style/senso-brand.scss` (Senso's own shapes, loaded last, so it wins) |
| Theme | **Your choice: `components/senso/senso-theme.settings.ts`** (see [Theme and colours](Theme-and-colours)). The palettes, which variables each colour feeds and the dark values are in `components/senso/senso-theme.ts`. The switcher itself is `components/theme-switcher/`; its button is in `KalioHeader.vue`. Dark values for fixed colours come from the build step in `vite.config.ts` (`postcss-dark-tokens`). |

[`SENSO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/SENSO.md) explains what Senso changed and why. [`KALIO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/KALIO.md) explains every shared behaviour and each workaround.

## Rules that keep it working

- **Re-skin, don't replace.** Keep Selldone's scripts for the cart, bill, checkout, variants and orders. Change templates and styles.
- **Prefix every class** (`sn-…`). Short names collide with Selldone's.
- **Live data only.** Never hard-code product names, prices, categories or URLs.
- **No line under any word or icon** (only links inside an article's text). Put `text-decoration: none` on the clickable element itself: a card is a link, and its hover line reaches every word inside.
- **Flat buttons, hover = colour only.** No lift, no shadow.
- **Rings and edges inside the box.** Draw a selection ring or edge with an inset `box-shadow`, never an `outline` that sits outside.
- **No half-empty rows.** Tile rows hold three or four, wrap two to a row on a phone, or scroll sideways. An odd grid gets an "All products" tile.
- **Icons:** Senso's line icons are `<svg class="sn-i">`; fallback icons are `<span class="sn-ms">`. A rule that hides `span` hides those icons too: write `span:not(.sn-ms)`.
- **Sticky needs `overflow: clip`.** `.v-application` has `overflow: hidden`.
- **Fixed panels:** teleport them to `body`. Inside a Vuetify overlay they land off-screen on a phone.
- **Never commit inside `modules/*`.** Keep a fix there as a patch in `patches/`.

## Test before you release

- Check the phone first: 360 and 390 px wide. Then tablet (768, 1024), laptop (1366, 1440) and desktop (1920).
- Walk through as a shopper: open a family panel, add products from cards (a colour, a capacity), open the drawer and the cart, add an address on the map, fill the checkout up to Pay.
- Hover every link and button: no underline anywhere.
- Check light and dark.
- Look for overlapping or clipped text, off-centre icons, empty boxes, half-empty rows, anything under a fixed bar, and Selldone's default look showing through.
- After the release, run the checks in [Build and Upload](Build-and-Upload#checks-after-a-release).
