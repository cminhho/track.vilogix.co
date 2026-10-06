# Quote, testimonial and statistics reference specification

## Source and intent

- Source: `https://logistra.themeadapt.com/home-warehousing/`, inspected 2026-09-27.
- Measured viewports: desktop `1440 × 1000`, tablet `768 × 1000`, mobile `390 × 844`.
- Intent: carry over the strong gray-to-red section rhythm and interaction patterns without copying fictitious customer names, quotes or performance counters.

## Quote and tracking panel

### Anatomy

1. Two-tab control: quote and tracking.
2. White form panel raised above a full-width pale-gray section.
3. Quote panel with grouped shipment fields and a primary action.
4. Tracking panel with shipment identifier field and a full-width submit action.

### Exact computed reference

- Background band: `rgb(243, 248, 249)`.
- Desktop band is `1440 × 415px`. The white panel is `1220 × 475px`, begins `60px` above the band, uses `40px` side padding, `30px` top and `45px` bottom padding, and has `0 10px 10px` corner radii.
- Tablet band is `768 × 820px`. The white panel is `738 × 880px`, uses `30px` side/top padding and `45px` bottom padding; form fields stack to full width.
- Mobile band is `390 × 976px`. The white panel is `360 × 1051px`, retains `30px` internal side padding and starts `75px` above the background band.
- Desktop tabs are `71px` high: active `312px` wide and inactive `287px` wide, `20px / 35px`, weight `600`, with `61px` horizontal padding. Tablet uses `35px` horizontal padding. Mobile tabs shrink to `179 × 56px` and `160 × 56px`, `15px / 26.25px`, with `20px` horizontal and `15px` vertical padding.
- Active tab background is `rgb(215, 0, 6)`; inactive tab background is `rgb(21, 21, 21)`; both use white text.
- Standard fields are `48px` high, `14px / 16.8px`, `20px` horizontal padding, `rgb(250, 250, 250)` fill, `1px` light-gray border and `4px` radius.
- Desktop quote fields form three equal `367px` columns. Tablet/mobile fields become one column (`678px` and `300px` measured widths respectively).
- Tracking state uses a `122px` high textarea and a `56px` full-width dark submit button. At desktop both are `1140px` wide inside the panel.

### Interaction contract

- The reference exposes semantic `tab` and `tabpanel` roles and updates `aria-selected`. Arrow Left/Right moves focus and activates the adjacent tab. VI LOGIX must retain that keyboard model.
- `Tab` must leave the tablist and enter the active panel; inactive panels must be removed from the focus order.
- Focus-visible must use the shared VI LOGIX dual focus ring. The reference Bootstrap ring (`0 0 0 4px rgba(13,110,253,.25)`) is evidence of visible focus, not a color to copy.
- Hover must preserve white text and may move the inactive tab toward the action surface without causing size or position changes.
- Active/pressed must remain visually distinct from both default tabs and the surrounding panel.
- Disabled must set `aria-disabled=true`, prevent activation, preserve readable contrast and explain why the action is unavailable.
- Loading must disable duplicate submission, keep button width stable and announce progress with a live status.
- Error must be attached to the specific field, set `aria-invalid=true`, link error text with `aria-describedby`, and move focus to the error summary after submission.
- Touch targets must remain at least `44px` high. The two mobile tabs must fit without horizontal scrolling at `320px`; labels should be adapted to concise Vietnamese if necessary.

### VI LOGIX adaptation

- Quote fields should match the actual estimator contract and current pricing data. Do not invent rates or silently fall back when a route/service is unavailable.
- Recommended tabs: **Ước tính chi phí** and **Theo dõi vận đơn**. If these labels do not fit at `320px`, use a stacked tablist or shorter unambiguous labels, not horizontal scrolling.
- The quote panel should connect warehouse inputs to international movement: storage requirement, product handling/inspection, packing/dispatch, destination and shipment weight/dimensions.
- Tracking must use the existing validated tracking-code rules and must not expose third-party branding or escape links.
- Quote/tracking outcomes must remain visible and operable without relying on animation.

## Testimonial reference and safe replacement

### Exact computed reference

