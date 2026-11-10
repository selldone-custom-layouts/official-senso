# Theme and colours

Senso's colours are chosen in **one file**: `components/senso/senso-theme.settings.ts`. You can edit it by hand, or ask your AI agent: "use the yellow theme", "my brand colour is #F5C400", "make it dark". The agent instructions are in `AGENTS.md`, section "Theme". Nothing else needs to change.

```ts
export const THEME_SETTINGS: ThemeSettings = {
  palette: "teal",          // "teal" | "ocean" | "violet" | "forest" | "ember"
  // brandColor: "#F5C400", // any colour; replaces palette
  mode: "light",            // "light" | "dark"
  themeSwitcher: "showcase",// "showcase" | "on" | "off"
  textOnBrand: "auto",      // with brandColor: "auto" | "white"
};
```

## The five palettes

A **palette** is a tested set of colours: the button colour and its darker and paler shades, the link colour, the decoration colour (line icons, the mark) and the pale tile behind products. Each has a light and a dark version.

| `palette` | Name | Primary, light | Primary, dark | White words on it (light / dark) |
| --- | --- | --- | --- | --- |
| `"teal"` (default) | Senso teal | `#00736f` | `#008380` | 5.70 / 4.61 |
| `"ocean"` | Ocean blue | `#1a5fb4` | `#2c6cba` | 6.29 / 5.30 |
| `"violet"` | Violet | `#6b3fd1` | `#7a52d6` | 6.45 / 5.24 |
| `"forest"` | Forest | `#2e6b34` | `#437a48` | 6.42 / 5.10 |
| `"ember"` | Ember | `#ad4314` | `#b24e22` | 5.85 / 5.24 |

The last column is the contrast ratio (how readable white words are on the colour; 4.5 or more passes the WCAG accessibility rule). The palettes themselves are in `components/senso/senso-theme.ts`.

## What each setting does

| Setting | Allowed values | What it does |
| --- | --- | --- |
| `palette` | `"teal"`, `"ocean"`, `"violet"`, `"forest"`, `"ember"` | Picks one of the five tested palettes. |
| `brandColor` | any `"#RRGGBB"` | Your own colour. When set, it replaces `palette`. |
| `mode` | `"light"` or `"dark"` | Light or dark pages. |
| `themeSwitcher` | `"showcase"`, `"on"`, `"off"` | Whether visitors get the Theme row in the footer (see below). |
| `textOnBrand` | `"auto"` or `"white"` | Only with `brandColor`: the colour of the words on your buttons. |

- **`brandColor`**: Senso makes a whole palette from it: buttons, hover, tints, links, the decoration colour, the pale tile, and the dark mode. It keeps the colour's hue and changes only its lightness until every word reads at 4.5:1 or more (white words on the light buttons at 5.5:1, for a margin on the mint tiles).
  - With **`textOnBrand: "auto"`**, a light brand such as yellow keeps its colour, and its buttons get dark words. Links on white use a darker shade of it.
  - With **`textOnBrand: "white"`**, the colour is darkened until white words read.
- **`mode: "dark"`**: Senso's dark surfaces (a deep teal-black page and cards). Product photos stay on light tiles, so a white packshot keeps its edge hidden. The header stays clear over the hero and white or dark elsewhere; it is never painted with the brand colour.

## Worked examples

Change only these lines; leave the rest of the file as it is.

| You want | Set |
| --- | --- |
| "Use the yellow theme" | There is no tested yellow palette, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"`. Yellow buttons get dark words. |
| "My brand colour is #F5C400" | `brandColor: "#F5C400", textOnBrand: "auto"`. Use `textOnBrand: "white"` instead for white words; the colour is then darkened. |
| "Use the violet palette" | `palette: "violet"` (and no `brandColor`). |
| "Make it dark" | `mode: "dark"`. |
| "Let visitors switch themes" | `themeSwitcher: "on"`. |
| "Remove the switcher" | `themeSwitcher: "off"`. On your own shop it is already hidden with `"showcase"`. |
| "Go back to Senso's teal" | Remove `brandColor` and set `palette: "teal", mode: "light"`. |

## The Theme row in the footer: showcase, on or off

The footer's **Theme** row lets a **visitor** pick one of the five palettes, a free **Custom colour** (the colour wheel opens the browser's colour picker), and Light or Dark. Their pick is kept in their browser. It sits in a strip of its own just above the footer's legal row. (Until 10 November 2026 it was a Theme button at the top right of the header; the owner moved it to the footer after talking with the Selldone team, so the header keeps its room on every shop.)

- **`"showcase"`** (the default): the row shows only on the showcase shops listed in `showcaseShops` in `senso-theme.ts`. Senso's own is Digini (Selldone shop 15549). When you import Senso into **your** shop, your shoppers see your settings and no Theme row. The Layout looks exactly as it does without the switcher, and any stored pick is ignored.
- **`"on"`**: your visitors get the row. Your settings are its starting point.
- **`"off"`**: never shown, on any shop.

The settings are applied before the page first paints, so there is no flash of another colour.

## After a change

1. Build and upload a new version (see [Build and Upload](Build-and-Upload)), then put it live ([Go Live](Go-Live)).
2. Check the contrast on your live shop. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> "main"
   ```
   For a theme chosen in the settings, no `STORAGE` is needed: the settings are the default.
3. With the switcher on, open the footer and try a palette, the custom colour and Light / Dark; the contrast audit above already covers the row.

## A new palette

Add it to `palettes` in `components/senso/senso-theme.ts`, with a light and a dark set, and its name to the `palette` comment in `senso-theme.settings.ts`. White words on its primary need 4.5:1 or more; the tested palettes reach 5.5:1 or more in light mode. Check it with `contrast-audit.cjs`, as above.
