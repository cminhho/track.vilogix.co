# VI LOGIX design system

## Tracking subdomain intent

- Homepage của `track.vilogx.co` là một task-first utility page: tra cứu vận đơn phải là hành động nổi bật nhất trong viewport đầu tiên.
- Public tracking chỉ hiển thị mã, trạng thái, origin/destination khái quát, thời điểm và operational events đã làm sạch. Không hiển thị PII, địa chỉ chi tiết, cước hoặc actor nội bộ.
- Share link dùng query `?tracking=` để customer mở và tự tra cứu; canonical, metadata và structured data vẫn phải trỏ về `/` và không chứa mã vận đơn. Empty, loading, found, not-found và unavailable states phải có thông báo và recovery action rõ ràng.
- Tracking hierarchy là lookup → current status + ETA → route/progress → customs status → optional notification opt-in → latest event → earlier events → references → secure documents. ETA chỉ render từ record/API và luôn được mô tả là estimate; browser không tự tính từ destination hoặc rate matrix.
- International progress phải có customs clearance giữa international transit và out for delivery. Clearance state dùng pending/in progress/cleared/action required; action required phải kèm instruction bằng text.
- Notification và document actions là capability-gated. Không render notification channel không được backend khai báo; document URL không được nằm trong public lookup payload và chỉ được trả sau email OTP. Demo interaction phải được gắn nhãn và không được giả thành production success.
- Root tracking UI hỗ trợ `lang=vi|en`; query tracking và locale được giữ khi share. Locale đổi customer-facing tracking copy, status, dates, errors, root header/footer và accessibility labels nhưng không thay canonical URL.
- Carrier name, reference và outbound tracking URL chỉ hiển thị khi record trả về đủ dữ liệu. Link phải được ghi rõ là external shipping-partner reference, không được suy đoán quan hệ carrier.
- Tracking page phải theo task hierarchy: lookup → current status → route/progress → latest event → earlier events → carrier/support. Tracking number là reference, không phải heading quan trọng hơn current status.
- Loading, found và no-result feedback dùng status semantics để screen reader nhận được thay đổi mà không tự động chuyển keyboard focus. Earlier events có thể disclosure theo nhu cầu để giữ result scan-friendly.
- Public tracking data phải đi qua `TrackingDataSource` độc lập; không đọc trực tiếp dữ liệu portal hoặc tạo thêm quyền truy cập vào `/app/*`.

## Context and goals

**Design intent:** VI LOGIX must present receiving, warehouse care, consolidation and export as one connected operational service for overseas customers: proof-safe photography, strong information rails, fast scanning, predictable controls and operational credibility.

- The public site must communicate the service chain in this order: receive → store → product care and inspection → packing and dispatch → international logistics.
- The public site must prioritize warehouse scope, route clarity, low-friction WhatsApp inquiry access and verified shipping conditions.
- The internal quote desk must reuse the same tokens at a denser rhythm.
- External brand identity, audience assumptions, component counts and storefront-specific patterns must not be carried into VI LOGIX.
- Teams should prefer system consistency over local visual exceptions.

### Logistra reference profile

The supplied Home Warehousing – Logistra study is an implementation reference, not a second brand or a source to copy. Audience and product-surface inference in that study has low confidence; VI LOGIX must continue to use its verified fulfillment-and-international-shipping audience, content and workflows.

The following source observations must remain traceable when future work cites Logistra:

| Foundation | Observed Logistra value | VI LOGIX adoption |
| --- | --- | --- |
| Type family | Sarabun, sans-serif | Structural reference only; VI LOGIX must keep Be Vietnam Pro for Vietnamese legibility and brand continuity. |
| Body type | 16px / 400 / 28px | The 16px body baseline is adopted; dense operational UI may use the documented compact scale. |
| Compact type scale | 14, 15, 16, 17, 18, 20, 22, 24px | New public content should use this progression where density permits; existing operational labels must remain readable and testable. |
| Key colors | #666666, #151515, #d70006, #ffffff, #000000, #fafafa | Relationships are adopted as muted text → structural dark → signal red → inverse text → dark surface → raised surface. VI LOGIX must resolve them through its own navy, vermilion and paper semantic tokens. |
| Micro spacing | 1, 3, 6, 7.5, 8, 9, 10, 11px | Rhythm is reference-only. Production components must use VI LOGIX spacing tokens and must not introduce these as local literals. |
| Radius | 2, 3, 4, 6, 50px | Adopted as `radius.xs` through `radius.xl`; pill radius must remain limited to badges and status. |
| Motion | 150, 200, 300, 400, 500, 1000ms | Adopted as the primitive duration scale; interactive feedback should use 150–300ms. |

