# Header, hero and service rail specification

## Context and intent

- Reference: `https://logistra.themeadapt.com/home-warehousing/`.
- Extraction viewports: desktop `1440 x 1100`, tablet `768 x 1024`, mobile `390 x 844`.
- Design intent: reproduce the reference's strong logistics hierarchy—a slim utility strip, dense navigation, full-bleed warehouse hero and overlapping service rail—while using VI LOGIX content, brand tokens and verified operations only.
- This is a structural and responsive reference. Logistra logos, text, icons, photographs, WordPress code and unverifiable business claims must not be copied.

## Content topology

```text
site-header
├── utility-strip (desktop/tablet only)
│   ├── verified contact/location/hours
│   └── verified social links (optional)
├── primary-nav
│   ├── VI LOGIX logo
│   ├── Home / About Us / Services / Blog / Contact Us
│   ├── search (desktop/tablet only; omit if no real search)
│   ├── primary CTA (desktop/tablet)
│   └── menu trigger
hero
├── full-bleed operational photograph + dark overlay
├── eyebrow
├── h1
├── supporting paragraph
└── primary + secondary actions
service-rail
├── 01 Lưu kho
├── 02 Kiểm tra & đóng gói
└── 03 Chuyển phát quốc tế
```

## Measured reference geometry

### Desktop — 1440px

- The utility strip is `51px` high and occupies one row.
- The navigation is `80px` high. Its outer horizontal padding is `25px`; the inner container is `1250px` wide with `15px` side padding, producing a `1220px` usable row from `x=110` to `x=1330`.
- The logo cell is `122 x 80px`. The desktop navigation occupies approximately `741px`; search, CTA and off-canvas trigger occupy the remaining right side.
- The hero begins at `y=131`, is `599px` high and is full viewport width.
- The active slide uses `padding: 130px 0 160px`. Copy is `595px` wide at `x=110`.
- Eyebrow: `16px/16px`, weight `600`, white, `10px` bottom margin.
- Hero title: `60px/66px`, weight `700`, white, `20px` bottom margin.
- Supporting copy: approximately `536px` wide, `16px/28px`, weight `500`, white, `25px` bottom margin.
- The action row is a wrapping flex row with `12px` gap. Buttons are `50px` high, `16px/16px`, weight `700`, `6px` radius. The primary is red; the secondary is transparent with a `1px` light border.
- The image uses `background-size: cover`, centered positioning and an approximately `50%` black overlay. The reference applies a subtle scale animation around `1.08`.
- The service rail begins `50px` before the hero ends (`margin-top: -50px`) and uses a `1220px` container.
- Cards are `390.7 x 169.6px`, arranged in three columns. Each card uses a white surface, `1px` neutral border, `8px` reference radius, `35px 30px 40px 42px` padding and a `20px` icon/content gap.
- Card icon is `50px`, red. Title is `22px/26.4px`, weight `700`; body is `16px/25.6px`, weight `500`; decorative number is `36px/36px`, weight `700`, light gray.
- The reference reserves `110px` below the rail before the next section.

### Tablet — 768px

- The utility strip wraps to `86px`: contact details remain on the first row and social links center on the second.
- Navigation remains `80px`. The usable row is `688px` wide with `40px` left/right alignment.
- The full desktop menu is hidden. Logo, search, quote CTA and the compact grid/off-canvas trigger remain visible.
- Hero begins at `y=166`, is `572.6px` high and retains `130px 0 160px` internal padding.
- Hero copy uses a `690px` content width and centered alignment. Title reduces to `48px/52.8px`; body remains `16px/28px`.
- Service rail still overlaps by `50px`. Its container is `738px` wide and cards form `2 + 1`: two `357px` cards, then the third centered on a second row.
- Tablet cards use `35px 20px 30px` padding, `15px` gap and a `45px` icon.

### Mobile — 390px

- The utility strip is removed completely.
- Navigation is `68px` high with `15px` container gutters. Its internal row has `15px` padding, leaving the logo at `x=30` and menu trigger at `x=334`.
- Only logo and the `26px` menu trigger remain. Search and primary header CTA are hidden.
- Hero begins at `y=68` and is approximately `639px` high. It uses `120px 0 160px` padding and a `360px` copy column.
- Eyebrow stays `16px/16px`. Title is `42px/46.2px`, weight `700`. Body is `16px/28px` and may wrap to three lines.
- Hero content is centered. The action container wraps with `12px` row/column gaps; actions become two centered rows at this width while remaining content-width rather than full-width.
- Service rail overlaps by `50px`, then becomes a single `360px` column. Cards are about `159.6px` high with `35px 20px 30px` padding, `15px` gap and `45px` icons.
- Bottom spacing after the rail reduces from `110px` to `70px`.

