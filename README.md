# VI LOGIX Shipment Tracking

Public React/Vite utility for looking up a VI LOGIX order or shipment by tracking number.

## Public scope

The only indexable public route is `/`. It provides:

- A lean tracking-number lookup form.
- Inline validation for empty, malformed and unapproved tracking numbers.
- A noindex `/track/:trackingNumber` route for approved embedded tracking views.
- A full-width embedded carrier view with the carrier header cropped from the visible viewport.

Unknown public routes render a noindex 404. Marketing pages, quote forms, notification subscriptions, carrier references and document access are not part of this public surface.

The app never constructs a carrier URL from unchecked user input. Only tracking numbers with an exact URL in `src/config/trackingEmbeds.ts` can create an iframe. The current approved mapping is `IDB20264384` → `https://track.tadiexpress.com/?b=IDB20264384`; all other values render a local not-found state without contacting TADI Express.

The iframe is cross-origin. VI LOGIX cannot edit fields inside the embedded carrier page, which may show shipment and recipient details supplied by the carrier.

## Local development

```bash
npm install
npm run dev
```

Full validation:

```bash
npm run verify
```

Add a tracking number only after its complete carrier URL has been verified, then update the allowlist and its tests together.

## Production build

`npm run build` generates the Vite bundle, a statically rendered homepage, `robots.txt`, a one-route `sitemap.xml`, tracking-focused `llms.txt`, and a noindex `404.html`.

Canonical site configuration defaults to `https://track.vilogx.co` and can be overridden with `VITE_PUBLIC_SITE_URL`.
