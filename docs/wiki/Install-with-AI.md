# Install with AI

An AI coding agent (for example **Claude Code** or **OpenAI Codex**) can set this Layout up on your Selldone shop. It forks the repository, points it at your shop, builds it, uploads it and puts it live, while you do the few steps that need you. This page gives you what to prepare, a prompt to paste, and what to expect.

## 1. Prepare (10 minutes)

| You need | Why | Where |
| --- | --- | --- |
| A Selldone shop with products and categories | The Layout shows your live data | [selldone.com](https://selldone.com) |
| Your shop's **handle** (the name in `name.myselldone.com`) and **shop id** | The agent uses them in `.env` and when attaching | Shop dashboard |
| A GitHub account | Your own copy (fork) of this repository | [github.com](https://github.com) |
| A computer with **Git**, **Node.js 20+**, **Python 3** and **Bash** (Git Bash on Windows) | Building and packaging | — |
| An AI coding agent that can run terminal commands | Does the work | Claude Code, Codex… |
| Optional: the **Selldone MCP connector** for your shop | Lets the agent attach the Layout and set your Home page for you | [selldone.com/mcp/connections](https://selldone.com/mcp/connections) |

**Your part.** Only you should do these, and the agent will ask you when the time comes:

- **Sign in to the Selldone CLI.** Run `selldone`, choose **Login**, approve the sign-in in your browser and type your **2FA code**. Never give a password or code to the agent.
- **Approve the GitHub fork** (or create the repository yourself).
- **Attach the Layout to your shop,** unless the agent has the Selldone MCP connector.

## 2. Paste this prompt into your agent

Fill in the four values in braces first.

```text
Set up the Selldone custom Layout "Senso Electronics" on my Selldone shop.

My shop handle: {SHOP_HANDLE}        (as in {SHOP_HANDLE}.myselldone.com)
My shop id: {SHOP_ID}
My GitHub account: {GITHUB_USER}
New Layout package name (lowercase, permanent, unique to me): {PACKAGE}   e.g. mybrand-market

Source: https://github.com/selldone-custom-layouts/official-senso

Before you change anything, read completely: README.md, SENSO.md, KALIO.md, every file in
docs/wiki/, and .ai-agent/AGENTS.md, .ai-agent/SKILL.md, .ai-agent/AI_WORKFLOW.md.

Then:
1. Fork the repository to my GitHub account (or create {GITHUB_USER}/{PACKAGE}) and clone it
   with submodules. Keep https://github.com/selldone/storefront as a fetch-only "upstream".
2. npm run setup, then npm install --force. Put my shop in .env: VITE_APP_SAMPLE_SHOP_NAME={SHOP_HANDLE},
   and my currency, country and language. Run the dev server and check home, a category,
   a product page and the cart against my shop. Tell me what my shop's data is missing
   (see docs/wiki/Shop-Requirements.md) instead of hard-coding anything. Put my shop's
   name in BRAND.name (components/kalio/kalio-brand.ts), or null to use the shop's title.
   Replace or remove the photos in assets/senso/ (named <shape>-<category name>.webp).
3. In manifest.json set "package" to {PACKAGE}, "name" to my shop's name plus "Electronics"
   (at least 8 characters), and "version" to 1.0.0. The package name is permanent after
   the first upload.
4. Install the CLI (npm i -g selldone-cli) and clone https://github.com/selldone/cli for its
   packager. Ask me to sign in to the CLI myself (I type my 2FA code). Never print or
   store tokens, never type a password or 2FA code for me.
5. Release with: SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh 1.0.0 desk
   Then read my new Layout id and verify with scripts/kalio-verify-deploy.mjs:
   extracting false, error null, js_match and css_match true. Never reuse a version number.
6. Attach the exact version to my shop (with the Selldone MCP connector, api.shops.layout.set,
   mode private, exact version; or tell me the dashboard steps). Make every domain inherit
   the shop's layout and set the shop's Home to the shop page.
7. Open my shop's address without a query and confirm window.sdShopLayout names the new
   release. Check it on a phone-sized screen. Send me screenshots.
8. Commit and push to my repository. Report what you did, what you could not test, and what
   is mine to set (payment methods, shipping methods, login modes).

Do not change my shop's settings (payments, shipping, login modes). Do not place real orders.
```

## 3. What the agent does

1. **Forks and clones** the repository with its six Selldone submodules (`modules/*`).
2. **Installs and configures** `.env` for your shop, then runs the dev server on port 9130. In development the Layout reads your shop's public data from Selldone.
3. **Checks your data** against [Shop Requirements](Shop-Requirements): category icons and descriptions, product photos and brands, colour and capacity variants, specs for filters.
4. **Sets your identity** in `manifest.json`: the package name, a display name and a first version.
5. **Releases** with `scripts/release.sh`: build, SVG flattening, safety checks, packaging, upload and server check. See [Build and Upload](Build-and-Upload).
6. **Goes live** by attaching the exact version to your shop, making every domain inherit it, and setting Home to the shop page. See [Go Live](Go-Live).
7. **Verifies** the live HTML and takes screenshots.

## 4. Check the result yourself

- Open your shop's address. You should see the photo hero with the Deal of the Day, the category circles and the deal rows, not Selldone's default home.
- Tap "Add to cart" on a card: it becomes "− 1 in cart +".
- Open the cart from the header and add an address on the map.
- If something is off, see [Troubleshooting](Troubleshooting).

## Tips for working with the agent

- Let it work on its own: the prompt has everything it needs. Answer only the sign-in and attach steps.
- If you change your mind about a design, ask for **2–3 mockups first**, then pick one.
- Every new upload needs a **new version number**. Ask the agent to bump it each time.
