# VI LOGIX Tracking Mapping Guide

This guide defines how a tracking number is recognized, mapped to a shipping vendor, and rendered through the correct tracking page. It covers the direct vendor routes that exist today and the internal VI LOGIX mapping required before the service is opened as a public production tracker.

The core rule is simple: the browser may select only a known vendor adapter. A mapping record stores a vendor key and vendor tracking number, never an arbitrary iframe URL.

## Tracking number types

| Type | Example | Purpose | Current status |
| --- | --- | --- | --- |
| TADI direct input | `TDEIDB20264388` | Opens a TADI tracking page | Implemented |
| Việt An direct input | `VAE6172162` | Opens a Việt An tracking page | Implemented |
| VI LOGIX internal number | Format TBD | Resolves to one or more vendor tracking records | Backend not implemented |

Vendor prefixes are technical routing identifiers. They are removed before the vendor tracking number is placed in an embed URL.

## Current direct vendor flow

The homepage trims the input, converts it to uppercase, and matches it against the approved patterns.

```text
TDEIDB20264388
  -> provider TDE
  -> vendor number IDB20264388
  -> /TDE/IDB20264388
  -> https://track.tadiexpress.com/?b=IDB20264388

VAE6172162
  -> provider VAE
  -> vendor number 6172162
  -> /VAE/6172162
  -> https://vietanexpress.com.vn/TrackingResult.aspx?id=6172162
```

Current validation rules:

| Provider | Submitted input | Vendor number | Public route |
| --- | --- | --- | --- |
| TDE | `^TDE(IDB2026\d{4})$` | `^IDB2026\d{4}$` | `/TDE/:trackingNumber` |
| VAE | `^VAE(\d{7})$` | `^\d{7}$` | `/VAE/:trackingNumber` |

Unknown prefixes, malformed numbers, and incomplete numbers must not create an iframe. The homepage shows an inline validation error; malformed direct routes show the local tracking-unavailable state.

## Current frontend ownership

The implementation is split by responsibility:

- `src/config/trackingEmbeds.ts` owns input parsing, provider allowlisting, validation and URL construction.
- `src/pages/TadiTrackingPage.tsx` owns the TADI route.
- `src/pages/VietAnTrackingPage.tsx` owns the Việt An route and requests the VI LOGIX AWB mask.
- `src/components/TadiTrackingEmbed.tsx` owns the TADI iframe, loading behavior and responsive crop.
- `src/components/VietAnTrackingEmbed.tsx` owns the Việt An iframe, white background, brand mask and responsive crop.
- `src/components/TrackingUnavailable.tsx` owns the vendor-neutral invalid-number state.
- `src/App.tsx` owns the two explicit vendor routes.
- `vercel.json` rewrites only approved route patterns to the application.

Keep provider-specific validation and visual behavior out of the homepage. Each vendor must have a dedicated embed component and CSS namespace so changing one vendor crop or layout cannot affect another vendor. Adding a vendor should add one adapter, one embed component and one page, not another chain of conditional logic inside the lookup form.

## Internal VI LOGIX mapping

An internal VI LOGIX tracking number must be resolved by a backend service. Do not put the complete mapping table in the frontend bundle or expose the Firestore collection directly to the browser.

```text
Customer enters VI LOGIX number
  -> POST /api/tracking/resolve
  -> Cloud Function validates the exact format
  -> Private mapping lookup
  -> Filtered provider result
  -> Existing vendor adapter validates the result
  -> Selected vendor component renders its own iframe
```

The browser should keep the internal route, for example `/VLX/:trackingNumber`, instead of redirecting to `/VAE/6172162`. This avoids exposing the vendor identity and vendor number in the address bar. A cross-origin iframe still exposes its source URL to browser developer tools; an iframe is visual white-labeling, not a secrecy boundary.

### Recommended mapping record

Use an array even when the first release maps one VI LOGIX number to one vendor. This supports multi-leg shipments without migrating the document shape later.

```ts
type TrackingProvider = 'TDE' | 'VAE'

type TrackingMapping = {
  vilogixTrackingNumber: string
  status: 'active' | 'disabled' | 'expired'
  primaryProvider: TrackingProvider
  sources: Array<{
    provider: TrackingProvider
    vendorTrackingNumber: string
    enabled: boolean
  }>
  createdAt: string
  updatedAt: string
  expiresAt?: string
}
```

Example document:

```json
{
  "vilogixTrackingNumber": "FORMAT-TBD",
  "status": "active",
  "primaryProvider": "VAE",
  "sources": [
    {
      "provider": "VAE",
      "vendorTrackingNumber": "6172162",
      "enabled": true
    }
  ],
  "createdAt": "2026-10-07T00:00:00Z",
  "updatedAt": "2026-10-07T00:00:00Z"
}
```

