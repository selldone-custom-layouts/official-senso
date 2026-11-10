# Senso Electronics

![Senso Electronics on desktop and phone](https://raw.githubusercontent.com/selldone-custom-layouts/official-senso/main/docs/screenshots/cover.jpg)

**Senso Electronics** is a custom storefront **Layout** for Selldone shops. A Layout is the whole look and behaviour of a shop's storefront: the pages your shoppers see.

Senso dresses a single-seller electronics shop like a premium electronics **brand site**: calm, spacious and cinematic.

- Big full-bleed photos and lots of white space.
- Bold Poppins headings, each under a small teal "eyebrow" (a short word in capitals, such as FEATURED).
- One teal colour for every button, as rounded "pills".
- Pale mint tiles behind the product cut-outs, and soft 18–20px corners.
- Thin line icons drawn for Senso, its own wordmark, and no line under any word or icon.

It runs on **[senso.selldone.shop](https://senso.selldone.shop)**. That is an extra address (domain) of the Selldone shop Digini, and it carries its own Layout (see [Go Live](Go-Live)). It is built on the official [selldone/storefront](https://github.com/selldone/storefront), so Selldone's cart, checkout, payments and orders keep working underneath.

Senso started from Digito, another Layout in the same organisation: <https://github.com/selldone-custom-layouts/official-digito>.

## Start here

| I want to… | Page |
| --- | --- |
| Have an AI agent set it up on my shop | **[Install with AI](Install-with-AI)** |
| Set it up myself | [Manual Setup](Manual-Setup) |
| Know what my shop's data needs | [Shop Requirements](Shop-Requirements) |
| Build, upload and verify a release | [Build and Upload](Build-and-Upload) |
| Put it live on my shop, or on one domain of it | [Go Live](Go-Live) |
| Change the name, families, photos, sections, pages | [Customize](Customize) |
| Change the colours, or switch to dark | [Theme and colours](Theme-and-colours) |
| Fix a problem | [Troubleshooting](Troubleshooting) |

## How a Selldone Layout works (one minute)

1. A **Layout** is a complete storefront app (Vue 3) that runs on Selldone's own servers instead of the default storefront.
2. You build it, zip it, and **upload** it to your Selldone developer account with the official [selldone-cli](https://github.com/selldone/cli). Each upload is a new **version**.
3. You **attach** a version to your shop, or to one of its domains.
4. Selldone gives the Layout **your** shop: its products, categories, prices, deals, tags, articles, languages and settings. Nothing about Digini is hard-coded. The Layout's own name is one line.

## What you get

- **Header:** clear over the dark hero, then solid white once the page scrolls.
  - Your product **families** in the middle (TV & Display, Audio, Computing…). Senso builds them from your category names. A click on a family opens a clean panel with its categories and one featured product.
  - Support, search, account, Theme and the cart on the right.
  - On a phone: a full-screen menu with the families as folding lists. There is no bottom tab bar.
- **Home**, from top to bottom:
  - a full-bleed photo carousel ("hero"), one slide per family;
  - **FEATURED**: a wide photo card that tells one family's story, over pale tiles, one per category, each with its best product as a large cut-out;
  - **COLLECTIONS**: one tab per tag your products carry, best sellers first;
  - **LIFESTYLE**: a second wide card with its own tiles;
  - **DEALS** "Offers worth a closer look": the biggest savings;
  - **CATEGORY** "Shop the latest": every category as a line-icon tile;
  - **NEW** "Just arrived": products with the new-arrival tag;
  - **STORIES**: your four newest articles;
  - a newsletter form.
- **Cards:** the product on a soft grey well, colour swatches or capacity chips, the price with "Was" and a red "Save $X", and an "Ends in …" line that counts down to the deal's real end date. "Add to cart" becomes "− n in cart +" in place. A product whose capacities have their own prices says "Choose options".
- **Category, search and offers pages:** a dark banner with a headline and a photo, the category's kinds as chips, a result count and a sort menu, a filter card, and three cards a row.
- **Product page:** the gallery beside a sticky buying column, then **Highlights** bands from the product's own article, a two-column **Specifications** table, **Compare with similar**, reviews, "Frequently bought together" and "You may also like".
- **Every other page in the same dress:** the support centre (FAQ), Contact, About, Terms, Privacy, the blog, the 404 page, compare, the cart drawer and page, checkout, the order page and the account (design "desk").
- **Theme:** five tested palettes, or your own brand colour, in light or dark. See [Theme and colours](Theme-and-colours).
- **Photos:** 19 photo slots. Each shows a designed placeholder until you add its photo. See [Customize](Customize#photo-slots).
- **No seller interface:** one shop sells everything.

## Links

- Live shop: <https://senso.selldone.shop>
- Repository: <https://github.com/selldone-custom-layouts/official-senso>
- What Senso changed, its Layout id and its release log: [`SENSO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/SENSO.md). Every shared behaviour: [`KALIO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/KALIO.md)
- All official custom Layouts: <https://github.com/selldone-custom-layouts>
- Selldone: <https://selldone.com>
