# Shop Requirements

The Layout reads everything from your shop. Only three things are written into the Layout itself:

- its own name (one line in `components/kalio/kalio-brand.ts`);
- the family names and lines (`components/senso/senso-families.ts`);
- the lifestyle photos (`components/senso/senso-photos.ts`).

Here is what your shop's data needs so that each part looks as it does on [senso.selldone.shop](https://senso.selldone.shop). A section with nothing to show is not drawn, so a missing piece leaves no empty box.

## Shop settings

| Setting | What to set | Where it shows |
| --- | --- | --- |
| **Home** (of the shop, or of the domain that carries the Layout) | The **Shop** page, not a Page Builder landing page | `/` shows the Layout's home. With a landing page as Home, `/` shows that page and the Layout's home is only at `/shop`. A domain can have its own Home (`selldone_shop_home_domain_set`). |
| **Business model** | A normal (single-seller) shop | The Layout shows no seller interface. On a marketplace, the shared seller parts are still in the code, but Senso does not draw seller pages. |
| **Guest checkout** | Your choice | When guests may buy, "Add to cart" works signed out. Otherwise it asks the shopper to sign in first, as Selldone's own button does. |
| **Payment methods** | At least one, for your currency | Without one, the cart says the shop is not taking payments yet, and Pay does not open an empty window. |
| **Shipping methods / pickup** | What you offer | The product page lists them under "Add to cart". The cart and checkout offer them. |
| **Login modes, OAuth** | Your choice. Your custom domain gets Selldone's OAuth callback automatically. | Sign-in sheet |
| **Currency, country, language** | Your market | Prices, address form, texts |

## Categories

Senso groups your categories into **families** by their names. A family is a group such as TV & Display, Audio, Computing, Cameras, or Storage & Power. A category whose name fits no family goes to **More**. A family with no category is not shown.

Each category gets, with no extra work:

- a **line icon**, picked by its name ("TVs", "Headphones", "Power banks"…). An unknown kind gets a generic device icon;
- a **row in its family's panel** in the header, with a price line ("Up to $X off" or "From $Y");
- a tile in **"Shop the latest"** on the home;
- a **home tile** in FEATURED or LIFESTYLE, showing its **showcase product**: in stock first, then the biggest saving, then the highest price;
- its own page, with a dark banner.

Give each category:

- a clear **title**, and a **name** (the "slug": the word in its web address). Families and icons are matched on both;
- a short **description**: it is the line under the headline on the hero slide and on the category's banner.

## Products

- **Images:** the **first image** is the "packshot" (the product alone, centred, on a white or transparent background). It shows on cards, tiles and the gallery.
- **Extra gallery images** feed the **Highlights** bands on the product page: up to three bands, each pairing one extra image with words.
- **Article:** write the product's article with **bold headings** ("Performance", "Design"…) and a few lines under each. Each heading and its words become a Highlights band. Without an article, the bands use the spec groups. With neither, only the first band shows.
- **Title:** two lines show on cards, then "…".
- **Brand:** fill Selldone's *brand* field. It shows on the product page's brand and model line and in the Brand filter. The model comes from the MPN, the SKU, or a "Model" spec.
- **Colours and capacities:** use **variants**. A colour shows as a swatch on the card, and "Add to cart" adds the colour picked. When capacities have their own prices, the card says "Choose options" and opens a quick-buy sheet. A variant with its own picture shows it on the product page.
- **Stock:** quantity 0 shows "Out of stock".
- **Description:** what a shopper needs. No notes from whoever generated the data.

## Deals and their clocks

- A product's discount counts only between its start and end dates (`dis_start`, `dis_end`), as Selldone's own price rule and the cart do. A deal whose end date has passed is not shown as a deal.
- A deal **with an end date** gets a real clock: "Ends in …" on its card, a countdown on its product page, and the offers page banner counts to the soonest end.
- A deal **with no end date** shows no clock. Nothing is invented.
- DEALS on the home shows the biggest savings, two at most per category.

## Tags

A **tag** is a short label on a product (for example `wireless` or `4k`).

