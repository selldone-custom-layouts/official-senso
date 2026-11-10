# Senso — Selldone Layout

**Senso Electronics** (package `senso-electronics`, **Layout 33**) is a Layout for the Selldone shop **Digini** (shop 15549), a single-seller electronics shop, shown only on **https://senso.selldone.shop** (domain 1242). The owner asked for a design "like hisense.com/us/en": that site's sections and calm brand feel, with Senso's own name, mark, copy and colours.

It started on 10 November 2026 as a copy of Digito 1.0.17 (`digito-electronics`, itself Tario re-dressed), so every Kalio behaviour the owner asked for is kept. Read [`DIGITO.md`](DIGITO.md), [`KALIO.md`](KALIO.md) and [`TARIO.md`](TARIO.md) before changing anything:

- "Add to cart" turns into "− n in cart +" in place; taps never wait for the server;
- no "Added to cart" pop-up, no phone bottom bar;
- the two-step, map-first address sheet, with suggestions while typing;
- the receipt that follows Selldone's bill, Pay leading to whatever is missing, no empty payment window;
- the guest's order page right after paying (guest code at Pay);
- the compare page (design 1), the buyer account (design A, "desk"), the content pages;
- the shared theme switcher (`components/theme-switcher/`, unchanged), real deal clocks to each deal's `dis_end`, rings drawn inside their box, the one-row gallery, named colour tiles.

The code was renamed on the way: `components/senso/`, `sn-` classes, `--sn-` tokens, `sn-dark`, `senso-theme` storage.

## The design

A premium electronics brand site: calm, spacious and cinematic.

- **Type and colour:** Poppins 700–800 headings, each under a small teal eyebrow in capitals. Teal `#00736f` is every button (white words; 5.70:1). The decoration teal `#00a3a1` is used for the mark, line icons and focus rings. Near-black ink `#0d1b1e`, pale mint tiles `#eef8f8`, the listing ground `#f3f5f5`, and sale red `#c4122f`.
- **Shapes:** pill buttons (solid; outlined teal; outlined white on photos), 18–20px corners on cards and tiles, flat, no line under any word or icon.
- **Icons and mark:** thin line icons drawn for Senso (`senso-icons.ts`, by Material name, with Material Symbols as the fallback), and one line icon per kind of category, picked by the category's own name. The mark is a rounded square with a soft wave, with the wordmark "senso" (`SensoWordmark.vue`, `assets/brand/senso-mark.svg`, the favicon).
- **Mockups:** `../digini-design/senso-home.html`, `senso-category.html`, `senso-product.html` (shots in `../digini-design/shots/senso-*`).

| Area | Where |
| --- | --- |
| The name and mark (one place: `BRAND.name`) | `components/kalio/kalio-brand.ts`, `SensoWordmark.vue`, `assets/brand/senso-mark.svg` |
| Product families from the live categories (TV & Display, Audio, Computing, Cameras, Storage & Power, More) | `components/senso/senso-families.ts` |
| Header: clear over the hero, then solid white; families with mega panels (click, second click, Esc, click outside); Support, search panel, Account, Theme, cart; phone: full-screen menu with accordions | `components/kalio/shell/KalioHeader.vue`, `SensoMegaMenu.vue` |
| Footer on mint: wordmark and the shop's socials, 4 link columns, legal row | `components/kalio/shell/KalioFooter.vue` |
| Home: hero carousel, FEATURED, COLLECTIONS, LIFESTYLE, DEALS, CATEGORY, NEW, STORIES, newsletter | `SensoHome.vue`, `SensoHero.vue`, `SensoShowcase.vue`, `SensoCollections.vue`, `SensoRail.vue`, `SensoShelf.vue`, `SensoBlog.vue`, `SensoNewsletter.vue` |
| The card (well, swatches or capacities, price, Save, deal clock, Add to cart / Choose options, Learn more in listings, Compare) | `SensoCard.vue`, `senso-card.ts` |
| Listing: dark banner, kinds chips, N results, Sort pill, filter card, three a row; loading states | `SensoShopTop.vue`, `SensoFilterPanel.vue`, `pages/products/StorefrontPageProducts.vue`, `senso-listing-loading.ts` |
| Product page: gallery + sticky info column, Highlights, Specifications, Compare with similar, You may also like | `SensoProductOverview.vue`, `SensoHighlights.vue`, `SensoSimilar.vue`, `pages/product/StorefrontPageProduct.vue` |
| Support centre (FAQ with search, tiles, accordions), Contact, About, 404 | `pages/faq/`, `pages/official/`, `pages/errors/404/` |
| Photo slots and placeholders | `senso-photos.ts`, `SensoSlot.vue`, `assets/senso/photos/` (prompts: `../digini-design/codex-photos-senso.md`) |
| Styles | `style/senso-brand.scss` (Senso's shapes, loaded last), `style/senso-skin.scss` (tokens and the base dress), `style/senso-pages.scss` (Kalio's other pages) |
| Theme | `senso-theme.settings.ts` (the one file a merchant edits), `senso-theme.ts` (palettes, tokens, dark set) |

## Live data and its rules

