# Warehouse operations / company split specification

## Context and intent

- Reference: the first company/about section immediately after the overlapping service rail on Logistra Home Warehousing.
- Extraction viewports: desktop `1440 x 1100`, tablet `768 x 1024`, mobile `390 x 844`.
- Design intent: reproduce the reference's editorial image-and-information split while explaining VI LOGIX's connected warehouse and international-logistics workflow without copying claims, staff identities or metrics.

## Content topology

```text
operations-split
├── visual-column
│   ├── warehouse-operation photograph
│   ├── vertical decorative VI LOGIX wordmark (desktop/tablet only)
│   └── red operational callout (desktop/tablet only; no counters)
└── content-column
    ├── eyebrow
    ├── h2
    ├── introduction
    ├── detail-grid
    │   ├── four-step operational checklist
    │   └── two supporting service summaries
    └── action-row
        ├── estimate-cost action
        └── contact-operations action
```

## Measured reference geometry

### Desktop — 1440px

- The section uses `15px` page padding and a centered `1220px` inner container.
- The main composition is a two-column CSS grid: `598px 598px` with a `24px` gap.
- The composition is `559px` high and the section reserves `130px` bottom padding.
- The left column is `598px` wide with `25px` right padding in the reference. The primary image renders at `422 x 559px`, aligned to the right side, with an `8px` reference radius.
- A pale vertical word graphic sits absolutely to the far left, approximately `130 x 421px`.
- A red callout overlays the image at approximately `285 x 292px`, positioned about `129px` below its top. It uses `30px 35px 35px` padding and an `8px` reference radius.
- The right column is `598px` wide.
- Eyebrow: `16px/22.4px`, weight `600`, red, uppercase.
- Section title: `40px/48px`, weight `800`, near-black. It occupies two lines in the measured reference.
- Intro copy: `18px/31.5px`, weight `400`, muted dark gray.
- The detail region uses `20px 0 45px` padding. Its left half is a four-row checklist; its right half contains two stacked icon summaries.
- The bottom action/identity row is approximately `60px` high. In the reference it contains a signature/CEO treatment and a hotline.

### Tablet — 768px

- The outer inner-container is `738px` wide with `15px` page gutters.
- The two columns collapse to a single `738px` grid track with `50px` row gap.
- The visual block is centered at approximately `553.5 x 559px`; its fixed-aspect image remains about `422 x 559px` and the red overlay remains visible.
- The content block becomes full width and is approximately `518px` high.
- The title reduces to approximately `36px/43.2px` and remains two lines.
- Within the content column, the checklist and two service summaries remain side by side where space allows.
- Section bottom padding stays `130px`.

### Mobile — 390px

- The section uses `15px` page gutters and a single `360px` grid track with `50px` row gap.
- The image fills the track at `360 x 476.9px` (`~0.755` width/height ratio) with an `8px` reference radius.
- Both the vertical decorative word and red overlay are hidden, preventing obstruction and excessive height.
- The content block is approximately `857px` tall because all detail groups stack.
- Eyebrow remains `16px/22.4px`.
- Title is `32px/38.4px`, weight `800`, and may use three lines.
- Intro remains `18px/31.5px` and expands naturally.
- Checklist and service summaries stack into one column; their parent uses about `30px` vertical gap.
- The bottom action row wraps and is approximately `132px` high.
- Section bottom padding reduces to `100px`.

## VI LOGIX content mapping

### Primary message

- Eyebrow should identify the joined model, for example `WAREHOUSE & INTERNATIONAL LOGISTICS`.
- Heading should explain continuity rather than scale, for example `Một quy trình liền mạch từ lưu kho đến giao quốc tế.`
- Intro copy must describe only real VI LOGIX operations. It should connect intake/storage, product care or inspection, packing/dispatch and international delivery in one short paragraph.
- The section must not imply that VI LOGIX owns a warehouse, fleet or facility unless ownership is documented. If fulfillment is partner-operated, the copy must say so clearly.

### Visual column

- Use an existing licensed VI LOGIX warehouse/packing image from local media. Do not embed the Logistra source image.
- The desktop/tablet red overlay must not copy Logistra's `Clients Worldwide`, `Delivered Goods` or any numerical counters.
- Recommended red callout content:
  - Label: `WAREHOUSE OPERATIONS`.
  - Item 1: `Kiểm tra & chăm sóc sản phẩm`.
  - Item 2: `Đóng gói & điều phối xuất kho`.
- These items are descriptive, not metrics. Icons may reuse the existing VI LOGIX icon language.
- A vertical `VI LOGIX` text treatment may replace the Logistra word graphic if it remains decorative (`aria-hidden="true"`), low contrast and does not compete with the image.
- When the overlay is hidden on mobile, the same service meaning must remain available in the visible content column; information must not exist only in decorative media.