## VI LOGIX implementation mapping

### Header

- Navigation labels must be exactly: `Home`, `About Us`, `Services`, `Blog`, `Contact Us`.
- The existing VI LOGIX logo, navy/vermilion palette and Be Vietnam Pro typography must remain.
- The utility strip must contain only currently verified VI LOGIX contact information. If location, hours or social accounts are not confirmed, the relevant item must be omitted; placeholder data must not be introduced.
- Search must be omitted unless it performs real site search. The layout should redistribute the space to the CTA and menu trigger rather than render a decorative control.
- The desktop/tablet CTA should use the existing estimate route and a descriptive label such as `Ước lượng chi phí`.
- Desktop menu visibility should switch at approximately `1200px`, matching the reference's `xl` breakpoint. Tablet must use the compact navigation treatment.

### Hero

- The current verified VI LOGIX positioning must replace the reference headline and dummy paragraph.
- The hero image must come from VI LOGIX's licensed local logistics media. It should show a believable warehouse/storage/dispatch environment; Logistra's photograph must not be downloaded or embedded.
- The hero must communicate the combined service model: warehouse storage, product care/inspection, packing/dispatch and international logistics.
- Recommended content shape:
  - Eyebrow: `WAREHOUSE & INTERNATIONAL LOGISTICS` or a verified Vietnamese equivalent.
  - H1: retain the current VI LOGIX international-shipping promise, with warehouse operations made explicit in the supporting line.
  - Primary action: estimate cost.
  - Secondary action: explore services.
- A carousel must not be added unless there are at least two semantically distinct, licensed images and corresponding verified messages. A single static hero should preserve the same geometry with less motion.

### Service rail

- Keep exactly three cards to retain the reference silhouette:
  1. `Lưu kho` — receiving and storage scope only where actually offered.
  2. `Kiểm tra & đóng gói` — product care/inspection plus packing and dispatch preparation.
  3. `Chuyển phát quốc tế` — VI LOGIX's current international logistics service.
- Card numbers are decorative and must use `aria-hidden="true"`.
- A card must only be an interactive link if a real destination exists. Otherwise it must remain semantic static content and must not use fake hover affordances.
- Reference `8px` card radius should map to the closest current VI LOGIX component radius token (`radius.lg`, `6px`) to preserve the adopted system.

## Interaction and accessibility contract

- The sticky header should become fixed after it leaves the initial position, hide while scrolling down and reappear while scrolling up. It must use `z-index >= 99`, an opaque surface and a restrained shadow.
- Sticky behavior must not cause layout shift: a spacer equal to the current header height must remain in document flow.
- At mobile, opening the menu must present a right-side panel approximately `300px` wide with a dimmed backdrop. The panel must contain the same primary links and no duplicated hidden navigation in the accessibility tree.
- The menu trigger must be a native button with an accessible name, `aria-expanded` and `aria-controls`.
- Escape must close the mobile panel, focus must be trapped while open, backdrop activation must close it, body scroll must lock, and focus must return to the trigger. The reference does not close on Escape; that defect must not be reproduced.
- All actions must expose a visible tokenized `:focus-visible` ring with at least `3:1` contrast against adjacent colors.
- Header and hero touch targets must be at least `44 x 44px`.
- The animated background zoom must stop under `prefers-reduced-motion: reduce`.
- Text overlay contrast must meet WCAG 2.2 AA in every crop. Test white body copy at a minimum `4.5:1`; increase the overlay locally if a brighter replacement photograph is used.
- At `320px`, the title and both actions must fit without horizontal scrolling. Long translated labels must wrap inside the button or switch both actions to equal full width.
- Service titles must wrap without colliding with decorative numbers. Body copy must expand card height rather than clip.

## Acceptance checks

- [ ] At 1440px: utility `51px`, nav `80px`, hero approximately `599px`, three rail cards on one row and `50px` overlap.
- [ ] At 768px: utility wraps, desktop nav is absent, hero title is approximately `48px`, and service cards form `2 + 1`.
- [ ] At 390px: utility/search/header CTA are absent, nav is approximately `68px`, hero title is approximately `42px`, actions wrap, and rail is one column.
- [ ] Header links read Home, About Us, Services, Blog and Contact Us in that order.
- [ ] Sticky navigation does not shift content and responds correctly to scroll direction.
- [ ] Mobile menu passes keyboard open, focus trap, Escape close and focus-return tests.
- [ ] No Logistra logo, copy, remote asset URL, placeholder address, fake social profile, counter or business claim is present.
- [ ] All three rail cards describe the real warehouse-to-international-logistics workflow.
- [ ] No horizontal overflow occurs at 320, 390, 768, 1024 or 1440px.