- **Families** come from the categories' own names. A new category joins its family, or "More", with no code change.
- **Showcase product** of a category (tiles, mega panels, banners): the deepest saving, then the highest price, in stock first.
- **Hero slides:** one per family with a photo, either its own (`hero-<family>`) or the owner's wide photo of one of its categories. Today that is four slides; Audio gets a slide when `hero-audio.webp` arrives.
- **Tags:** the best-seller tag is the first COLLECTIONS tab. Every other tag (except new-arrival) has its own tab, and a new tag makes a new tab. The new-arrival tag fills NEW, which hides when empty.
- **Deal clocks** count to each deal's own `dis_end` (the variant's own when it has its own price), with one shared 1-second ticker.
- **Highlights** come from the product's own article (its bold headings and the words under them) and its other gallery pictures. Without an article they come from the spec groups. Nothing is invented.
- **Kinds chips on a category:** a spec key from the category's own filter list (Display, Screen, Size…), else its brands. A click filters the list.
- **N RESULTS** is the listing's own total, as on the reference. It is the only place a count shows.
- **The newsletter** is Selldone's own subscription, which needs a customer account. A guest gets the sign-in sheet, and the form keeps what they typed.

## Release

`LAYOUT_ID=33 SELLDONE_CLI_SRC="D:/Kalio Sample Shop Claude/selldone-cli-src" bash scripts/release.sh <version> desk`, then pin **only senso.selldone.shop**:

1. `selldone_current_connection` must say shop 15549.
2. Call `selldone_api_call` with `api.shops.domains.layout.set`, `path_params {"domain_key":"1242"}`, body `{"mode":"private","layout_id":33,"layout_version":"<exact version>"}`, and `confirm: true`.

Never call `api.shops.layout.set` (the shop default): digito, besti and argon belong to other Layouts.

The domain's loading screen (the mark and "senso" on teal-ink with a thin moving bar) is set with `selldone_domain_loading_update` (mode custom).

Checks, all at 0:

- `components/theme-switcher/tools/header-check.cjs` (`STORAGE_KEY=senso-theme`, `BRAND=.sn-header__brand`, `CART=.sn-header__ic.-cart`, `ACCOUNT=.sn-header__ic.-account`);
- `contrast-audit.cjs` and `cart-audit.cjs`;
- `new-shop-kits/single-vendor-shop/ring-sweep.cjs`;
- `scripts/senso-layout-checks.cjs`: every picture inside its own box, and every icon list on one edge.

## Releases

- **1.0.4 (10 November 2026, deploy 484, release `01M72DH8QC4N2MMY960W4XS00X`, pinned on domain 1242): content never touches its card's edge.**
  - **The owner's report on 1.0.3:** on every listing (category, search, offers, filtered or not), the card's content sat flush on its left and right edges, and the image well lost its inset.
  - **The cause:** Selldone's listing hands each card its column and utility classes (`v-col-12 v-col-sm-6 … pa-0`). `senso-card.ts` let them fall through to SensoCard's root, and Vuetify's `.pa-0 { padding: 0 !important }` (with an old `padding: 0 !important` in the base dress) wiped the card's 12px padding.
  - **Before the fix,** the new card check in `scripts/senso-layout-checks.cjs` found all 7 cards on /monitors-category at 1440 with padding 0/0. The cards on the home rails were fine.
  - **The fix:** the listing's card now passes only the listing's listeners (click, hover) to SensoCard, never its classes (`inheritAttrs = false`). The base dress no longer zeroes the padding, and `.v-application .sn-card` keeps 12px 12px 16px (10px on a phone) whatever lands on it.
  - **The card check** now runs in the layout checks: every visible card's padding is 10px or more, and every part of it sits 8px or more inside its edges.
- **1.0.3 (10 November 2026, deploy 481, release `01M72BBFWZ0CF3MR7PCBXNW9FN`, pinned on domain 1242).**
  - The hero's white arrow circles keep a dark arrow in dark mode: the build step had turned the arrow light, white on white.
  - A family of two or three categories gets a one-column mega panel.
  - The FEATURED and LIFESTYLE cards open the family's lead category: the one with the most deals, then the most products.
- **1.0.2 (10 November 2026, deploy 480, release `01M72AYFAN6YN1YTW1N6XATSQT`, pinned on domain 1242): the offers wording and theme colour for chosen states.** The empty cart, the blog and an article now say "offers" (Senso has no "Today's deals"). Selldone's chosen Compare and Save pills take the theme colour instead of Vuetify's green. The walk-through on dev before it passed 42 of 45 steps at 1440 in light. The three that did not pass:
  - the walker's own default palette check (fixed in the walker);
  - Selldone's "Price: low to high", which orders by the price before the deal (763.50 before 761.90; a Selldone limit, as on Digito);
  - one 429 rate-limit answer from Selldone.
- **1.0.1 (10 November 2026, deploy 479, release `01M72AABPDGFSJN47DFB3DJVKQ`, pinned on domain 1242), the first round of fixes.**
  - The phone menu's family accordions and the header's family panels open by the family's key. A family is rebuilt as a new object each time, so the first build compared objects and nothing opened on a phone. Esc closes the phone menu too.
  - Focus rings are drawn inside each control (never the browser's outline). Product pictures in "Often added" and the cart lines sit inside clipping boxes. The cart page's delivery hint lines up with its tiles' icons. The phone's filter sheet says "Filters" once. Packshots melt into their tiles.
  - Checked on dev before the upload: the header check printed PROBLEMS 0 (teal light, 360–1440). The contrast audit printed TOTAL 0 (teal light and dark: home, category, deals, two products, compare, blog, FAQ, About, Contact, 404). The cart audit printed TOTAL 0 (light and dark). The ring sweep printed TOTAL 0 (light). The layout checks printed TOTAL 0, covering pictures in boxes and icon lists on one edge, with a filled local cart and the quick-buy sheet.
- **1.0.0 (10 November 2026, deploy 477, release `01M728MC2556FBH0RQDZ7WS2BA`), the first Senso.** It created Layout 33 and was pinned on domain 1242, whose Home is the shop page. The saved block on https://senso.selldone.shop/ showed `senso-electronics` 1.0.0, and the phone screenshot showed the hero.
