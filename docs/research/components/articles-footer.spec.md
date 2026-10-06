# Articles and footer reference specification

## Source and intent

- Source: `https://logistra.themeadapt.com/home-warehousing/`, inspected 2026-09-27.
- Measured viewports: desktop `1440 × 1000`, tablet `768 × 1000`, mobile `390 × 844`.
- Intent: carry over Logistra's strong editorial close and dense utility footer while keeping VI LOGIX navigation, tokens and verified content.

## Articles section

### Reference anatomy and geometry

1. Left-aligned eyebrow and section title.
2. “See all” action aligned to the right on desktop/tablet and below the heading on mobile.
3. Three equal article cards with fixed-height photography, category label, date, title and secondary action.

- Desktop section: `1440 × 886px`, with `130px` top spacing and about `100px` bottom spacing. Inner container is `1220px` (`110px` side gutters).
- Header row is `1220 × 118px`, with `40px` bottom padding. Text column is `595px`; eyebrow is `16px / 22.4px`, weight `600`, uppercase, action-red; title is `40px / 48px`, weight `800`, dark. The right CTA is approximately `171 × 50px`, red, white `16px / 16px` weight `700`, `17px 28px` padding and `6px` radius.
- Desktop cards: three columns, each about `391 × 508px`, with `24px` gutters and `30px` bottom margin. Surface is white, radius `10px`, shadow `0 4px 15px rgba(0,0,0,.05)`.
- Card image is `389 × 260px` with `object-fit: cover`. Category label overlaps the image bottom edge at `40px` from the left; it uses red surface, white `14px / 14px` weight `700` text and `9px 19px 11px` padding.
- Content uses `30px 40px 40px` padding. Date/meta inherits `16px / 28px` muted text. Title is `24px / 30px`, weight `700`, dark, with `28px` bottom gap. Secondary action is approximately `156 × 50px`, white surface, red `16px / 16px` weight `700` text, `16px 27px` padding and `6px` radius.
- Tablet: two `357px` cards in the first row and one centered card in the second; cards are about `478px` tall. Heading becomes `36px / 43.2px` while the section action remains right-aligned.
- Mobile: one `360 × 468px` card per row with `30px` separation. Image remains a fixed `260px` high; content becomes `20px 25px 25px`. Header wraps: the text group occupies the full width, then the `171 × 50px` section action sits left-aligned below it. Title becomes `32px / 38.4px`.

### Interaction and states

- Image hover runs a diagonal light “shine” animation lasting `1.2s`; this must be omitted when `prefers-reduced-motion: reduce` is active.
- Section CTA defaults red and becomes dark on hover over `300ms ease-out`.
- Card secondary action defaults white/red and becomes dark/white with a dark border on hover over `300ms ease-out`.
- Article title links should become action-colored on direct hover/focus; the card itself must not jump, scale or alter geometry.
- VI LOGIX should avoid duplicate image/title/action keyboard stops when they all lead to the same article. Prefer one card-level link plus a visually styled action label.
- Keyboard: each destination must be operable with `Tab` and `Enter`; visible `focus-visible` rings must surround the actual target. The source's missing outline must not be copied.
- Touch: the whole article target should be at least `44 × 44px`; no content may depend on hover.
- Loading must reserve `260px` image space and the final card height. Error must retain category, title and link while showing the shared media fallback. Empty state should hide the grid and show a concise message plus an optional link to the blog index.

### VI LOGIX content rules

- Show only real articles/routes that exist in the application. Do not copy Logistra's dates, categories or headlines.
- Use descriptive Vietnamese titles; allow two or three lines and align actions to the card bottom when title lengths differ.
- A missing category or publish date should be omitted, not fabricated.
- If only one or two articles exist, use a balanced grid rather than placeholder cards. If no editorial content is maintained, omit the entire section.
- Images must be licensed, relevant to warehouse storage, product care/inspection, packing/dispatch or international logistics, and include meaningful alt text unless decorative.

## Footer

### Reference anatomy and geometry

1. Dark full-width footer.
2. Brand/description/social column.
3. Services links.
4. Quick links.
5. Address, phone and hours.

- Desktop footer: `1440 × 462px`, surface `rgb(21,21,21)`. Inner container is `1220px`, with `90px` top and `40px` bottom spacing.
- Desktop grid columns are approximately `377 / 188 / 283 / 283px`, separated by `30px` gaps. Brand column has `60px` right padding; services and quick-links columns have left padding (`25px` and `65px` respectively) in the reference.
- Footer headings are `24px / 28.8px`, weight `700`, white. Link text is `17px / 29.75px`, weight `500`, muted gray `rgb(166,166,166)`, with `10px` between list items. Link hover transitions to white in `300ms ease-out`.
- Tablet: footer is about `768 × 755px`; two `354px` columns with `30px` gutter and two rows. Each column has `40px` bottom margin.
- Mobile: footer is about `390 × 1329px`; one `360px` column with `15px` viewport gutters. Columns stack in reading order and retain `40px` bottom margins.

### VI LOGIX footer adaptation

- Brand column should use the current VI LOGIX mark and a short factual description of combined warehouse and international-logistics support.
- Services must list only supported routes: Warehouse storage, Product care/inspection, Packing/dispatch, International logistics.
- Quick links should match the implemented header and routing: Home, About Us, Services, Blog, Contact Us. Do not add template-only pages such as Partners, Testimonials, Case Studies or Pricing.
- Contact details must come from current application data. Unknown address, phone, office hours or social accounts must be omitted rather than copied or invented.
- External/social links must have descriptive accessible names. Decorative icons must be `aria-hidden`.

### Footer interaction and edge cases

- Default links use the footer-muted token; hover may become inverse text. Focus-visible must use the shared high-contrast ring and must not be clipped by the footer container.
- Active/current route should use `aria-current="page"` and a persistent visual style distinct from hover.
- Touch targets must be at least `44px` high even if the text line itself is smaller.
- Long Vietnamese link labels and addresses must wrap; columns must grow rather than truncate or overflow.
- An absent contact field must remove its whole row. Empty service/navigation lists must not render empty headings.
- Loading is not appropriate for static footer navigation. If footer data is asynchronous, reserve the column layout and expose an accessible loading label; on error, retain brand and primary navigation.

## Token mapping and accessibility acceptance

- Dark surface, inverse text, muted footer text, action red, raised cards, borders, shadows and focus rings must map to existing VI LOGIX semantic tokens. Raw Logistra RGB values must remain research evidence only.
- Card and button radii should use the current restrained VI LOGIX radius tokens rather than importing the reference's `10px` card radius as a new exception.
- At `≥1200px`, article cards must form one equal-height row and the footer must form four columns.
- At `768px`, articles must form `2 + centered 1`, and footer content must form two columns without horizontal overflow.
- At `390px`, article cards and footer columns must be single-column with at least `15px` viewport gutters.
- Every interactive element must be reachable in logical DOM order and show a visible focus indicator meeting WCAG 2.2 AA contrast requirements.
- Text must remain readable at `200%` zoom and reflow at `320px` without horizontal scrolling.
- Reduced-motion mode must disable the image shine and non-essential transitions.
- No links, contact details, article metadata or service claims may be fabricated to fill the reference layout.
