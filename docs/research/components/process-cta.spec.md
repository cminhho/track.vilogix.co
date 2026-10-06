# Capability gallery, process band and inset CTA reference specification

## Source and intent

- Source: `https://logistra.themeadapt.com/home-warehousing/`, inspected 2026-09-27.
- Measured viewports: desktop `1440 × 1000`, tablet `768 × 1000`, mobile `390 × 844`.
- Intent: reproduce Logistra's lower-page cadence—visual gallery, high-contrast process band and overlapping CTA—using verified VI LOGIX warehouse-and-logistics content.
- The reference labels the gallery as projects. VI LOGIX must present it as capabilities or workflow evidence unless named projects and permissions are verified.

## Capability gallery

### Reference anatomy and geometry

1. White full-width section with centered eyebrow and two-line title.
2. Six image tiles with text revealed over a dark image overlay.
3. No visible section CTA in this block.

- Desktop section: `1440 × 1136px`, with `140px` top and approximately `90px` bottom spacing. Heading group is `634.5px` wide; eyebrow is `16px / 22.4px`, weight `600`, uppercase, action-red; title is `40px / 48px`, weight `800`, dark and centered. Heading-to-grid gap is `50px`.
- Desktop grid: three columns, `454 × 330px` tiles, `24px` horizontal gutters and `25px` bottom margin. Grid uses near-edge `15px` page gutters rather than the narrower `1220px` content container.
- Tablet `768px`: section `768 × 1482px`; title becomes `36px / 43.2px`; two columns of `357 × 330px`, `24px` gutter, three rows.
- Mobile `390px`: section `390 × 2496px`; title becomes `32px / 38.4px`; one `360 × 330px` tile per row with `15px` viewport gutters and `25px` row spacing.
- Images fill the tile with `object-fit: cover`. The reference has no tile radius.

### Reference interaction and required adaptation

- Default: image is unobscured; the overlay and text are both `opacity: 0`.
- Hover: a black full-tile pseudo-overlay transitions to `opacity: .8` over `300ms ease-out`; the bottom-left content transitions to `opacity: 1`.
- Overlay content uses `30px` padding. Category is `14px / 14px`, weight `700`, light gray; title is `24px / 28.8px`, weight `700`, white.
- The reference makes information hover-only and exposes no visible keyboard focus. VI LOGIX must not reproduce those accessibility failures.
- On keyboard focus and hover, the same overlay must be shown. On coarse-pointer/touch layouts, the label and title must remain persistently visible in a bottom gradient panel.
- Each tile must be one link. `Tab` must focus once, `Enter` must activate, and `focus-visible` must use the shared dual-ring token.
- Loading must reserve the final `330px` media height. Image error must retain the label/title over the standard media fallback.

### Safe VI LOGIX content model

Use four factual capability tiles rather than fictional projects:

1. **Warehouse storage** — receiving and temporary storage before onward dispatch.
2. **Product care and inspection** — identification, visual checks and shipment preparation within documented scope.
3. **Packing and dispatch** — packing support, labels and handoff preparation.
4. **International logistics** — quote-led international transport from Vietnam for supported destinations.

For four tiles, VI LOGIX should use a balanced `4 / 2 / 1` desktop-tablet-mobile grid; it must not add two filler projects simply to copy the reference's six-card count. Copy must not imply owned warehouses, certifications, guaranteed delivery, throughput or customer work that cannot be verified.

## Process band

### Reference anatomy and geometry

1. Full-bleed action-red surface.
2. Centered white eyebrow and title.
3. Four numbered icon steps joined visually by dotted curved arrows.
4. White CTA card overlaps the bottom edge into the following neutral strip.

