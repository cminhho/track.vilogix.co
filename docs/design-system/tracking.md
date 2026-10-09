# Tracking design system (track.vilogx.co)

The tracking site adopts the canonical **vilogix.co** public system and the compact rules from `vilogix.co/docs/design-system`. It changes density, not identity. Tokens come from `src/styles/tokens.css` (shared primitives such as `--primitive-public-*`); everything tracking-specific lives in `src/styles/tracking-design.css`, imported last in `src/main.tsx`.

## Principles
1. **Same system as vilogix.co.** The lookup is the vilogix contact shell, not a bespoke card. Reuse classes and tokens; add only a page wrapper (`.tracking-page`, `.tracking-shell`) and one-field density tweaks.
2. One task per screen: lookup → result. No marketing, no second CTA.
3. Hide nothing that carries meaning; remove what repeats the brand (the footer does not repeat the logo).
4. 44px touch targets. Labels 12px (`field-label`), UI 14px, body 15px mobile / 16px desktop.
5. Locale is a query (`?lang=vi|en`), never a different URL.

## Mapping to vilogix.co
| vilogix.co (`ContactPage`) | Tracking `/` |
| --- | --- |
| `.contact-shell` (1px `--color-border-strong`, `--shadow-1`) | same class, `max-width 64rem`, two panes ≥900px |
| `.contact-intro` dark pane, eyebrow `--primitive-inverse-soft`, H1 `-.055em` | same; H1 clamp 2.25–3.5rem, `max-width 12ch`, icon hidden on mobile |
| `.contact-form-heading` eyebrow + H2 | `Shipment lookup` + `Enter your tracking number.` |
| `.field-label` wrapping `.form-control` | same, field 52px |
| `.primary-action` uppercase + icon | same, full width in the form pane |
| `.contact-form-note` 12px | `Details are shown by the shipping partner…` |
| mobile-compact.css contact block | ported verbatim in `tracking-design.css` (24/20 intro, 16px gap, 30px H1) |

## Semantics
| Page | Outline |
| --- | --- |
| `/` | `header` > brand link, `nav[aria-label=Language]` · `main` > `section[aria-labelledby]` > `h1` + `form[role=search]` > `h2` · `footer` |
| unavailable, 404 | `section[aria-labelledby]` > `h1` (no H2: one sentence and actions) |
| `/TDE/…`, `/VAE/…` | visually hidden `h1` "Shipment tracking", `iframe[title="Tracking details — …"]`; no header controls, no footer |
Rules: one `h1` per route; the form gets its own `h2` so the region has an accessible name; skip link is first focusable; `html[lang]` follows `?lang`; errors use `role="alert"`; the embed keeps `referrerpolicy=no-referrer`.

## Header and lead path
Brand left; right side holds the language switch (≥720px, hidden on embeds) and one `Get a Quote` action (`.header-cta.tracking-quote-cta`: vermilion, 12px uppercase, 44px, `Báo giá` in Vietnamese). It is shown on every route, including vendor embeds (highest intent, no extra chrome over the iframe). Destination is the vilogix.co contact form with `utm_source=track&utm_medium=header&utm_campaign=tracking`; the footer website link uses `utm_medium=footer`. No menu, no second CTA, no popups or banners over the carrier view. On phones the header is logo + CTA only (114 + 125px) and `EN · VI` moves to the footer.

## Footer
Not rendered on vendor embed pages. Legal line `© year VI LOGIX · Fulfillment & Logistics` plus two 44px text links: `VI LOGIX website` (`VITE_PUBLIC_MAIN_SITE_URL`, default `https://vilogix.co`) and `Need help? WhatsApp` (prefilled message, number never printed). One row ≥720px, two rows on mobile (78px; the page still fits 375×812).

## Tokens used
Shared with vilogix.co from `src/styles/tokens.css`: `--primitive-public-ink/-muted/-surface/-border/-inverse`, `--color-action` (vermilion), `--radius-md`, `--shadow-1`, `--focus-ring-shadow`, `--public-mobile-gutter`. The tracking page must not define its own colors, radii or shadows.

## Type scale (matches vilogix mobile-compact)
| Role | Mobile | Desktop |
| --- | --- | --- |
| Footer / language switch / note | 12 | 12 |
| Eyebrow, field label | 12 | 12 |
| Intro | 15 | 16 |
| Form H2 | 24 | clamp 28–38 |
| H1 (home) | 30 | 36–56 |
| H1 (unavailable / 404) | 32 | 48 |

## Content rules
- English default; Vietnamese in `src/config/trackingCopy.ts`. Same sentence count in both languages.
- Errors say what to do: `Enter a tracking number.` / `This tracking number is not valid. Check it and try again.` Do not name vendors or prefixes (`HomePage.test.tsx` enforces no helper copy).
- The intro says where the number comes from (`shipment confirmation email or message`); the form note says who supplies the details (the shipping partner).
- Support is offered on the unavailable state and in the footer, through a prefilled WhatsApp message; the phone number is never printed. Outbound links: header `Contact us` (mobile: inside the menu toggle), footer website link, WhatsApp. Nothing else; no menu or marketing links.
- Never present carrier data as VI LOGIX data; the embed is a cross-origin partner view.

## Measured (375×812, home)
Before: panel + inner form card, 44px H1, two-line eyebrow, 98px two-row footer. After (contact shell): header 61, intro 164, form 322, footer 48 = one screen, no horizontal overflow; document height equals viewport.

## Checklist for changes
- Run `npm run verify` (tests, build, smoke).
- Check 375, 768, 1440; `?lang=vi`; invalid number; `/OTHER/1`.
- New copy goes into `trackingCopy.ts` in both languages, never inline.