Do not store a field such as `embedUrl`. The server and frontend must construct URLs from the provider allowlist so a compromised mapping record cannot inject an unrelated website into an iframe.

### Resolve API contract

Request:

```http
POST /api/tracking/resolve
Content-Type: application/json

{
  "trackingNumber": "FORMAT-TBD"
}
```

Successful response:

```json
{
  "found": true,
  "publicTrackingNumber": "FORMAT-TBD",
  "primaryProvider": "VAE",
  "sources": [
    {
      "provider": "VAE",
      "vendorTrackingNumber": "6172162"
    }
  ]
}
```

Unavailable response:

```json
{
  "found": false
}
```

Use the same unavailable response for missing, disabled and expired records. Do not reveal which internal numbers previously existed.

## Security and privacy requirements

`noindex` is not access control. Direct TDE and VAE routes can be enumerated if their number spaces are small, and embedded vendor pages may display recipient information.

Before public production use:

1. Choose an internal number format with sufficient random entropy. Do not use a short sequential suffix as the access secret.
2. Keep the mapping collection private. Firestore client rules should deny public reads, list queries and writes.
3. Resolve through a Cloud Function or equivalent gateway using exact lookup only.
4. Apply rate limiting, abuse monitoring and App Check where supported.
5. Return only provider keys and vendor numbers required for the selected shipment.
6. Never return recipient contact information, addresses, shipment charges or internal notes from the mapping API.
7. Avoid raw tracking numbers in application logs. Use a redacted value or keyed hash for operational correlation.
8. Support immediate disablement of a mapping and of an entire provider adapter.

If the vendor iframe itself exposes personal information, the preferred production solution is a vendor API or redacted embed endpoint rendered by VI LOGIX. Cropping an iframe header does not remove the underlying data.

## White-label behavior

Each vendor page owns a responsive crop profile because cross-origin iframe content cannot be restyled from the VI LOGIX application.

- TADI uses its own header crop and scrolling profile.
- Việt An hides the vendor header and footer, masks the AWB label as `VI LOGIX AWB`, and uses a tablet-specific horizontal viewport for the vendor's fixed 850-pixel table.
- Each vendor component owns its accessible iframe title and loading status. Only the local unavailable state is shared.

Vendor layout changes can break a crop profile without any VI LOGIX code change. Treat visual checks against live vendor pages as a release gate.

## Adding another vendor

Complete all of the following:

1. Assign a stable provider key and submitted-input prefix.
2. Confirm the vendor tracking-number contract with real examples.
3. Add an anchored input regex and vendor-number regex.
4. Add an allowlisted URL builder using the `URL` API.
5. Add a dedicated embed component with a vendor-specific CSS namespace.
6. Add a dedicated vendor page that calls only that embed component.
7. Add the route and a pattern-scoped Vercel rewrite.
8. Create desktop, tablet and mobile crop profiles.
9. Verify the live response does not send blocking `X-Frame-Options` or CSP `frame-ancestors` headers.
10. Review the embedded output for personal information, outbound links and vendor branding.
11. Add unit tests, build assertions and browser checks before enabling the adapter.

Do not detect a vendor by loading several iframes and waiting for one to succeed. Cross-origin pages do not expose a reliable valid-or-invalid result to the parent application, and parallel probes leak tracking numbers to multiple vendors.

## Validation matrix

| Scenario | Expected result |
| --- | --- |
| `TDEIDB20264388` submitted | Navigate to `/TDE/IDB20264388` and load the TADI adapter |
| `VAE6172162` submitted | Navigate to `/VAE/6172162` and load the Việt An adapter |
| Lowercase supported input | Normalize to uppercase and follow the same route |
| Missing vendor prefix | Show inline validation; do not create an iframe |
| Unknown vendor route | Render the local 404 page |
| Known vendor with malformed number | Render tracking unavailable; do not contact the vendor |
| Disabled internal mapping | Return the generic unavailable response |
| Vendor blocks iframe | Show a controlled unavailable state; do not expose a broken vendor page |

Release validation must include `npm run verify`, `git diff --check`, 320-pixel and 375-pixel mobile checks, tablet behavior, desktop behavior, direct-route refreshes and live response-header checks after deployment.

## Decisions required before internal mapping implementation

- Exact VI LOGIX tracking-number format and entropy requirement.
- Firebase project and deployment environment.
- Who creates, updates and disables mappings.
- Whether one internal number may have several active vendor sources.
- Whether direct `/TDE` and `/VAE` routes remain available in public production.
- Mapping expiry and retention policy.
- Vendor API or redacted embed availability for shipments containing personal information.

Do not implement the backend mapping until these decisions are approved.
