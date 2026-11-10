# AI Agent Entry Point

Detailed AI instructions and reusable custom Storefront Layout material live
in the dedicated [`.ai-agent/`](.ai-agent/) directory so they stay separate
from application source.

For tasks that customize, redesign, audit, package, or publish this Storefront
as a custom Selldone Layout, read these files completely:

1. [`.ai-agent/AGENTS.md`](.ai-agent/AGENTS.md)
2. [`.ai-agent/SKILL.md`](.ai-agent/SKILL.md)
3. [`.ai-agent/AI_WORKFLOW.md`](.ai-agent/AI_WORKFLOW.md) when GitHub setup,
   dependency synchronization, packaging, authentication, or deployment is in
   scope

The official Vue 3/Vite Storefront is the implementation baseline. This kit
does not authorize a framework replacement or a parallel storefront app; the
visual design may change completely while the platform and commerce contracts
remain intact. Do not change the official repository's Git remote model or run
release commands merely because this shim exists. Apply publication rules in
the owner's controlled clone, fork, or release branch.

## Language and currency (money and words)

The visitor's currency and language come from Selldone; the switcher is `components/region-switcher/` (a shared package: do not edit the copy; its guide is `new-shop-kits/region-switcher/PORTING.md`).

- **Every amount** goes through `money(amount, currency)` (`components/senso/senso-home.ts`): `amount` is in `currency` (a product's `currency`, a delivery way's `currency`, the basket's `currency`; omit it for the shop's base currency) and is shown in the visitor's currency, converted with the shop's rates. Never format with `$shop.currency` (it does not exist) or a fixed "USD".
- **Product prices** use `priceOf(shop, product, currentCurrency())` and format with the result's `currency`.
- **Words** live in `components/senso/i18n/en.ts` and are read with `t("key")` from `region-switcher/region`. To add a language the owner enabled in the shop, add `<code>.ts` with the same keys and register it in `components/senso/i18n/index.ts`.
- **Check:** `components/region-switcher/tools/currency-check.cjs` must print `TOTAL 0` (Senso: `MENU=".sn-header__ic.-menu" MEGA=".sn-header__fam" CART=".sn-header__ic.-cart" FILTER_SIGN=".sn-price-range__boxes label span"`).

## Theme (palette, brand colour, light or dark, the visitor switcher)

When a merchant asks for a theme ("use the yellow theme", "my brand colour is #F5C400", "make it dark"), edit **one file only**: `components/senso/senso-theme.settings.ts`. Nothing else needs to change, and the colours are made readable automatically (buttons, links, header, dark mode).

| Setting | Allowed values |
| --- | --- |
| `palette` | `"teal"` (Senso teal, the default), `"ocean"`, `"violet"`, `"forest"`, `"ember"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette` |
| `mode` | `"light"` or `"dark"` |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on Senso's own showcase shop; the default), `"on"` (the merchant's visitors get the Theme row in the footer: the palettes, a custom colour and Light / Dark), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on its buttons) or `"white"` (white words; a light colour is darkened) |

Worked examples (change only these lines; leave the rest of the file as it is):

- **"Use the yellow theme"**: there is no tested yellow palette, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"`. Yellow buttons get dark words.
- **"My brand colour is #F5C400"**: `brandColor: "#F5C400", textOnBrand: "auto"`. Add `textOnBrand: "white"` instead if they want white words, in which case the colour is darkened.
- **"Make it dark"**: `mode: "dark"`.
- **"Let visitors switch themes"**: `themeSwitcher: "on"`.
- **"Remove the switcher"**: `themeSwitcher: "off"`. On a merchant's own shop it is already hidden with `"showcase"`.
- **"Go back to Senso's teal"**: remove `brandColor` and set `palette: "teal", mode: "light"`.

Then release and check:

1. Build and upload: `LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh <new version>`; see the wiki page Build and Upload. Put the version live as in Go Live.
2. Check the contrast on the live shop. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> "main"
   ```
   For a theme chosen in the settings, no `STORAGE` is needed: the settings are the default.
3. If the visitor switcher is on, scroll to the footer: its Theme row must show the palettes, the custom colour and Light / Dark, and the contrast audit above covers it.

More: the wiki page **Theme and colours** (`docs/wiki/Theme-and-colours.md`).
