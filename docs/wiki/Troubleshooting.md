# Troubleshooting

## Uploads and releases

### The shop shows a blank page, or an old page flashes first

A chunk (one of the app's code files) imports `../shop.js`, so the app loads twice through Selldone's redirect. Keep shared code in the `core` chunk and don't use `experimentalMinChunkSize` (both in `vite.config.ts`). `release.sh` refuses such a build.

### Chunks fail with a MIME error (`text/x-java`)

Selldone stores the file type it guesses from each file's first bytes. Every JS file must start with `"use strict";`: that is `sniffAsJavaScript` in `vite.config.ts`. Check with `file --mime-type dist/app/js/*.js`.

### The upload is rejected

| Message | Fix |
| --- | --- |
| "The manifest must be an array." | Upload with `scripts/kalio-deploy.mjs`, not the plain CLI. |
| "Archive paths must be safe relative app/ paths." | Remove `dist/index.html`, and use no spaces or brackets in file names. |
| "Active SVG attributes" / "only passive vector shapes" | Run `node scripts/kalio-svg-flatten.mjs dist/app`. |
| Request cut off after ~100 s, and the version exists but is empty | Too many files. Stay under ~360, then upload a **new** version number. |
| 401 | The CLI is signed out (`~/.selldone-dev/.persist` is empty). Run `selldone` → Login. |

### The upload worked but the shop still shows the old version

- The version isn't attached yet: see [Go Live](Go-Live).
- A custom domain keeps its own selection. Set it to **inherit**, or pin the new version on that domain.
- You checked a URL with a query. Open the plain address and read `window.sdShopLayout`.
- The ZIP was stale: always package with `--force` and compare `shop.js` with `cmp`.

### `/` shows a landing page, the Layout is only on `/shop`

The Home is a Page Builder page. Set Home to **Shop**, for the shop or for the domain: see [Go Live](Go-Live).

### An automated browser opening `/product/…` sees a plain page

Selldone answers a script's direct visit to a product link with its own search-engine page, not the Layout. Open the home first and move to the product inside the app. `scripts/senso-layout-checks.cjs` and `contrast-audit.cjs` already do this.

## The design

### Buttons in another colour (purple) appear in some places

Those are Selldone's own parts using Vuetify's primary colour. Senso sets it to the palette's colour (`--v-theme-primary` in `style/kalio-tokens.scss`, fed by `senso-theme.ts`). A part that still shows another colour sets its own: restyle it in `style/senso-brand.scss`.

### A category is under "More" or in the wrong family

Families are matched on the category's name and title. Add a word from its name to the right family's `match` in `FAMILIES` (`components/senso/senso-families.ts`). See [Customize](Customize#product-families).

### A category shows the plain device icon

No rule in `components/senso/senso-icons.ts` matches its name. Add a rule to `RULES` (and a drawing to `KINDS` if it is a new kind).

### An icon shows as a word

It has no line icon and is missing from the `ICONS` list in `components/kalio/kalio-fonts.ts`. Add its Material Symbols name there.

### A photo slot still shows a placeholder

- The file name must match the slot exactly (see `components/senso/senso-photos.ts`), in `assets/senso/photos/`.
- WebP, JPG or PNG with the same base name all work.
- Photos are added at build time: build and release a new version.

### The hero has fewer slides than there are families

A slide needs its family's hero photo (`hero-<family>.webp`) or a wide photo of one of its categories (`assets/senso/wide-<category name>.webp`). A shop with no photo at all gets one placeholder slide per family, with its best product.

### Filters, kinds chips or the Specifications table are missing or show old values

Specs must be **flat**, plus `spec_order`. Save the category's filter list again after editing specs. See [Shop Requirements](Shop-Requirements#specs-and-filters).

### A deal does not show, or has no clock

- A discount counts only between its start and end dates, as Selldone's own price rule and the cart do. A product whose discount end date has passed shows its full price and no "Save".
- A deal with no end date has no clock. Give it an end date in the dashboard to get "Ends in …".

### A tag has no tab in COLLECTIONS

A tag with no products shows nothing. Selldone has no list of a shop's tags, so the Layout finds tags through a list of common ones (`VOCABULARY` in `components/senso/senso-home.ts`) and every other tag those products carry. Add the tag to that list, or put one of the common tags on one of its products.

### "Just arrived" is missing from the home

No product has the new-arrival tag (`new-arrival`, `new-arrivals`, `new` or `just-in`). See [Shop Requirements](Shop-Requirements#tags).

### The product page shows only one Highlights band

The other bands need extra gallery images, and an article with bold headings (or spec groups). See [Shop Requirements](Shop-Requirements#products).

### The newsletter asks the shopper to sign in

That is on purpose. Selldone's newsletter subscription belongs to a customer account. The form keeps what the shopper typed, and Submit subscribes them once they are signed in.

### There is no Theme row in my shop's footer

That is on purpose: with `themeSwitcher: "showcase"` it shows only on Senso's showcase shop. Set `themeSwitcher: "on"` to offer it. See [Theme and colours](Theme-and-colours).

## Other

### The map is grey or 0 px tall

`mapbox-gl.css` sets `position: relative` on the map; the canvas must stay `position: absolute`. Use the `streets-v12` style. Search finds streets and numbers, not landmarks.

### Address search only works after pressing Enter (Android)

`v-model` waits for the keyboard's composition to end. Read the input with `:value` and `@input`.

### Sticky parts don't stick

Vuetify's `.v-application` has `overflow: hidden`. Switch it to `overflow: clip` on the pages that need sticky.

### A fixed panel lands off-screen on a phone

Inside a Vuetify overlay, a fixed panel is placed against the overlay, not the screen. Teleport it to `body`.

### GitHub blocks the push: "Mapbox Secret Access Token"

Selldone's storefront history contains Selldone's **public** Mapbox browser key (`pk.`). It has been public in `selldone/storefront` since 2023. Allow it once with the link GitHub prints, or remove it from your own commits.
