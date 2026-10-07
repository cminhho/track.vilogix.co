# VI LOGIX Shipment Tracking

Public React/Vite utility for looking up a VI LOGIX order or shipment by tracking number.

## Public scope

The root route `/` provides:

- A lean tracking-number lookup form.
- Inline validation for empty or malformed tracking numbers.
- Noindex `/TDE/:trackingNumber` and `/VAE/:trackingNumber` routes for supported vendor tracking numbers.
- A full-width embedded carrier view with the carrier header cropped from the visible viewport.

The entire site is private to crawlers: every route emits `noindex, nofollow, noarchive, nosnippet, noimageindex`, `robots.txt` disallows `/`, Vercel sends the matching `X-Robots-Tag`, and the build publishes neither a sitemap nor `llms.txt`.

Unknown public routes render a noindex 404. Marketing pages, quote forms, notification subscriptions, carrier references and document access are not part of this public surface.

The lookup accepts a vendor prefix as part of the submitted number. `TDEIDB20264388` opens `/TDE/IDB20264388` and embeds TADI Express; `VAE6172162` opens `/VAE/6172162` and embeds Viet An Express. Each vendor has an allowlisted URL builder and its own validation pattern, so malformed numbers and unknown vendors render a local not-found state without contacting an external tracking site.

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

Update the relevant vendor adapter and its tests together if a carrier introduces another tracking-number series.

## Production build

`npm run build` generates the Vite bundle, a statically rendered homepage, a site-wide blocking `robots.txt`, and a noindex `404.html`. It does not publish a sitemap or `llms.txt`.

Canonical site configuration defaults to `https://track.vilogx.co` and can be overridden with `VITE_PUBLIC_SITE_URL`.

## Tracking mapping

See [VI LOGIX Tracking Mapping Guide](docs/tracking-mapping-guide.md) for vendor prefixes, route ownership, the planned internal mapping contract, security requirements and the checklist for adding another provider.