- **best-seller** (or bestseller, best-sellers, top-seller) is the **first tab** of COLLECTIONS, "Best sellers".
- **new-arrival** (or new-arrivals, new, just-in) fills **"Just arrived"**. Without it, that section is hidden.
- **Any other tag** gets its own tab in COLLECTIONS, named after it ("4k" → "4K"). A new tag makes a new tab with no code change.
- A tag with no products shows nothing. With no tag at all, COLLECTIONS is not drawn.
- Selldone's storefront has no list of a shop's tags. The Layout asks for a list of common tags in one request (`VOCABULARY` in `components/senso/senso-home.ts`) and also picks up every other tag those products carry. A tag that no such product carries is not found: put one of the common tags on one of its products, or add the tag to `VOCABULARY`.

## Specs and filters

A **spec** is a product's list of facts (Screen size: 55", Connectivity: Bluetooth). Senso uses specs in five places:

- the **filters** on category pages (beside price, colour, capacity, brand and "On sale");
- the **kinds chips** under the category banner (a spec such as Display or Form Factor; without one, the brands). A click filters the list;
- the **Specifications** table on the product page, in your own groups;
- the "At a glance" list in the first Highlights band;
- **Compare with similar** (the facts the products share, six at most).

Rules:

- Store specs **flat**, with group names as markers: `{"Design": "group", "Color": ["Silver"], "Connectivity": ["Bluetooth"]}`, plus a `spec_order` with every key. A nested spec is silently ignored.
- A category's filter values are collected **when its filter list is saved**. After editing specs, save the list again.
- A key with the same value on every product of a category makes no useful filter. Give products real, differing values.

## Ratings and reviews

- **What shows:** a product's average and its number of ratings, and its Reviews section with the shop's rating criteria and the reviews. "No reviews yet" until someone has rated it.
- **Who can rate:** only shoppers who bought the product. Buyers get a "Verified Buyer" badge.
- **What Selldone doesn't offer:** a 5-to-1 breakdown, "helpful" votes, review photos and sorting by rating. The Layout doesn't fake them.

## Articles, newsletter, FAQ and pages

- **Articles (blog posts):** STORIES on the home shows your four newest, with their pictures. Selldone's demo posts are left out once you have your own. Pictures on another host are resized through a public image proxy.
- **Newsletter:** the home's form uses Selldone's own newsletter subscription. It belongs to a customer account, so a guest is asked to sign in first. The form keeps what they typed.
- **FAQ:** your shop's FAQ entries become the questions of the **support centre**, as folding answers ("accordions") with a search box. Their topics show as pills. With no entry, the page shows one calm card with a link to Contact.
- **About, Terms, Privacy:** write them in your shop's profile. Until then, the Layout shows general sample text under a clear "Sample text" note.
- **Contact:** the form is Selldone's own contact form. The shop's contact profile text shows beside it when written.

## Photo slots

Senso has **19 photo slots**: one hero slide, one category banner and one Highlights photo per family, two wide home cards, the About banner and the support banner. They are listed, with their sizes, in `components/senso/senso-photos.ts`.

- Until a slot's photo exists, it shows a designed placeholder: a calm tinted panel with a small photo icon and the file name.
- Meanwhile, the hero and About use your own wide category photos when you add them as `assets/senso/wide-<category name>.webp` (16:9, the left side calm for the words).
- No photo is required: the Layout is complete with placeholders.

How to add them: [Customize](Customize#photo-slots).

## Quick checklist

- [ ] Home = Shop page (for the shop or the Layout's domain)
- [ ] Every category has a clear title, name and description, and lands in the right family
- [ ] Every product has a clean packshot as its first image, a brand and a stock quantity
- [ ] Products you want to tell a story about have extra images and an article with bold headings
- [ ] Colours and capacities are variants
- [ ] Deals have an end date (for a clock), and none in the past
- [ ] Tags are on the products for the COLLECTIONS tabs and "Just arrived"
- [ ] Specs are flat with groups, and category filter lists are saved
- [ ] FAQ entries written
- [ ] At least one payment method and one shipping method
- [ ] About, Terms and Privacy written
