import type { FaqItem } from './homeFaq'

export type ServiceMediaKey = 'warehouseHero' | 'parcelSorting' | 'inventoryScan' | 'operationsCheck'

export interface ServicePageDefinition {
  slug: string
  path: string
  title: string
  description: string
  eyebrow: string
  h1: string
  lead: string
  summaryHeading: string
  summary: string
  mediaKey: ServiceMediaKey
  serviceTypes: readonly string[]
  areaServed: readonly string[]
  facts: readonly { label: string; value: string }[]
  steps: readonly { title: string; copy: string }[]
  included: readonly string[]
  boundaries: readonly string[]
  faqItems: readonly FaqItem[]
  coordination?: {
    heading: string
    copy: string
    modes: readonly string[]
  }
}

export const SERVICE_PAGES: readonly ServicePageDefinition[] = [
  {
    slug: 'receiving-storage-vietnam',
    path: '/services/receiving-storage-vietnam',
    title: 'Receiving & Storage Vietnam — Warehouse in Ho Chi Minh City',
    description: 'Receive parcels from multiple suppliers at our Thu Duc warehouse. We record, store and hold goods to your confirmed shipment schedule.',
    eyebrow: 'Receiving & storage · Vietnam',
    h1: 'Receiving & Storage in Ho Chi Minh City',
    lead: 'VI LOGIX receives customer-owned goods from one or multiple Vietnam suppliers at our Thu Duc location, records each arrival against your shipment plan, and stores it for the confirmed period.',
    summaryHeading: 'One receiving point for goods from multiple Vietnam suppliers.',
    summary: 'Use one shipment reference across supplier deliveries so apparel, accessories, homeware and décor, handicrafts, furniture components, and consumer goods can be identified before the next agreed handling step.',
    mediaKey: 'warehouseHero',
    serviceTypes: ['Receiving', 'Storage', 'Multi-supplier fulfillment'],
    areaServed: ['Ho Chi Minh City', 'Vietnam'],
    facts: [
      { label: 'Receiving point', value: 'Thu Duc, Ho Chi Minh City' },
      { label: 'Before arrival', value: 'Supplier and parcel list confirmed' },
      { label: 'After arrival', value: 'Goods recorded to the agreed scope' },
    ],
    steps: [
      { title: 'Confirm the arrivals', copy: 'Share supplier names, expected parcel counts, product types, quantities, timing, and domestic tracking details before dispatch.' },
      { title: 'Receive and identify', copy: 'We match delivered parcels to the shipment reference and flag arrivals that cannot be identified or accepted.' },
      { title: 'Record the agreed details', copy: 'Parcel counts, goods counts, photos, or visible-condition notes are recorded only when included in the written scope.' },
      { title: 'Store for the confirmed period', copy: 'Accepted goods are held until the next agreed inspection, consolidation, packing, pickup, or shipping step.' },
    ],
    included: ['Supplier-delivery reception', 'Parcel identification and arrival recording', 'Agreed counting or arrival photography', 'Storage for the confirmed period', 'Notification of visible arrival issues within scope'],
    boundaries: ['Unannounced or restricted goods may be refused', 'Storage period and acceptance are confirmed before delivery', 'Product testing, certification, repair, and insurance are not included unless agreed separately', 'Supplier invoices and product information remain the customer’s responsibility'],
    faqItems: [
      { question: 'Can multiple Vietnam suppliers send goods to the same receiving point?', answer: 'Yes. Give each supplier the confirmed shipment reference and share expected parcel details before dispatch so separate arrivals can be matched to one plan.' },
      { question: 'What information is needed before a supplier sends goods?', answer: 'Share the supplier name, product type, quantity, expected parcel count, domestic tracking details, arrival timing, and any batteries, liquids, fragile parts, or special handling conditions.' },
      { question: 'How long can goods be stored?', answer: 'The storage period is confirmed for each shipment based on the goods, space required, arrival schedule, and planned next step.' },
      { question: 'Are all products accepted?', answer: 'No. Goods acceptance depends on the product, value, packaging, dimensions, and any safety or regulatory restrictions. Acceptance must be confirmed before dispatch.' },
    ],
  },
  {
    slug: 'shipment-consolidation-vietnam',
    path: '/services/shipment-consolidation-vietnam',
    title: 'Consolidate Shipments from Vietnam Suppliers — VI LOGIX',
    description: 'Combine goods from multiple Vietnamese suppliers into one international shipment. Consolidation and repacking in Ho Chi Minh City.',
    eyebrow: 'Shipment consolidation · Vietnam',
    h1: 'Consolidate Shipments from Vietnam Suppliers',
    lead: 'VI LOGIX receives separate supplier parcels in Thu Duc, records them against one shipment plan, and combines the approved goods into a final shipment prepared for the selected route.',
    summaryHeading: 'Turn separate supplier arrivals into one controlled shipment.',
    summary: 'Consolidation helps international buyers manage goods from multiple Vietnam suppliers through one arrival record, one written handling scope, and one final packed configuration.',
    mediaKey: 'parcelSorting',
    serviceTypes: ['Shipment consolidation', 'Repacking', 'Multi-supplier fulfillment'],
    areaServed: ['Ho Chi Minh City', 'Vietnam'],
    facts: [
      { label: 'Inputs', value: 'One or multiple Vietnam suppliers' },
      { label: 'Control point', value: 'Written consolidation brief' },
      { label: 'Output', value: 'Final packed weight and dimensions' },
    ],
    steps: [
      { title: 'Build one supplier plan', copy: 'List each supplier, product, expected quantity, parcel count, and target arrival before goods begin moving.' },
      { title: 'Match every arrival', copy: 'We record received parcels against the plan and flag missing, extra, unidentified, or visibly damaged arrivals within scope.' },
      { title: 'Confirm what can be combined', copy: 'Retail packaging, protective materials, labels, and fragile-item separation are kept or removed only under written instructions.' },
      { title: 'Repack and measure', copy: 'The completed shipment is packed for the selected method, then measured and weighed before the shipping option is finalized.' },
    ],
    included: ['Multi-supplier arrival matching', 'Agreed quantity or visible-condition checks', 'Removal of unnecessary outer packaging when approved', 'Separation of goods with different handling needs', 'Final carton measurement and weight recording'],
    boundaries: ['Consolidation does not guarantee a lower freight cost', 'Retail or protective packaging is not removed without approval', 'Restricted or incompatible goods may require separate handling', 'Final shipping cost depends on the completed packed shipment and route'],
    faqItems: [
      { question: 'Can VI LOGIX consolidate goods from several Vietnamese suppliers?', answer: 'Yes. Separate supplier deliveries can be received and matched to one confirmed shipment plan before approved goods are combined.' },
      { question: 'Will you remove supplier packaging?', answer: 'Only when the written brief allows it. Retail boxes, labels, protective inserts, and warranty-related packaging may need to remain with the goods.' },
      { question: 'Do you check quantities before consolidation?', answer: 'Counting can be included in the handling scope. The required SKU, quantity, parcel, and photo checks must be agreed before work begins.' },
      { question: 'When is the shipping rate confirmed?', answer: 'The route and estimate can be reviewed earlier, but the final shipping basis depends on the completed shipment’s packed weight, dimensions, goods, and destination.' },
    ],
  },
  {
    slug: 'product-inspection-vietnam',
    path: '/services/product-inspection-vietnam',
    title: 'Pre-Shipment Inspection & Product Care — Vietnam',
    description: 'Inspect, count, photograph and repack your goods before international shipping from Vietnam. Handling confirmed per your brief.',
    eyebrow: 'Product checks · Vietnam',
    h1: 'Pre-Shipment Inspection & Product Care in Vietnam',
    lead: 'VI LOGIX carries out agreed visual checks, counting, photography, measurement, labeling, and repacking for customer-owned goods before consolidation or international shipping.',
    summaryHeading: 'Define the checks before your goods are handled.',
    summary: 'Product care is a written task list, not a generic quality promise. Tell us which items, quantities, angles, measurements, labels, or visible conditions need to be recorded.',
    mediaKey: 'inventoryScan',
    serviceTypes: ['Visual product inspection', 'Product care', 'Repacking and labeling'],
    areaServed: ['Ho Chi Minh City', 'Vietnam'],
    facts: [
      { label: 'Inspection basis', value: 'Customer-approved written brief' },
      { label: 'Available records', value: 'Counts, photos, video, measurements' },
      { label: 'Service boundary', value: 'No certification or laboratory testing' },
    ],
    steps: [
      { title: 'Define the sample or item scope', copy: 'Specify the SKUs, quantities, visible features, measurements, photos, or labels that need to be checked.' },
      { title: 'Prepare and identify goods', copy: 'We match the requested items to the received shipment and separate anything that cannot be identified safely.' },
      { title: 'Complete the agreed checks', copy: 'The team records only the visible and measurable criteria included in the confirmed brief.' },
      { title: 'Report and continue by instruction', copy: 'Results are shared for review before repacking, consolidation, return, or shipping proceeds where approval is required.' },
    ],
    included: ['Visual-condition checks to supplied criteria', 'SKU or piece counting', 'Photo or video records', 'Basic dimensions and weight recording', 'Labeling and repacking to confirmed instructions'],
    boundaries: ['No laboratory, material, electrical, or compliance testing', 'No certification or destination regulatory approval', 'No product repair, warranty, or insurance assessment', 'A visual check cannot prove hidden construction or future performance'],
    faqItems: [
      { question: 'What can VI LOGIX inspect before shipping?', answer: 'We can complete agreed visual-condition checks, counts, photos, videos, measurements, labels, and packaging checks for identified goods.' },
      { question: 'Is this a certification or laboratory inspection service?', answer: 'No. VI LOGIX does not provide laboratory testing, certification, regulatory approval, or technical product verification unless a separate qualified provider is agreed.' },
      { question: 'Can you photograph every item?', answer: 'Item-level photography may be possible when the quantity, required angles, file expectations, and handling time are confirmed in the written scope.' },
      { question: 'What happens if a visible issue is found?', answer: 'We record the issue within the agreed brief and request instructions before repacking, consolidation, return, or shipping when a customer decision is required.' },
    ],
  },
  {
    slug: 'international-shipping-vietnam',
    path: '/services/international-shipping-vietnam',
    title: 'International Shipping from Vietnam — Air, Sea, Express',
    description: 'Coordinate air freight, sea freight or express delivery from Ho Chi Minh City. We prepare documents and manage carrier handover.',
    eyebrow: 'International shipping · Vietnam',
    h1: 'International Shipping from Vietnam by Air, Sea or Express',
    lead: 'VI LOGIX prepares customer-owned goods in Ho Chi Minh City and coordinates route-dependent handover for shipping to the United States, United Kingdom and Europe, Australia, Canada, the Middle East, and other supported destinations.',
    summaryHeading: 'Choose the shipping method after the shipment is defined.',
    summary: 'Goods type, packed weight and dimensions, urgency, destination, importer setup, and current route availability determine whether express, air cargo, or sea freight is appropriate.',
    mediaKey: 'operationsCheck',
    serviceTypes: ['International shipping coordination', 'Air cargo preparation', 'Sea freight preparation', 'Express shipment preparation'],
    areaServed: ['United States', 'United Kingdom', 'Europe', 'Australia', 'Canada', 'Middle East'],
    facts: [
      { label: 'Origin', value: 'Ho Chi Minh City, Vietnam' },
      { label: 'Methods', value: 'Air, sea, or express' },
      { label: 'Provider', value: 'Confirmed by route and shipment' },
    ],
    steps: [
      { title: 'Confirm the shipment', copy: 'Review the goods, packed dimensions, weight, declared value, destination, timing, and importer information.' },
      { title: 'Compare suitable methods', copy: 'Express, air cargo, and sea freight are considered against shipment size, urgency, handling needs, and current route availability.' },
      { title: 'Prepare the handover', copy: 'We coordinate packing details and the shipment information required for the selected route and provider.' },
      { title: 'Release to the selected network', copy: 'Handover proceeds after scope, charges, documentation responsibilities, and destination arrangements are confirmed.' },
    ],
    included: ['Route and method coordination', 'Final shipment weight and dimension recording', 'Packing information and shipment-document preparation', 'Handover to the selected logistics network', 'Tracking or milestone information when supplied by the provider'],
    boundaries: ['The available provider is confirmed per shipment; no carrier partnership is implied', 'Transit estimates depend on route conditions and are not guarantees', 'Import permits, duties, taxes, and destination clearance remain with the buyer or importer unless agreed otherwise', 'Restricted goods and destination requirements must be reviewed before acceptance'],
    coordination: {
      heading: 'How shipping is coordinated',
      copy: 'Depending on the route and shipment, VI LOGIX coordinates handover through express parcel networks, postal networks, air cargo services, or sea freight forwarders. The available provider and routing are confirmed for each shipment.',
      modes: ['Express parcel networks', 'Postal networks', 'Air cargo services', 'Sea freight forwarders'],
    },
    faqItems: [
      { question: 'Which destinations can VI LOGIX coordinate from Vietnam?', answer: 'Common destination requests include the United States, the United Kingdom and Europe, Australia, Canada, and the Middle East. Availability is confirmed for the specific goods and route.' },
      { question: 'Should I choose air, sea, or express shipping?', answer: 'The suitable method depends on packed size and weight, urgency, destination, goods restrictions, importer arrangements, and current route availability.' },
      { question: 'Does VI LOGIX work with a fixed carrier?', answer: 'No fixed provider is promised publicly. The available logistics network and routing are selected and confirmed for each shipment.' },
      { question: 'Who handles import duties and destination clearance?', answer: 'Import permits, duties, taxes, and destination clearance remain with the buyer or importer unless a different responsibility is agreed in writing.' },
    ],
  },
]

export const getServiceBySlug = (slug: string | undefined) => SERVICE_PAGES.find((service) => service.slug === slug)
export const getServiceByPath = (path: string) => SERVICE_PAGES.find((service) => service.path === path)
