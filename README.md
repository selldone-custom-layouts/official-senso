<p align="center">
  <img src="docs/screenshots/cover.jpg" alt="Senso Electronics — a blue deals-hub storefront Layout for Selldone, on desktop and phone" width="100%">
</p>

<h1 align="center">Senso Electronics</h1>

<p align="center">
  <b>A deals-hub storefront for a Selldone electronics shop.</b><br>
  A custom Selldone Layout built on the official <a href="https://github.com/selldone/storefront">selldone/storefront</a>.
</p>

<p align="center">
  <a href="https://senso.selldone.shop"><img src="https://img.shields.io/badge/live%20shop-senso.selldone.shop-0A4BD8?style=flat-square" alt="Live shop"></a>
  <a href="https://github.com/selldone-custom-layouts/official-senso/wiki"><img src="https://img.shields.io/badge/docs-wiki-6C3DF4?style=flat-square" alt="Wiki"></a>
  <a href="https://github.com/selldone-custom-layouts/official-senso/wiki/Install-with-AI"><img src="https://img.shields.io/badge/set%20up-with%20AI-f39f37?style=flat-square" alt="Set up with AI"></a>
  <img src="https://img.shields.io/badge/Selldone-Layout-2B2F7A?style=flat-square" alt="Selldone Layout">
  <img src="https://img.shields.io/badge/Vue-3-1fc8a9?style=flat-square&logo=vuedotjs&logoColor=white" alt="Vue 3">
</p>

<p align="center">
  <a href="https://senso.selldone.shop"><b>Open the live shop</b></a> ·
  <a href="https://github.com/selldone-custom-layouts/official-senso/wiki/Install-with-AI">Set it up with AI</a> ·
  <a href="https://github.com/selldone-custom-layouts/official-senso/wiki/Manual-Setup">Manual setup</a> ·
  <a href="https://github.com/selldone-custom-layouts/official-senso/wiki/Shop-Requirements">What your shop needs</a> ·
  <a href="https://github.com/selldone-custom-layouts">All Selldone custom layouts</a>
</p>

---

## What it is

**Senso Electronics** dresses a single-seller electronics shop like a big deals hub:
- a light grey floor with white rounded section cards;
- one blue for every button, a yellow accent for the logo's dots, chips and the clock, a red "Save $X" for every saving;
- Plus Jakarta Sans and Material Symbols Rounded;
- the shop's own lifestyle photos in the hero and photo cards, and a collage of the category's products wherever a photo is missing.

It runs on **[senso.selldone.shop](https://senso.selldone.shop)**, an address of the Selldone shop Digini. Selldone lets each domain of a shop carry its own Layout.

Selldone's own cart, checkout, payments and orders keep working underneath. Nothing about the shop is hard-coded: the name (one line in `kalio-brand.ts`), categories, products, prices, deals, tags and brands all come from the shop that runs it.

## Highlights

- **Header:** a blue bar with the wordmark (every "i" dotted with a yellow square), a big round search, Account, and the Cart with its count and total; a row of pills — **Shop ▾** opens a category mega menu on a click (and closes on the next), Deals, New arrivals, Brands — the categories with the most deals, and Track order, Blog and Help.
- **Home:**
  - a photo hero that turns, one slide per category with a wide photo, the deepest saving first, beside the **Deal of the Day** with a "Next deal in" clock to midnight;
  - **Shop by category** in two even rows of big circles (an "All categories" tile keeps the rows even);
  - **Top deals** on one line with arrows, **Doorbusters** one per category, the shop's tags as "<Tag> Items" rows, a **Best sellers** bento from the best-seller tag, a sign-in nudge for guests, **Gear for every moment** tall photo cards, **Trending now**, **Shop by budget** (price bands from the shop's own prices), **New arrivals**, **Shop by brand** and the four newest articles.