The observed page density is 152 links, 28 buttons, 28 inputs, 26 lists and one navigation region. These counts must be treated as extraction diagnostics, not implementation targets. VI LOGIX should use the minimum number of controls needed for a clear task.

Approved section patterns from the reference are: a photo-led hero with an overlapping information rail, image-led service cards, an editorial image–content operations split, a structured quote/result surface, a signal-color process band and compact article cards. Testimonials, project counters, partner logos and success claims must not be added unless VI LOGIX can verify them.

### Warehouse and logistics content model

- `Receiving & Storage`, `Pickup & Local Fulfillment`, `Product Care`, `Consolidation & Repacking`, `Shipping Preparation` and `Fulfillment & International Shipping` must be the canonical public service labels.
- Public copy must position VI LOGIX as a Vietnam-based fulfillment-and-international-shipping partner for overseas customers, covering receive → store → check → consolidate → pack → ship.
- The About page must explain VI LOGIX as the customer's Vietnam-side operating infrastructure. It should prioritize positioning and customer value before workflow details and scope limitations.
- `Export` must describe an operational preparation or documentation step, not the primary customer-facing service category.
- VI LOGIX must serve goods the customer has already purchased. Product discovery, personal shopping and purchasing on a customer's behalf must not be presented as VI LOGIX services.
- VI PICK and VI MADE may appear only as clearly separated ecosystem referrals for purchasing/sourcing and development/production; their URLs must remain configurable.
- Export language must use `Export documentation & shipping coordination` unless VI LOGIX is verified as the customs-clearance service provider of record.
- Public pricing must use request-based confirmation language until a rate source has a verified effective date. Draft or undated rate data must not appear on the marketing site.
- Warehouse copy must describe a processing flow and must not imply ownership, capacity, certifications, automation or service levels unless these facts are verified.
- Product caring must mean agreed inspection, sorting and preparation activities; it must not imply repair, insurance or product warranty.
- Public inquiry actions must lead to `/contact`. The contact form must collect only customer name, subject and message before opening WhatsApp with a concise prefilled message.
- The WhatsApp phone number must not be printed as visible page text. Quote actions must use a transactional label such as `Get a Quote` or `Request a Shipment Quote`; the final WhatsApp handoff must use `Continue to WhatsApp` and explain that the customer can review the message before sending.
- Service scope must state that goods acceptance, pickup area, storage period, inspection tasks, documentation responsibilities and destination clearance are confirmed per shipment.
- Numeric rails may show structural facts already present in the product, such as service pillars, workflow steps or configured rate zones. They must not imitate customer, project, warehouse-area or performance counters from a template.

### Search and sharing metadata

- Every indexable route must ship meaningful static HTML with one H1, a unique title and description, a self-referencing canonical URL, Open Graph/Twitter metadata and factual Schema.org JSON-LD before client JavaScript runs.
- Structured data must describe only visible, verified content. LocalBusiness, review, rating, capacity, certification and address claims must not be added without evidence.
- `scripts/public-pages.mjs` must remain synchronized with React routes, `PageMeta`, sitemap, llms, internal links and Vercel static-route rewrites.
- Unknown production paths must return the platform 404 response or `404.html`; they must not rewrite to homepage HTML.
- Preview deployments must block crawlers. Production indexing must use the configured canonical origin rather than a preview URL.

## Design tokens and foundations

`src/styles/tokens.css` is the source of truth and must keep three layers:

1. Primitive tokens must contain raw color, typography, spacing, radius, shadow and motion values.
2. Semantic tokens must describe purpose such as foreground, action, border, focus and status.
3. Component tokens must describe button, input, panel, badge and header behavior.

### Typography

- The primary family must be Be Vietnam Pro with the documented system fallback stack.
- Body copy must use the 16px base token, weight 400 and 1.6 line height.
- Compact UI text must use the provided `xs` through `4xl` scale; display headings may use existing fluid heading rules.
- Labels must remain readable at 200% zoom and must not be replaced by placeholders.

### Color

