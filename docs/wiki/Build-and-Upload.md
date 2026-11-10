# Build and Upload

Every release is a **new version** of your Layout on Selldone. `scripts/release.sh` runs every step in order. This page explains each one.

## One-time setup

```bash
npm i -g selldone-cli                                  # the official CLI
git clone https://github.com/selldone/cli selldone-cli-src   # its packager lives in .agents/
```

Sign in to the CLI once:

1. Run `selldone`.
2. Choose **Login | Login to your Selldone account.**
3. Approve the sign-in in your browser and type your **2FA code** in the terminal.

`selldone login` is not a command. The sign-in is saved in `~/.selldone-dev/.persist`. If that file is empty, every upload answers 401 until you sign in again.

## Release

```bash
SELLDONE_CLI_SRC=../selldone-cli-src LAYOUT_ID=<Layout id> \
  bash scripts/release.sh 1.0.1 desk
```

The arguments:

- the **new version**, never used before;
- the **account design**: always `desk` for Senso (the buyer account with a side rail of sections).

`<Layout id>` is **your** Layout's number on Selldone. Leave `LAYOUT_ID` out on the very first upload. Afterwards, read the id from the Selldone developer panel. Senso's own id is in [`SENSO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/SENSO.md).

`scripts/ship-built.sh` is the second half of the same script, for a build you have already made: checks, package, upload, verify.

## What the script does, and why

| Step | Why |
| --- | --- |
| Bump `version` in `manifest.json` | A version number is used up even when an upload fails. Never reuse one. |
| `npm run build-production` | Outputs `dist/app/shop.js`, `shop.css` and chunks with a **relative base**. Releases are served from `cdn.selldone.com/public/layouts/<id>/releases/<ULID>/app/`. |
| `rm dist/index.html` | Every ZIP member must be under `app/`. In production the Layout runs inside Selldone's HTML, so `index.html` is never used. The Poppins font and the fallback icons load from the app code. |
| `scripts/kalio-svg-flatten.mjs` | Selldone accepts only passive SVG attributes. `style`, `<style>`, `xml:space`, `enable-background`, `display`, `fx/fy`, `data-*` and character references in values are refused. |
| MIME check (`file --mime-type`) | Selldone stores the file type it guesses from each file's first bytes (its "MIME type"). A chunk starting with `import{` is stored as `text/x-java`, which browsers refuse. Every chunk starts with `"use strict";` (`sniffAsJavaScript` in `vite.config.ts`). |
| No `../shop.js` imports | Selldone's loader reaches `shop.js` through a redirect. A chunk importing `../shop.js` loads the app twice: an old page flashes, then the page goes blank. Shared code lives in a `core` chunk. |
| File count under ~360 | The archive is unpacked inside the upload request, behind a ~100 s limit. At 714 files it was cut off mid-way and the version was burned. The 19 photos add 19 files, which still fits. |
| `package_layout.py … --force` | Without `--force`, an old `dist.zip` is kept and it still prints PASS. |
| `cmp` of `shop.js` | Proves the ZIP is this build. |
| `scripts/kalio-deploy.mjs` | Uploads with the official CLI's sign-in and checks, sending the manifest in the form the server accepts. |
| `scripts/kalio-verify-deploy.mjs` | Asks the server: the newest deploy must show `extracting:false`, `error:null`, `js_match:true` and `css_match:true`. **A CLI exit code is not proof.** |

## Upload rules found by testing (November 2026)

- `manifest` holds only `package, version, name, description, storefront, backoffice`.
- No spaces or brackets in any file name (`safeName` in `vite.config.ts`).
- The `package` name never changes after the first upload.
- An upload creates a **beta** version. Your shop doesn't change until you attach it: see [Go Live](Go-Live).

## Checks after a release

Run both on the live address once the version is attached. Each must print `TOTAL 0`.

1. **Contrast** (every word readable on its colour):
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> "main"
   ```
2. **Layout checks** (`scripts/senso-layout-checks.cjs`), at phone (390) and computer (1440) width:
   - every product or photo image sits inside its own box, and no text overlaps it;
   - in every list of icon-and-text rows, the icons line up, and the words line up.
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" \
     node scripts/senso-layout-checks.cjs https://<your shop> "main"
   ```
   It needs Playwright (a browser that scripts can drive). Set `PLAYWRIGHT` to your Playwright folder (for example `node_modules/playwright`): the default path in the script is the author's own.

Both check the theme set in `senso-theme.settings.ts`. Where the Theme button shows, you can test a visitor's pick with `STORAGE='{"senso-theme":"{\"palette\":\"teal\",\"mode\":\"dark\"}"}'` in front of the command. On a shop without the button, a stored pick is ignored (see [Theme and colours](Theme-and-colours)).

## Preview a release before it is live

```bash
node --use-system-ca scripts/kalio-live-preview.mjs <release-ULID> 9125
```

This serves a shop's real HTML on <http://localhost:9125>, with the loader pointed at that release. The ULID is in the deploy path that `kalio-verify-deploy.mjs` prints.

- The shop it serves is the `SHOP` line at the top of the script. Set it to your shop's address first.
- It swaps only the release, so use a release of the Layout that address already shows.
