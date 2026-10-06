# Services grid reference specification

## Source and intent

- Source: `https://logistra.themeadapt.com/home-warehousing/`, inspected 2026-09-27.
- Measured viewports: desktop `1440 × 1000`, tablet `768 × 1000`, mobile `390 × 844`.
- Intent: reproduce the section hierarchy and responsive density in VI LOGIX while keeping the existing typography, navy/vermilion palette and factual service scope.

## Reference anatomy

1. Full-width neutral section surface.
2. Eyebrow, two-line section heading and right-aligned section CTA.
3. Three equal service cards.
4. Each card contains a photographic thumbnail, overlapping square service icon, centered title and a short description.

## Exact computed reference

### Section and heading

- Section surface: `rgb(246, 246, 246)`; body copy inherits `rgb(102, 102, 102)`.
- Desktop section bounds: `1440 × 932px`; inner content uses an approximately `1220px` container with `110px` side gutters.
- Desktop heading: `40px / 48px`, weight `800`, dark `rgb(21, 21, 21)`, width `595px` and rendered height `96px`.
- Desktop “All Services” CTA: `163 × 50px`, `16px` weight `700`, `16px` line-height, `27px` horizontal and `16px` vertical padding, white surface and `6px` radius.

### Cards

- Desktop: three cards in one row. Each card is `391 × 476px`; card x positions are `110`, `525`, `939`, producing approximately `24px` gutters.
- Tablet at `768px`: two cards on the first row (`357px` wide), with the third centered on a second row. Column gutter is `24px`; row pitch is `505px` including the card's `30px` bottom margin.
- Mobile at `390px`: one card per row, `360 × 476px`, with `15px` outer gutters and approximately `29–30px` between cards.
- Card surface is white with `26px 26px 44px` padding, `10px` radius and a subtle `0 4px 20px rgba(0,0,0,.05)` shadow.
- Desktop card thumbnail is `339 × 230px`; tablet and mobile retain a fixed `230px` image height. Image wrapper radius is `5px`.
- Content begins immediately after the image and reserves `60px` top padding for the overlapping icon.
- Icon tile is `90 × 90px`, action-red, white icon, `5px` white border and `10px` radius; it overlaps the image/content boundary by `45px` and is horizontally centered.
- Title is `24px / 28.8px`, weight `700`, dark `rgb(21, 21, 21)` and centered.
- Description is `16px / 25.6px`, `rgb(76, 76, 91)` and centered; the reference keeps it to about three lines.

## Interaction and state model

- The photo and title are separate links to the same service destination; the VI LOGIX adaptation should make the whole card one coherent link to avoid duplicate keyboard stops.
- Default title is dark. Hovering the title changes it to action-red over a `300ms ease-out` family transition; the card itself does not translate or scale.
- Focus-visible must use the shared VI LOGIX focus-ring token on the whole card and must not rely on the title color change alone.
- Active should retain the focus outline and use a subtle pressed treatment from the shared button/card token; no layout movement should occur.
- Disabled is not a valid state for navigation cards. An unavailable service should render as non-interactive content with an explicit status label.
- Loading must reserve the final image and text geometry to prevent layout shift.
- Error must keep the title and description readable, replace a failed image with the shared media fallback, and keep the destination available when safe.
- Pointer/touch: the entire card target should be clickable; touch target must be at least `44 × 44px` and no information may depend on hover.
- Keyboard: `Tab` focuses one card at a time; `Enter` activates its destination. DOM order must match the visible reading order at every breakpoint.

## Safe VI LOGIX service model

The cards should express the combined warehouse-and-logistics workflow, not generic template claims:

1. **Warehouse storage** — receiving and temporary storage before dispatch; state only operational conditions that VI LOGIX can verify.
2. **Product care and inspection** — identification, visual checking and shipment preparation; do not imply certification, insurance or regulated inspection unless documented.
3. **Packing and dispatch** — packing support, labels and handoff preparation for outbound movement.
4. **International logistics** — quote-led international forwarding from Vietnam using currently supported destinations and services.

If only three cards are retained, “Product care and inspection” and “Packing and dispatch” should be combined into one card. If all four are needed, use a `4 / 2 / 1` desktop-tablet-mobile grid rather than leaving a single centered orphan.

## VI LOGIX token mapping

- Neutral section surface must map to the existing muted public-surface semantic token.
- White cards must use the raised-surface token.
- Dark titles must use the strong text token; descriptions must use the muted text token.
- Reference red must map to the existing VI LOGIX action/accent token; raw reference RGB values must not enter component CSS.
- Section/container spacing should use current layout tokens. The observed `15px`, `24px`, `26px`, `30px`, `44px` and `60px` values should be rounded to the nearest existing token instead of adding one-off values.
- Radius should be adapted to the current restrained VI LOGIX system (`4–6px` for cards/media); do not import the reference's `10px` radius literally.

## Content and edge cases

- Titles should be 18–32 characters and may wrap to two lines without changing card alignment.
- Descriptions should be 90–150 characters. Clamp only when the full text remains available on the service page.
- Images must use real, licensed warehouse/logistics operations and meaningful alt text; decorative icon tiles should be hidden from assistive technology.
- A missing image must preserve the media aspect ratio and must not collapse the card.
- A three-card tablet row must follow the observed `2 + centered 1` layout only when there are exactly three services. Other counts should use balanced columns.

## Acceptance checks

- At `≥1200px`, all cards in a row must have equal height and about one `24px` gutter between them.
- At `768px`, cards must render two columns without horizontal overflow.
- At `390px`, cards must render one column with at least `15px` viewport gutters.
- Every interactive card must expose one descriptive accessible name and a visible focus indicator.
- Long Vietnamese titles must wrap without covering the icon or description.
- No service copy may assert volumes, facilities, certifications, delivery guarantees or owned infrastructure without verified evidence.