### Content column

- The checklist should contain four factual stages:
  1. `Tiếp nhận & lưu kho`.
  2. `Kiểm tra / chăm sóc sản phẩm`.
  3. `Đóng gói & chuẩn bị xuất kho`.
  4. `Bàn giao vận chuyển quốc tế`.
- The supporting summaries should reinforce the two ends of the workflow:
  - `Warehouse storage` — intake, storage and inventory handling within the documented service scope.
  - `International logistics` — rate estimation and cross-border dispatch within the existing VI LOGIX coverage.
- The reference's CEO portrait, signature and personal name must not be copied or imitated. Replace that row with real product actions: `Ước lượng chi phí` and `Liên hệ vận hành`.
- A telephone action must only be shown if the number is verified and already approved for public use. Otherwise use the existing contact route.

## Component and responsive rules

- The outer section must use the shared public container token rather than hard-coded local widths. It should resolve near `1220px` on desktop and to `viewport - 30px` below the desktop container.
- Desktop must use a balanced `1fr 1fr` grid with a `24px` tokenized gap; tablet and mobile must collapse to one column with a `50px` vertical rhythm mapped to the nearest spacing tokens.
- Image ratio must remain stable between breakpoints. Use `object-fit: cover` and an explicit focal point so the operational subject is not cropped out.
- The visual column must precede the copy in DOM order. It may remain first at all widths to match the reference, but the heading must still be the section's accessible label via `aria-labelledby`.
- The red overlay must be absolutely positioned only at widths where it does not cover essential image subject matter. It must disappear below `768px`.
- Heading scale should map to the adopted VI LOGIX responsive tokens: approximately `40px` desktop, `36px` tablet and `32px` mobile, with `1.2` line-height.
- Body copy must remain `18px/31.5px` or the closest semantic token. Checklist text may use the body baseline but must not fall below `16px`.
- Checklist icons must be decorative when the adjacent text conveys the status. They must not be announced four times as generic check icons.
- Supporting service summaries may be links only when they have distinct real destinations. If linked, the title must provide the accessible name; the icon must be hidden from assistive technology.
- Long headings and translated content must expand the content column. No fixed height, truncation or line clamp may be used.
- If either supporting summary is unavailable, the remaining summary must fill the row; an empty card must not be rendered.
- If no suitable callout content is available, omit the red overlay and center or enlarge the photograph; placeholder metrics must never be used to preserve geometry.

## Interaction and accessibility contract

- Actions must be native links or buttons and must reuse the global default, hover, focus-visible, active, disabled, loading and error state contract.
- Focus-visible treatment must remain clearly visible on both white and red/navy surfaces.
- Touch targets must be at least `44 x 44px`.
- The image must have concise, factual alt text describing the actual operation shown. It must not infer employment, ownership or location from stock imagery.
- Decorative vertical type, counters-replacement icons and check icons must use `aria-hidden="true"`.
- Red overlay text must achieve at least `4.5:1` contrast. The pale decorative word must not be the only presentation of meaningful text.
- Reading order must be image, heading/intro, steps, service summaries and actions. CSS positioning must not change the keyboard or screen-reader order.
- At 200% zoom and at `320px` width, the callout must not obscure content, the grid must remain one column and no horizontal scrolling may occur.

## Prohibited implementations

- Do not copy the Logistra photograph, logo, `Logistics Company` claims, CEO identity, hotline or dummy paragraph.
- Do not publish `Clients Worldwide`, `Delivered Goods`, satisfaction percentages, years, awards or similar proof claims without source evidence.
- Do not imply owned facilities or in-house handling where the service is fulfilled through partners.
- Do not keep the red overlay on narrow mobile screens.
- Do not convert the checklist into vague claims such as `100% satisfaction` or `best service`.
- Do not use local pixel exceptions when shared container, spacing, radius and typography tokens can express the layout.

## Acceptance checks

- [ ] At 1440px: two equal columns, `24px` gap, approximately `559px` visual height and `130px` section bottom space.
- [ ] At 768px: a centered visual block precedes a full-width content block with `50px` separation; the operational overlay remains legible.
- [ ] At 390px: image fills `360px`, decorative overlay/vertical type are absent, title is approximately `32px`, and detail groups stack.
- [ ] Copy explicitly covers storage, product care/inspection, packing/dispatch and international logistics.
- [ ] No unsupported metric, ownership claim, testimonial, staff identity or phone number is introduced.
- [ ] Hidden decorative content is removed from the accessibility tree.
- [ ] All visible actions pass keyboard, focus-visible and `44px` touch-target checks.
- [ ] Image focal point remains useful at 390, 768 and 1440px.
- [ ] Long Vietnamese text wraps without clipping or overlap.
- [ ] No horizontal overflow occurs at 320, 390, 768, 1024 or 1440px.
