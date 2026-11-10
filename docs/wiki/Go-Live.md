# Go Live

An uploaded version changes nothing until it is **attached** to your shop, or to one domain of it. A **domain** is one web address of the shop (`name.myselldone.com`, `shop.example.com`…).

## 1. Attach the version

**In the dashboard:** shop › **Domains** › **Default layout** › **Change layout**. Pick your Layout and the exact version.

**With the Selldone MCP connector:**

1. Confirm that `selldone_current_connection` returns **your** shop id. The connector picks the shop from its own connection, not from anything you pass.
2. Call `selldone_api_call` → `api.shops.layout.set`, with `confirm: true` and this body:

```json
{ "mode": "private", "layout_id": <Layout id>, "layout_version": "1.0.1" }
```

Pin the **exact** version, never `latest`, so an unverified upload never goes live. Read `api.shops.layout.options` before and after.

## Two Layouts on one shop (how Senso runs)

A shop can show a different Layout on one of its domains. Senso lives only on **senso.selldone.shop**, an extra domain of the Selldone shop **Digini** (shop id 15549, domain id 1242). Digini's default address and its other domains keep their own Layouts.

Senso is pinned on that one domain:

```json
api.shops.domains.layout.set   path { "domain_key": "1242" }
body { "mode": "private", "layout_id": 33, "layout_version": "1.0.0" }
```

- Senso's Layout id is **33** (see [`SENSO.md`](https://github.com/selldone-custom-layouts/official-senso/blob/main/SENSO.md)). For your own shop, use your domain's id and `<Layout id>`.
- The domain has its own Home set to the shop page (`selldone_shop_home_domain_set`).
- **Never** pin the shop default (`api.shops.layout.set`) when you release Senso: that would move every other address too.
- After a release, check both addresses' `window.sdShopLayout`: senso.selldone.shop shows the new Senso version, and the shop's default address still shows its own Layout.

## 2. Make every domain inherit it

This step is for a Layout that runs on the **whole shop**. A custom domain **keeps its own Layout selection**, so it can stay on an old version while the shop moves on.

- Set each domain to **inherit**: `api.shops.domains.layout.set` with `{ "mode": "inherit" }`, or the same setting on the domain in the dashboard.
- Check every address after a release: `name.myselldone.com`, your custom domain, and any sub-domain.

If the Layout runs on **one domain only** (as Senso does), leave the other domains as they are.

## 3. Home = Shop page

If `/` shows a Page Builder landing page while `/shop` shows the Layout, the Home is a page. Set it to the shop page:

- in the dashboard, set **Home** to **Shop**;
- or call `selldone_shop_home_default_set` with `page_id: "shop"` (for the shop), or `selldone_shop_home_domain_set` (for one domain).

## 4. Verify

Open the address **without a query** (a query shows the catalogue instead of the home). Then:

- the page source's `window.sdShopLayout` → `"saved"` block names your package and the new version;
- the home starts with the full-screen photo carousel under a clear header;
- no blank page and no flash of an old design;
- no Theme row in the footer, unless you turned it on (see [Theme and colours](Theme-and-colours));
- check on a phone-sized screen too;
- run the two checks in [Build and Upload](Build-and-Upload#checks-after-a-release).

## Custom domain on Cloudflare (example: `name.selldone.shop`)

1. Create an **A** record to `34.117.142.64`, **DNS only** (proxy off).
2. Create the **TXT** record Selldone gives you (`<sub>-challenge.<zone>`).
3. Add the domain with `selldone_domain_add`, `ssl_proxy: true`, or in the dashboard. HTTPS is issued within seconds.

Plain HTTP serves the shop too. The first custom domain becomes primary. Then either make the domain **inherit** the shop's Layout (step 2), or pin a Layout on it alone (as Senso does).
