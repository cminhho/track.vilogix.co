# Product target

- Surface: public VI LOGIX shipment tracking at `/`.
- Primary task: enter a tracking number and understand the shipment state quickly.
- Information order: lookup → status and ETA → route/progress → customs → activity history.
- Public boundary: no marketing sections, quote forms, recipient PII, shipment charges, notification signup, external carrier reference or document access. Exactly one lead path is allowed: a `Get a Quote` link in the header that opens the main-site contact form with UTM tags (`utm_source=track`).
- Delivery boundary: frontend demo adapter today; production data requires a confirmed tracking API.
