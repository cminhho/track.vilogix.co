# VI LOGIX Shipment Tracking

Public React/Vite utility for looking up a VI LOGIX order or shipment by tracking number.

## Public scope

The only indexable public route is `/`. It provides:

- Tracking-number lookup and shareable `?tracking=...&lang=...` links.
- Current status and record-sourced delivery estimate.
- Origin, destination and shipment progress.
- Customs checkpoint and shipment activity history.
- Vietnamese and English display.

Unknown public routes render a noindex 404. Marketing pages, quote forms, notification subscriptions, carrier references and document access are not part of this public surface.

Public results must not expose recipient contact details, addresses, shipment charges or internal operators. Delivery estimates must come from the tracking record or production API, never browser inference.

## Local development

```bash
npm install
npm run dev
```

Full validation:

```bash
npm run verify
```

The current lookup uses a privacy-safe development record. Replace the data-source adapter when the production tracking API is available; do not connect the public page directly to portal `localStorage`.

## Production build

`npm run build` generates the Vite bundle, a statically rendered homepage, `robots.txt`, a one-route `sitemap.xml`, tracking-focused `llms.txt`, and a noindex `404.html`.

Canonical site configuration defaults to `https://track.vilogx.co` and can be overridden with `VITE_PUBLIC_SITE_URL`.
