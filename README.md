# VI LOGIX Shipment Tracking

Public React/Vite utility for looking up a VI LOGIX order or shipment by tracking number.

## Public scope

The root route `/` provides:

- A lean tracking-number lookup form.
- Inline validation for empty or malformed tracking numbers.
- A noindex `/:trackingNumber` route for tracking numbers matching `IDB2026` plus four digits.
- A full-width embedded carrier view with the carrier header cropped from the visible viewport.

The entire site is private to crawlers: every route emits `noindex, nofollow, noarchive, nosnippet, noimageindex`, `robots.txt` disallows `/`, Vercel sends the matching `X-Robots-Tag`, and the build publishes neither a sitemap nor `llms.txt`.

Unknown public routes render a noindex 404. Marketing pages, quote forms, notification subscriptions, carrier references and document access are not part of this public surface.

The app constructs a carrier URL only after the normalized input matches `^IDB2026\d{4}$`. For example, `IDB20264384` becomes `https://track.tadiexpress.com/?b=IDB20264384`; missing values, literal placeholders such as `IDB2026XXXX`, and numbers outside that pattern render a local not-found state without contacting TADI Express.

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

Update the shared pattern and its tests together if TADI Express introduces another tracking-number series.

## Production build

`npm run build` generates the Vite bundle, a statically rendered homepage, `robots.txt`, a one-route `sitemap.xml`, tracking-focused `llms.txt`, and a noindex `404.html`.

Canonical site configuration defaults to `https://track.vilogx.co` and can be overridden with `VITE_PUBLIC_SITE_URL`.
