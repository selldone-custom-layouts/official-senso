# Manual Setup

Set the Layout up on your shop yourself. Follow these steps in order, or let an agent do it: [Install with AI](Install-with-AI).

## 1. Get your own copy

Fork **selldone-custom-layouts/official-senso** on GitHub, then clone your fork with its submodules:

```bash
git clone --recurse-submodules https://github.com/<you>/<your-repo>.git
cd <your-repo>
git remote add upstream https://github.com/selldone/storefront.git
git remote set-url --push upstream DISABLED
```

- `origin` is your repository.
- `upstream` is Selldone's official storefront, used to fetch updates only.
- Never commit inside `modules/*`. A fix there is kept as a patch in `patches/`.

## 2. Install

```bash
npm install --force
```

Node.js 20 or newer. On Windows use Git Bash for the shell scripts.

## 3. Point development at your shop

Edit `.env`. These are public client values, read only in development; in production Selldone injects the shop that runs the Layout.

```dotenv
VITE_APP_SAMPLE_SHOP_NAME=<your shop handle>
VITE_APP_SAMPLE_SHOP_CUSTOM_HOME=shop
VITE_APP_SAMPLE_DEFAULT_CURRENCY=USD
VITE_APP_SAMPLE_DEFAULT_COUNTRY=US
VITE_APP_SAMPLE_DEFAULT_LANGUAGE=en
VITE_APP_DEV_SERVER_PORT=9130
```

`.env.development.local` picks the buyer-account design for development: `VITE_KALIO_ACCOUNT=desk` (side rail) or remove it for `home` (tabs).

## 4. Run it

```bash
npm run serve
```

Open <http://localhost:9130>. Check the home, a category, a product page, the cart and the account against your shop. If a section looks empty, see [Shop Requirements](Shop-Requirements).

## 5. Give the Layout your identity

In `manifest.json`:

```json
{
  "package": "mybrand-market",
  "name": "Mybrand Market",
  "version": "1.0.0",
  "storefront": true,
  "backoffice": false,
  "description": "One sentence about your storefront."
}
```

- `package`: lowercase, unique to you, and **permanent after the first upload**.
- `name`: at least 8 characters.
- `version`: new for every upload, never reused.

## 6. Release and go live

1. [Build and Upload](Build-and-Upload): `bash scripts/release.sh 1.0.0 desk`.
2. [Go Live](Go-Live): attach the version to your shop, make the domains inherit it, and set Home to the shop page.

## 7. Keep up with Selldone

```bash
git fetch upstream main --tags --prune
git merge --no-ff upstream/main
```

Resolve conflicts by keeping Senso's templates and Selldone's logic. Then re-apply the patches if the submodules changed:

```bash
git -C modules/components apply ../../patches/modules-components.kalio.patch
git -C modules/translate apply ../../patches/modules-translate.kalio.patch
```

A patch that no longer applies must be redone by hand, not skipped.
