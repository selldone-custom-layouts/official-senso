# Shop Requirements

The Layout reads everything from your shop. Nothing about Digini is hard-coded except the Layout's own name (one line in `components/kalio/kalio-brand.ts`) and the lifestyle photos, which are matched to categories by their names. Here is what your shop's data needs so that each part looks as it does on [senso.selldone.shop](https://senso.selldone.shop).

## Shop settings

| Setting | What to set | Where it shows |
| --- | --- | --- |
| **Home** (of the shop, or of the domain that carries the Layout) | The **Shop** page, not a Page Builder landing page | `/` shows the Layout's home. With a landing page as Home, `/` shows that page and the Layout's home is only at `/shop`. A domain can have its own Home (`selldone_shop_home_domain_set`). |
| **Business model** | A normal (single-seller) shop | The Layout shows no seller interface. On a marketplace, Kalio's seller parts are still in the code but Senso does not draw seller pages. |
| **Guest checkout** | Your choice | When guests may buy, "Add to cart" works signed out; otherwise it asks the shopper to sign in first, as Selldone's own button does. |
| **Payment methods** | At least one, for your currency | Without one, the cart says the shop is not taking payments yet, and Pay does not open an empty window. |
| **Shipping methods / pickup** | What you offer | The product page's buy card lists them ("Delivery", "Pickup — Free"); the cart shows them as Delivery method tiles. |
| **Login modes, OAuth** | Your choice. Your custom domain gets Selldone's OAuth callback automatically. | Sign-in card |
| **Currency, country, language** | Your market | Prices, address form, texts |

## Categories

- Each **top-level category** is a circle in "Shop by category" (two even rows; an "All categories" tile keeps them even), a row in the mega menu, a doorbuster when it has deals, a hero slide or photo card when it has a photo, and its own page.
- Give each category:
  - an **icon or picture**: square, on a plain or transparent background (shown in a circle);
  - a short **description**: it is the hero's line and the line under the category's title;
  - a clear **title**, and a **name** (the slug in its address): the lifestyle photos are matched on it.

## Lifestyle photos (optional)

Put them in `assets/senso/` as `<shape>-<category name>.webp`:

| Shape | Size | Where | Rule |
| --- | --- | --- | --- |
| `wide` | 1600 × 900 | the home's hero (one slide per photo) and About | the left third quiet for the words (they sit on a dark gradient) |
| `portrait` | 720 × 900 | "Gear for every moment" | the bottom quiet for the words |
| `square` | 800 × 800 | the mega menu's photo tile, short product rows | — |

No text, logos or faces in the photos. A category without a photo gets a collage of its own products, so the Layout is complete without any.

## Products

- **Photos:** the product on a white or transparent background, centred. Every product sits on a white well.
- **Title:** two lines show on cards, then an ellipsis.
- **Brand:** fill Selldone's *brand* field. Cards say "Brand · Category"; the home has "Shop by brand"; the header has a Brands menu.
- **Colours and capacities:** use **variants**. A colour shows as a swatch on the card, and "Add to cart" adds the colour picked. A capacity (*volume*) with its own price makes the card say "Choose capacity" and open a quick-buy sheet. A variant with its own picture shows it on the product page.
- **Stock:** quantity 0 shows "Out of stock".
- **Deals:** a product's discount counts only between its start and end dates, as Selldone's own price rule and the cart do. A deal whose end date has passed is not shown as a deal. Clear old end dates for deals that should keep running.
- **Description:** what a shopper needs. No notes from whoever generated the data.

## Tags

- **best-seller** (or bestseller, best-sellers, top-seller) fills the **Best sellers** bento. No tagged product, no section.
- **new-arrival** (or new-arrivals, new, just-in) fills **New arrivals**; without it the row shows the newest products.
- **Any other tag** gets its own row titled "<Tag> Items" ("4k" → "4K Items"). A tag with no products shows nothing.
- Selldone's storefront has no list of a shop's tags. The Layout asks for a vocabulary of common merchandising tags in one request and also picks up every other tag those products carry. A tag that no such product carries is not found: add one of the common tags to at least one of its products, or add the tag to `VOCABULARY` in `components/senso/senso-home.ts`.

## Ratings and reviews

- **What shows:** a product's average and its number of ratings appear under its title, and its Reviews section lists the shop's rating criteria and the reviews. "No reviews yet" until someone has rated it.
- **Who can rate:** only shoppers who bought the product. Buyers get a "Verified Buyer" badge.
- **What Selldone doesn't offer:** a 5-to-1 breakdown, "helpful" votes, review photos and sorting by rating. The Layout doesn't fake them.

## Filters (specs)

A category page's filter panel comes from the category's **filter list** (built from **product specs**) plus price, colour, capacity and brand.

- Store specs **flat**: `{"Design": "group", "Color": ["Silver"], "Connectivity": ["Bluetooth"]}` plus a `spec_order` with every key. A nested spec is silently ignored. The product page's Key specs and Specifications table read the same groups.
- A category's filter values are collected **when its filter list is saved**. After editing specs, save the list again.
- A key whose value is the same on every product of a category makes no useful filter; give products real, differing values.

## Content pages

- **About, Terms, Privacy:** write them in your shop's profile. Until then, the Layout shows general sample text under a clear "Sample text" note.
- **Contact:** the form is Selldone's own contact form; the shop's contact profile text shows beside it when written.
- **FAQ:** your shop's FAQ; empty, it is one calm card with a link to Contact.
- **Blog:** your posts. Selldone's demo posts are left out once you have your own. Article pictures on another host are shown resized through a public image proxy.

## Quick checklist

- [ ] Home = Shop page (for the shop or the Layout's domain)
- [ ] Every top-level category has an icon, a description and a clear name
- [ ] Every product has a clean photo, a brand and a stock quantity
- [ ] Colours and capacities are variants
- [ ] Deals have no end date in the past
- [ ] Specs are flat, and category filter lists are saved
- [ ] At least one payment method and one shipping method
- [ ] About, Terms and Privacy written