- Desktop process section: `1440 × 748px`, action-red `rgb(215, 0, 6)`, `130px` top inset. Heading container is `610px` wide; eyebrow is `16px / 22.4px`, weight `600`; title is `40px / 48px`, weight `800`; both are white. Heading-to-steps gap is `50px`.
- Desktop steps: inner width `1250px`, four `282.5px` items with `30px` column gutters. Each item is centered and about `211px` tall.
- Icon disc: `104 × 104px`, white, circular, with a `56px` dark icon. The step number is a `30 × 30px` dark circle pinned to the icon's top-right, `14px / 14px`, weight `600`, white.
- Step title: `22px / 26.4px`, weight `700`, white, `10px` bottom gap. Description: `17px / 25.5px`, pale `rgb(252,239,240)`.
- Tablet: section `768 × 929px`; title `36px / 43.2px`; steps become a `2 × 2` grid of `354px` items with a `30px` column gutter and approximately `30px` row gap. Decorative connector arrows should be removed when the flow wraps.
- Mobile: section `390 × 1389px`; title `32px / 38.4px`; steps become one column, `360px` wide and about `186px` tall, with approximately `30px` separation. Decorative connector arrows must be removed.

### VI LOGIX process content

The four steps should form a real warehouse-to-international-shipping path:

1. **Receive and record** — record shipment information and receiving condition.
2. **Care and inspect** — identify items and perform the documented visual checks.
3. **Pack and dispatch** — prepare packaging, labels and outbound handoff.
4. **Move internationally** — quote and arrange the supported international logistics service.

Descriptions should state what happens, not unverified speed, volume or guarantees. Step links are optional; if a step has no distinct destination it should be static content, not a dummy `href="#"`.

## Inset CTA

- Desktop following strip: neutral `rgb(249,249,249)`, `121px` tall. CTA card is `1220 × 221px`, offset upward by `100px`, white, `15px` radius.
- Desktop card: left image `378 × 219px`; right content is `840px` wide with `50px 65px` padding and a `30px` internal gap. Text column is about `531px`; button is aligned beside it.
- Title is `30px / 36px`, weight `700`, dark. Supporting line is `18px / 31.5px`, weight `500`, muted. Button is approximately `156 × 50px`, `17px 28px` padding, `6px` radius, dark surface with white `16px / 16px` weight `700` text and a diagonal-arrow icon.
- Tablet: image is hidden. Card is `738 × 181px`, still offset `-100px`; content padding becomes `35px`; text and CTA remain side by side.
- Mobile: card is `360 × 311px`, offset `-100px`; image stays hidden; content uses `35px` padding, wraps to one centered text column and a centered button with a `20px` row gap. Title is `28px / 33.6px`; body remains `18px / 31.5px`.
- Default button is dark; hover becomes action-red over `300ms ease-out`. Focus-visible must add the shared visible ring (the source itself had no focus outline). Active should retain the ring and use the shared pressed state without moving layout. Disabled/loading/error states must follow the shared button contract and use explicit labels.

Recommended VI LOGIX CTA: title “Cần lưu kho trước khi gửi quốc tế?” with supporting copy describing receiving, checking, packing and quote preparation; action label “Yêu cầu báo giá”. The CTA must lead to the actual estimator or contact route and must not promise availability before the quote is confirmed.

## Token mapping and acceptance checks

- Reference red must map to the existing VI LOGIX action/vermilion token; reference dark must map to navy/strong-text tokens; neutral and white surfaces must use semantic surface tokens.
- Spacing and radii should use the current token scale. Do not add raw RGB values or one-off Elementor measurements to application CSS.
- At desktop, process steps must appear in one ordered row; at tablet in two rows; at mobile in one column without overflow.
- The inset card must overlap by about `100px` without clipping focus rings or creating horizontal scroll.
- All four warehouse/logistics capabilities must be visible without hover on touch devices.
- DOM order, visual order and announced step order must match.
- Decorative arrows and icons must be hidden from assistive technology; informative images must have meaningful Vietnamese alt text.
- No project, client, warehouse ownership, certification, metric or delivery guarantee may be introduced without evidence.
