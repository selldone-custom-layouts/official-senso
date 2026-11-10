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
| Header: clear over the hero, then solid white; families with mega panels (click, second click, Esc, click outside); Support, search panel, Account, cart; phone: full-screen menu with accordions | `components/kalio/shell/KalioHeader.vue`, `SensoMegaMenu.vue` |
| Footer on mint: wordmark and the shop's socials, 4 link columns, the Theme row (showcase shops only), legal row | `components/kalio/shell/KalioFooter.vue` |
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

- the footer's Theme row: palettes, Custom colour and Light / Dark repaint the site and survive a reload; no row and no stored theme on another shop (`header-check.cjs` tested the old header button and no longer applies);
- `contrast-audit.cjs` and `cart-audit.cjs`;
- `new-shop-kits/single-vendor-shop/ring-sweep.cjs`;
- `scripts/senso-layout-checks.cjs`: every picture inside its own box, every icon list on one edge, and every product card's content 8px or more inside its edges (`PAGES`, `WIDTHS`, `STORAGE`, `OPEN`, `FILLCART` as in its header).

## Releases

- **1.0.6 (10 November 2026, deploy 488, release `01M72J7BVKMY9G9R312YVZQ2RM`, pinned on domain 1242): the theme row in the footer, the Codex photos.**
  - **The theme switcher moves to the footer** (the owner, after talking with the Selldone team: the header button takes room and is not good for every shop). The Theme button leaves the header, whose actions are evenly spaced again (4px gaps at 1440 and 390). The shared package's `ThemeSwitcherRow.vue` and `theme-switcher.scss` (copied unchanged, now with the Custom colour swatch) sit in a strip of their own above the legal row, on the footer's edge, with the footer's colours (`--ts-ink`, `--ts-muted`, `--ts-line`, `--ts-ring`). Showcase shops only, as before. The docs (AGENTS.md, README, wiki) say "footer".
  - **The 19 Codex photos** in `assets/senso/photos/` fill every slot. The build has 370 files (19 more; the folder's README.md is not bundled), and the upload answered in 36.5 s. On live, the slots probe found 0 placeholders. The home hero has five slides (Audio has its own now), plus the FEATURED and LIFESTYLE cards, the category banners, the product Highlights, About, and Support/Contact.
  - **Selldone's busy answers are asked again.** The walk-through on 1.0.5 (390, dark) lost its families: one 429 on the first categories read left the phone menu without families for the whole visit, and 15 of 45 steps followed it down. The deals' "load more" passed (6, then 61). Now the categories and the home's product list are asked up to 4 times (1.2 s, 2.4 s and 4.8 s apart). A home whose hero has nothing to show gets the solid header instead of white words on white.
  - **On photos, white stays white in dark mode.** The outlined white buttons and the hero's progress bars had turned dark: the build step rewrote their white. They now use the `--sn-on-photo` tokens, which it leaves alone. The category band's breadcrumb slashes stay pale.
  - **Dark empty states (the owner's Walio report: light words on pastel chips).** Senso's empty cart drawer, its phone menu and its sign-in sheet put no words on a fixed light tint. The contrast audit in dark, with the drawer, the sheet or the menu open, printed TOTAL 0 for teal, violet and custom `#ffff00`, at 1440 and 390 (the menu at 390). That was 0 before any change, so nothing needed fixing.
  - **Checked on live 1.0.6:** the saved block names `senso-electronics` 1.0.6. The contrast audit printed TOTAL 0 on home, two categories, a product, About, FAQ and Contact (teal light and dark), and on home, a category and a product (custom `#ffff00` dark). The ring sweep printed TOTAL 0 (light and dark). With a stub shop, no theme row showed and no stored theme was applied. The footer row passed at 1440 and 390, light and dark: palettes, Custom colour and Light / Dark each repaint, and Custom and Dark survive a reload. Arrow keys move along the swatches.

- **1.0.5 (10 November 2026, deploy 485, release `01M72EK5EQ3049FTVSWVJQZRS5`, pinned on domain 1242): "Load more" is never skipped.**
  - **The walk-through on live 1.0.4 (390, dark)** kept the offers at 6 of 61. Selldone asks for the next page when its "load more" pill crosses the screen (`v-intersect`). A phone's jump to the end of the page (the End key, a fast fling, or the walker's `scrollTo`) can pass the pill without it ever being seen. A real wheel scroll loaded 6, then 30.
  - **The fix:** the listing page also watches the scroll (once per frame, passive). When the pill is within 240px of the screen's bottom or has been scrolled past, and Selldone is not already asking and has more, it asks for the next page. On dev, the same jumps loaded 6, then 61.
  - **The live checks on 1.0.4 and 1.0.5 (10 November, after the card fix):** the layout checks (pictures in boxes, icon lists, card padding; home, a category, a product, the quick-buy sheet, FAQ, Contact, 404, the cart drawer and the cart page, 1440 and 390) printed TOTAL 0 in light and dark. The header check printed PROBLEMS 0 (teal light and dark). The contrast audit printed TOTAL 0 (teal light and dark: home, a category, offers, two products, compare, blog, FAQ, 404). The cart audit printed TOTAL 0 (light and dark). The ring sweep printed TOTAL 0 (light and dark).

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