- **Cards:** a white photo well, colour swatches (a click picks the colour the cart button adds) or capacity chips, the name in two lines, brand · category, the price with a red **Save $X** and "Was $Y", a full-width blue **Add to cart** that turns into "− 1 in cart +" in place, **Choose capacity** (a quick-buy sheet with an ×) for products whose capacities have their own prices, Compare and Save.
- **Category, search and deals pages:** a short head (the category's brands as chips, a search's categories, or the categories with deals and the clock), a filter panel with Only deals, a price range, Colour, Capacity, the category's own spec filters and brands, a sort menu, and five cards a row; a Filter and Sort bar and a sheet on a phone.
- **Product page:** three columns — the gallery, the product (brand · category · model, the rating line, colours and capacities with their own pictures and prices, key specs, highlights) and a sticky buy card (price, saving, stock, delivery and pickup from the shop's own methods, Add to cart, Compare, Save); then Specifications in the shop's own groups, Reviews, **Frequently bought together** and More in the category.
- **Compare:** side by side, picks pinned at the top, differing rows on a yellow ground, Only differences, a link to share.
- **Cart drawer and cart page:** a receipt first (subtotal, You save, delivery, total, Checkout), compact rows with − n +, Often added; the cart page with Delivery method tiles, a map-first address sheet and an order summary that leads to whatever is missing.
- **About, Contact, FAQ, Terms, Privacy, blog, 404:** all in the same dress; sample text on About, Terms and Privacy is marked as sample until the shop writes its own.
- **Theme (showcase only):** on Senso's own showcase shop, a Theme button at the top right of the header offers five tested colour palettes, a free **Custom colour** (any colour, made readable automatically) and Light / Dark. See "The theme switcher" below.
- **Everywhere:** no "Added to cart" pop-ups, no phone bottom bar, no line under any word or icon, and no seller interface (one shop sells everything).

## Use it on your shop

| You want to… | Read |
| --- | --- |
| Let an AI agent (Claude Code, Codex…) set it up for your shop | [Install with AI](https://github.com/selldone-custom-layouts/official-senso/wiki/Install-with-AI) |
| Do it yourself, step by step | [Manual Setup](https://github.com/selldone-custom-layouts/official-senso/wiki/Manual-Setup) |
| Know what data your shop needs for the design to look right | [Shop Requirements](https://github.com/selldone-custom-layouts/official-senso/wiki/Shop-Requirements) |
| Build, upload and verify a release | [Build and Upload](https://github.com/selldone-custom-layouts/official-senso/wiki/Build-and-Upload) |
| Put the Layout live on your shop, or on one domain of it | [Go Live](https://github.com/selldone-custom-layouts/official-senso/wiki/Go-Live) |
| Change colours, fonts, photos, sections or pages | [Customize](https://github.com/selldone-custom-layouts/official-senso/wiki/Customize) |
| Fix a blank page, a rejected upload or an old version showing | [Troubleshooting](https://github.com/selldone-custom-layouts/official-senso/wiki/Troubleshooting) |

The wiki's source is also in [`docs/wiki/`](docs/wiki/).

### Theme and colours

Choose Senso's colours in one file, `components/senso/senso-theme.settings.ts`:

- `palette`: blue, emerald, violet, teal or orange;
- or `brandColor`: any `#RRGGBB`, made readable automatically (`textOnBrand: "auto"` keeps a light brand such as yellow, with dark words);
- `mode`: light or dark;
- `themeSwitcher`: showcase, on or off.

You can also tell your AI agent "use the yellow theme" or "make it dark": `AGENTS.md` (section "Theme") tells it what to change. Then build and upload. See the wiki page [Theme and colours](https://github.com/selldone-custom-layouts/official-senso/wiki/Theme-and-colours).

The header's Theme button (palettes, Custom colour, Light / Dark) is a showcase feature. It shows only on Senso's own showcase shop (Selldone shop 15549), so when you import Senso into your shop, your shoppers see Senso in its designed blue, with no Theme button. The Layout looks exactly as it does without the switcher, and any stored choice is ignored. To offer the switcher to your shoppers, set `themeSwitcher: "on"` in `components/senso/senso-theme.settings.ts`, then build and upload. `themeSwitcher: "off"` hides it everywhere.

## Quick start (developers)

```bash
git clone https://github.com/selldone-custom-layouts/official-senso.git
cd official-senso
npm run setup            # Selldone's modules
npm install --force
npm run serve            # dev server on http://localhost:9130
```

Point `.env` at your shop (`VITE_APP_SAMPLE_SHOP_NAME`). Releases: `bash scripts/release.sh <new-version> desk`. See [Build and Upload](https://github.com/selldone-custom-layouts/official-senso/wiki/Build-and-Upload).

## Where things are

| Area | Files |
| --- | --- |
| The home page, card, rails, hero, mega menu, filter panel, product overview | [`components/senso/`](components/senso/) |
| The name and logo (one place) | [`components/kalio/kalio-brand.ts`](components/kalio/kalio-brand.ts), [`assets/brand/`](assets/brand/) |
| Lifestyle photos, named `<shape>-<category name>.webp` | [`assets/senso/`](assets/senso/) |
| Tokens: blue, red, navy, the grey floor, Plus Jakarta Sans | [`style/kalio-tokens.scss`](style/kalio-tokens.scss) |
| Senso's dress | [`style/senso-skin.scss`](style/senso-skin.scss), [`style/senso-pages.scss`](style/senso-pages.scss) |
| What Senso changed, and why | [`SENSO.md`](SENSO.md) |
| The components and every behaviour it shares with Molino and Tario | [`components/kalio/`](components/kalio/), [`KALIO.md`](KALIO.md), [`TARIO.md`](TARIO.md) |
| Release tooling | [`scripts/`](scripts/) |
| Selldone storefront's original README | [`README.selldone.md`](README.selldone.md) |

## Credits and license

Built on the official [Selldone Storefront](https://github.com/selldone/storefront) (MIT License, © Selldone); see [`LICENSE.md`](LICENSE.md). Part of **[Selldone Custom Layouts](https://github.com/selldone-custom-layouts)**.