- Navy must carry primary text and structural information.
- Red must be reserved for primary actions, route markers and ordered emphasis.
- Warm paper remains the default page and control surface; cool pale gray identifies grouped or supporting content.
- Real photography may occupy large public surfaces, but navy overlays must preserve text contrast and red must remain reserved for actions and ordered emphasis.
- Raw colors must not appear in component rules.
- Red actions must use white text because the soft inverse token does not meet normal-text contrast on red.

### Spacing, shape and motion

- Components must use the 4–16px spacing tokens; page and section spacing must use semantic layout tokens.
- Controls use the 4px radius, public panels use the 6px radius, and pill treatment remains reserved for badges.
- Public elevation should use `shadow.1`; compact controls and panels should use `shadow.2`.
- State feedback must use the 150–300ms motion tokens. Deliberate staged motion may use the 400–1000ms tokens only when it communicates sequence or progress.
- Motion must only animate transform or opacity and must respect `prefers-reduced-motion`.

### Public mobile layout

- Public pages must use `--public-mobile-gutter`, `--public-mobile-section-gap`, `--public-mobile-header-height`, and `--public-mobile-card-peek`; route-level mobile spacing must not introduce competing page gutters.
- The mobile hierarchy must remain header → photo-led intro → overlapping or image-led service context → operational content → transactional CTA.
- The homepage service-card region must use native horizontal scrolling with scroll snap and a visible next-card peek below 640px. The region must be focusable, support Left and Right arrow keys, and own its overflow without causing page-level horizontal scrolling.
- At 640px and above, service cards must return to the shared responsive grid. Desktop must not inherit mobile card widths or overflow behavior.
- Public closing CTAs and the contact workflow may become edge-to-edge below 640px. Content inside them must retain the mobile gutter.
- Mobile photography must use deliberate crops and reserved aspect ratios; it must not be replaced by decorative gradients or unverified operational imagery.

### State precedence

- Interactive components must resolve overlapping states in this order: disabled → loading → error → active → focus-visible → hover → default.
- Focus-visible must remain visible when combined with error, selected or active states.
- Loading must not make a control appear enabled when pointer or keyboard activation is blocked.

## Component-level rules

### Header and navigation

- Anatomy must remain brand → content navigation → `GET A QUOTE` on desktop and brand → menu on mobile. The mobile menu must repeat the quote CTA after the navigation links.
- Navigation must use compact uppercase labels and a non-color active indicator.
- Mobile controls must remain on one line at 320px; the wordmark must not wrap.
- The open mobile navigation must use a page scrim, lock background scrolling, keep keyboard focus inside the drawer, close with Escape or scrim activation, and return focus to the menu trigger.
- Long navigation labels must wrap inside the open menu, never in the closed header.
- Keyboard users must be able to open the menu, traverse links in DOM order and close it with Escape.
- Pointer and touch targets must be at least 44×44px.
- Default links must use the navigation foreground token; hover should expose the action color and active must retain a non-color underline or inset marker.
- Focus-visible must show the system ring without moving the header. Disabled navigation, when unavoidable, must use `aria-disabled="true"` and must not navigate.
- Loading navigation must preserve header height and expose a named busy region. Error must keep core navigation available and present recovery text outside the menu trigger.
- Pointer activation must occur on click, touch activation must occur on release, and neither interaction may suppress keyboard behavior.

### Buttons and links

- Primary, secondary, ghost and text variants must use component tokens.
- Default must show the assigned semantic surface and label.
- Hover should change background or border without moving surrounding layout.
- Focus-visible must show the system focus ring.
- Active must darken the action and may translate by at most 1px.
- Disabled must use the disabled tokens, `disabled` or `aria-disabled`, and a not-allowed cursor.
- Loading must use `aria-busy="true"`, retain its label width and expose a readable status.
- Error must use the danger token plus text or an icon; color alone must not indicate failure.
- Labels must state the outcome, for example `Ước tính cước`, not `Tiếp tục`.
- Native buttons must activate with Enter and Space; links must activate with Enter. Pointer and touch activation must use the full visible target and must not fire twice from synthesized events.

### Inputs, selects and comboboxes

- Anatomy must include a persistent label, control, and helper or error region when needed.
- Default, hover, focus-visible, disabled and error states must use input component tokens.
- Active controls must retain the focus ring and may strengthen the border without changing dimensions.
- Loading must keep the control height stable and expose `aria-busy` on the relevant region.
- Error inputs must use `aria-invalid="true"` and reference the message with `aria-describedby`.
- Comboboxes must support Arrow keys, Enter, Escape and pointer/touch selection.
- Long selected values must wrap or truncate without covering the trailing action.
- Empty result states must explain that no supported destination matched and must preserve the typed query.
- Pointer and touch selection must use the entire option row; touch rows must be at least 44px high.