- Section uses the same `rgb(243, 248, 249)` surface as the quote band.
- Desktop section is `1440 × 599px`; the carousel widget is centered at `813 × 359px`.
- Tablet section is `768 × 628px`; widget is `512 × 388px`.
- Mobile section is `390 × 698px`; widget is full-width `390 × 458px`.
- Four circular author thumbnail buttons are `65 × 65px` with a `10px` gap and centered as a group.
- Author name is `22px / 26.4px`, weight `700`, dark and centered.
- Quote copy is `18px / 28.8px`, muted and centered; desktop copy is constrained to about `528px`.
- Previous/next controls are `50 × 50px` circles. Default is gray `rgb(166, 166, 166)`; hover changes to action-red over `300ms ease-out`. Desktop controls sit at the left/right edges of the text track; mobile controls are centered below the quote with a `15px` gap.

### Accessibility finding and required adaptation

- The reference author thumbnail buttons have empty accessible names and empty image alt text. VI LOGIX must not copy this defect.
- Every carousel control must have a descriptive accessible name, visible focus, and disabled state at finite ends. If the carousel loops, its behavior must be announced consistently.
- Auto-advance should not be used. If introduced later, it must provide a pause control and stop on focus/hover.
- Swipe may supplement, but must not replace, explicit previous/next buttons.

### Proof-safe content rule

- VI LOGIX must not publish invented customers, testimonials or star ratings.
- Until verified, consented testimonial content exists, replace this section with an **operational proof panel** using the same centered composition: warehouse intake → product care/inspection → packing/dispatch → international handoff.
- Proof text must describe process and conditions, not imply owned warehouses, guaranteed outcomes, customer counts or certifications.
- When authentic testimonials become available, record the source, consent and approval status outside the UI before publishing.

## Red statistics strip

### Exact computed reference

- Full-width surface: `rgb(215, 0, 6)` with near-white foreground `rgb(252, 239, 240)`.
- Desktop strip is `1440 × 322px`; four counters appear in one row within the approximately `1220px` container.
- Tablet strip is `768 × 410px`; counters use a `2 × 2` grid.
- Mobile strip is `390 × 570px`; counters stack in one column with approximately `30px` side gutters and `30px` vertical pitch around `70px`-high items.
- Counter numbers are `50px / 40px`, weight `800`. Labels are `16px / 28px`, weight `600`.
- Reference counter values animate from `0` to their target when the strip enters view.

### VI LOGIX adaptation

- Do not copy the reference values (`165+`, `42+`, `30+`, `65+`) or labels as they are unverified template claims.
- Use the red strip only for verifiable operational facts, such as clearly sourced service coverage or documented workflow stages.
- If no current evidence source exists, use four capability statements instead of numbers: storage, product care/inspection, packing/dispatch and international logistics.
- Capability statements should use an icon or short ordinal, a concise heading and one factual line. They must not visually imitate metrics by adding `+`, `%` or large unsupported numbers.
- If numeric counters are later approved, the final value must exist in the DOM immediately; animation must be decorative and disabled under `prefers-reduced-motion: reduce`.

## Semantic token mapping

- Pale bands must use the existing muted public-surface token.
- White form panel must use the raised-surface token.
- Red active tab/stat strip must use the VI LOGIX action/accent surface token; near-white foreground must use the inverse text token.
- Dark inactive tab/tracking button must use the inverse/navy surface token.
- Field fill, border, error, focus, disabled and loading colors must use existing form semantic tokens.
- Observed `30px`, `40px`, `45px`, `60px` and `75px` offsets should map to the nearest established spacing tokens; do not add component-only spacing values.

## Acceptance checks

- Tablist must expose exactly one `aria-selected=true` tab, and only its panel may be focusable.
- Left/Right Arrow, Tab, Shift+Tab, Enter and Space must operate the tablist without a pointer.
- All fields must have persistent labels; placeholders must not be the only accessible name.
- At `390px` and `320px`, panel content must not overflow horizontally and all controls must remain at least `44px` high.
- Loading and error messages must be announced to assistive technology.
- Testimonial/carousel controls must have non-empty accessible names if the carousel variant is enabled.
- The red strip must contain no unsupported metrics, years, shipment counts, awards, customer totals or guarantees.
- At desktop/tablet/mobile, strip layout must resolve respectively to `4 / 2 / 1` columns unless capability-copy length requires `2 / 2 / 1` for readability.
