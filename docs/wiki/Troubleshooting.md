# Troubleshooting

## The shop shows a blank page, or an old page flashes first

A chunk imports `../shop.js`, so the app loads twice through Selldone's redirect. Keep shared code in the `core` chunk and don't use `experimentalMinChunkSize` (both in `vite.config.ts`). `release.sh` refuses such a build.

## Chunks fail with a MIME error (`text/x-java`)

Selldone stores the MIME type it sniffs from each file. Every JS file must start with `"use strict";`: that is `sniffAsJavaScript` in `vite.config.ts`. Check with `file --mime-type dist/app/js/*.js`.

## The upload is rejected

| Message | Fix |
| --- | --- |
| "The manifest must be an array." | Upload with `scripts/kalio-deploy.mjs`, not the plain CLI. |
| "Archive paths must be safe relative app/ paths." | Remove `dist/index.html`, and use no spaces or brackets in file names. |
| "Active SVG attributes" / "only passive vector shapes" | Run `node scripts/kalio-svg-flatten.mjs dist/app`. |
| Request cut off after ~100 s, and the version exists but is empty | Too many files. Stay under ~360, then upload a **new** version number. |
| 401 | The CLI is signed out (`~/.selldone-dev/.persist` is empty). Run `selldone` → Login. |

## The upload worked but the shop still shows the old version

- The version isn't attached yet: see [Go Live](Go-Live).
- A custom domain keeps its own selection. Set it to **inherit**.
- You checked a URL with a query. Open the plain address and read `window.sdShopLayout`.
- The ZIP was stale: always package with `--force` and compare `shop.js` with `cmp`.

## `/` shows a landing page, the Layout is only on `/shop`

The shop's Home is a Page Builder page. Set Home to **Shop**: see [Go Live](Go-Live).

## Purple or blue buttons appear in some places

Those are Selldone's own components using the theme colour. Set `--v-theme-primary` and `--v-theme-secondary` in `style/kalio-tokens.scss`.

## Filters are missing or show old values

Specs must be **flat**, plus `spec_order`. Save the category's filter list again after editing specs. See [Shop Requirements](Shop-Requirements).

## A deal does not show

A discount counts only between its start and end dates, as Selldone's own price rule and the cart do. A product whose discount end date has passed shows its full price and no "Save" chip. Clear or move the end date in the dashboard.

## A tag has no row on the home

A tag with no products shows nothing. Selldone has no list of a shop's tags, so the Layout finds tags through a vocabulary of common ones (`VOCABULARY` in `components/senso/senso-home.ts`) and every other tag those products carry. Add the tag to that list, or put one of the common tags on one of its products.

## A category has no photo

The slot shows a collage of the category's own products. Add `assets/senso/<shape>-<category name>.webp` (see Shop Requirements).

## The map is grey or 0 px tall

`mapbox-gl.css` sets `position: relative` on the map; the canvas must stay `position: absolute`. Use the `streets-v12` style. Search finds streets and numbers, not landmarks.

## Address search only works after pressing Enter (Android)

`v-model` waits for the keyboard's composition to end. Read the input with `:value` and `@input`.

## Sticky parts don't stick

Vuetify's `.v-application` has `overflow: hidden`. Switch it to `overflow: clip` on the pages that need sticky.

## GitHub blocks the push: "Mapbox Secret Access Token"

Selldone's storefront history contains Selldone's **public** Mapbox browser key (`pk.`). It has been public in `selldone/storefront` since 2023. Allow it once with the link GitHub prints, or remove it from your own commits.