### Panels, cards and result surfaces

- Panels must use semantic surface, border, radius and shadow tokens.
- Public panels should use comfortable spacing; internal quote panels should use the compact density already established.
- Interactive panels must define hover, focus-visible, active, disabled, loading and error behavior even when a route currently uses only a subset.
- Default panels must use the panel surface and border tokens. Hover should strengthen the border, focus-visible must use the system ring, and active may remove elevation without shifting layout.
- Disabled panels must expose their unavailable status in text. Loading panels must use `aria-busy="true"` and retain their footprint. Error panels must use danger border plus a recovery message.
- Interactive panels must use native links or buttons for activation. Pointer and touch must activate the same target as keyboard Enter or Space.
- Numeric results must use tabular figures and must wrap safely on narrow screens.
- Loading and empty states must preserve the panel footprint to avoid layout shifts.
- Overflow must stay inside the owning panel; the page must never scroll horizontally at 320px.

### Public photography

- Public photography must come from a documented source with a license suitable for website use and must be stored locally.
- Source URL, photographer, license and retrieval date belong in the media source manifest.
- Stock photography is illustrative. Copy and alt text must not imply that pictured people, locations, equipment or brands belong to or endorse VI LOGIX.
- Visible captions on stock photography must use explicit illustrative wording and must not attach a VI LOGIX location, facility claim or operational metric to the pictured scene.
- Hero media loads eagerly with intrinsic dimensions and responsive sources; below-fold media lazy-loads.
- Photography supports the service narrative but never replaces route, rate, condition or verification information.
- Default media must reserve its intrinsic aspect ratio. Loading should use a neutral tokenized surface; error must fall back to meaningful text or a non-deceptive placeholder.
- Photography must not gain hover, active or focus states unless the whole media item is an actual link. Linked media must then follow the standard interactive state contract.

### Status and badges

- Status must pair color with an icon, dot or explicit text.
- Badge labels must remain one line when short and must wrap without clipping when translated or expanded.
- Error and warning states must remain distinguishable without color.
- Default badges must be static. Interactive badges must define hover, focus-visible, active and disabled states through tokens; loading must preserve label width and error must include explicit text.

### Lists and content rails

- Lists must use semantic list markup when order or grouping carries meaning.
- Default rows must use tokenized dividers. Hover, focus-visible and active states must appear only when the whole row is interactive.
- Disabled rows must explain why their action is unavailable; loading rows must preserve row height; error rows must include a recovery action when recovery is possible.
- Long Vietnamese or English content must wrap without covering numbers, icons or trailing actions. Horizontal scrolling must be owned by a labeled data region, never by the page.
- Empty lists must identify what is empty and provide the next valid action; they must not render a blank panel.
- Horizontally scrollable public rails must have an accessible name and instructions, expose a visible next item on mobile, and restore a normal grid at wider breakpoints.

### Dialogs and transient feedback

- Dialog anatomy must be title → optional description → content → actions, with an accessible name and initial focus on the safest useful control.
- Default, hover, focus-visible, active, disabled, loading and error states for dialog actions must reuse button tokens.
- Escape must close non-destructive dialogs. Focus must remain trapped while open and must return to the trigger after close.
- On narrow screens, content must scroll inside the dialog while title and primary recovery action remain reachable.
- Toasts must not be the only location for errors or transaction results; persistent task feedback must remain in the owning region.

## Accessibility requirements and acceptance criteria

- Normal text must reach at least 4.5:1 contrast; large text and UI boundaries must reach at least 3:1. **Pass:** automated contrast audit reports no failures for rendered states.
- Every interactive element must show a visible focus indicator with at least 3:1 contrast. **Pass:** keyboard traversal never loses visible focus.
- Every pointer target must be at least 44×44px. **Pass:** computed bounds meet both dimensions at 320px, 768px and desktop widths.
- The site must remain usable at 200% zoom. **Pass:** content and controls remain available without two-dimensional scrolling.
- Forms must expose labels, instructions and errors programmatically. **Pass:** accessibility tree includes the correct name, description and invalid state.
- Menu and combobox interactions must work without a pointer. **Pass:** documented keyboard sequences complete every action.
- Reduced-motion users must not receive spatial animation. **Pass:** emulated reduced motion reduces transitions to effectively zero.
- Error, success and readiness must not rely on color alone. **Pass:** each rendered status has readable text or a semantic icon.
- Page landmarks must have unique accessible names where more than one of a type exists. **Pass:** the accessibility tree exposes one primary navigation and an unambiguous main region.
- Reflow must support long content and zoom. **Pass:** at 320 CSS pixels and 200% zoom, users can reach every control without page-level horizontal scrolling.
- Loading and async errors must be announced without moving focus unexpectedly. **Pass:** a screen-reader check exposes the busy state and subsequent status message once.

## Content and tone standards

- Copy must be concise, confident and implementation-specific.
- Actions must use verb + object: `Ước tính cước`, `Sao chép bản tiếng Anh`, `Xem điều kiện áp dụng`.
- Error messages must explain what happened and what to do next.
  - Good: `Không tìm thấy mức cước cho bậc cân này. Vui lòng xác minh trước khi báo giá.`
  - Avoid: `Có lỗi.`
- Pricing content must preserve unavailable or review-required source values and must never invent a fallback rate.
- Customer-facing quote text must remain carrier-neutral and must not expose internal pricing formulas.
- The homepage should use one section per decision: positioning → service scope → operating model → workflow → guidance → next action. Repeated decorative workflow strips or duplicate image galleries should not be added.

## Anti-patterns and prohibited implementations

- Components must not use raw hex colors, arbitrary spacing or one-off radii.
- Components must not hide focus indicators or use placeholders as labels.
- Components must not use low-contrast inverse text on red actions.
- Components must not introduce decorative gradients, glass effects, excessive pills or nested cards. Image scrims are allowed only to guarantee readable text contrast.
- Implementations must not add unsupported tracking, carrier, service or delivery claims.
- Mobile layouts must keep WhatsApp inquiry actions discoverable without adding unverified pricing controls.

## Migration and edge cases

- Existing compatibility aliases should remain until all call sites use semantic or component tokens directly.
- New work must use the new token names; it must not add another compatibility alias.
- Long Vietnamese and English labels should be tested at 30% expansion.
- Missing routes, malformed price cells and review-required values must render an explicit verification state.
- External page-density counts must not be treated as VI LOGIX requirements; route density must follow the current content and task.
- The Logistra font and raw color values must not replace VI LOGIX brand tokens. Only the documented relationships, radius scale, motion scale and implementation discipline are adopted.
- Existing radius consumers should migrate by purpose: compact detail → `radius.xs` or `radius.sm`, controls → `radius.md`, panels/media → `radius.lg`, badges → `radius.xl`.
- Components missing a documented state must be treated as incomplete even if the current page cannot trigger that state yet.

## QA checklist

- [ ] No external brand name, logo, copy or audience assumption appears in source or rendered output.
- [ ] Components reference semantic or component tokens instead of raw colors.
- [ ] Buttons and inputs cover default, hover, focus-visible, active, disabled, loading and error states.
- [ ] Header and forms pass keyboard-only operation.
- [ ] Focus, normal text and UI boundaries pass WCAG 2.2 AA contrast.
- [ ] Homepage, About, Contact and internal quote have no page-level horizontal overflow at 320px, 390px, 768px and desktop; mobile service-card movement remains inside its labeled region.
- [ ] The mobile navigation locks background scroll, traps focus, closes with Escape or the scrim, and returns focus to its trigger.
- [ ] Homepage service cards respond to touch swipes and Left/Right arrow keys, show a next-card peek, and render as a grid from 640px upward.
- [ ] Long labels, empty results, unavailable rates and validation errors remain readable.
- [ ] Reduced-motion mode removes spatial motion.
- [ ] Default, hover, focus-visible, active, disabled, loading and error behavior is documented and implemented for every interactive component.
- [ ] Keyboard, pointer and touch behavior matches the component rules.
- [ ] Long content at 30% expansion, empty states and loading states preserve layout and meaning.
- [ ] Logistra reference values appear only in this traceability section or primitive tokens, never as one-off component literals.
- [ ] Public contact CTAs route through the lean form, the WhatsApp number is not displayed, and the generated message remains concise.
- [ ] Stock images are visibly framed as illustrative and do not claim to depict VI LOGIX facilities or staff.
- [ ] `npm run build` passes before delivery.
