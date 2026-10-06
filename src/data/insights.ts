export interface InsightSection {
  heading: string
  paragraphs: string[]
  points?: string[]
}

export interface InsightArticle {
  slug: string
  category: string
  title: string
  excerpt: string
  description: string
  readingTime: string
  takeaway: string
  sections: InsightSection[]
}

export const INSIGHTS: InsightArticle[] = [
  {
    slug: 'prepare-multi-supplier-fulfillment-vietnam',
    category: 'Receiving & storage',
    title: 'What to tell Vietnam suppliers before goods reach a fulfillment warehouse',
    excerpt: 'Give every supplier the same receiving reference, delivery instructions, and document checklist before the goods leave their premises.',
    description: 'Receiving instructions for Vietnamese suppliers sending goods to a fulfillment warehouse for consolidation and international shipping.',
    readingTime: '6 min read',
    takeaway: 'A supplier should not dispatch until the receiving location, shipment reference, expected contents, and required documents are confirmed.',
    sections: [
      {
        heading: 'What should every supplier know before dispatch?',
        paragraphs: [
          'Every supplier should receive the confirmed warehouse delivery details, customer name, shipment reference, expected product and quantity, and the receiving contact procedure before dispatch. These details let the warehouse match an arriving parcel to the correct international buyer and shipment plan.',
          'Use the same reference format for every supplier in the consolidation. Product names alone are not reliable identifiers when several buyers or suppliers send similar goods.',
        ],
        points: ['Customer or business name', 'VI LOGIX shipment reference', 'Supplier name and contact', 'Expected parcel count', 'Product and quantity summary'],
      },
      {
        heading: 'How should suppliers label each parcel?',
        paragraphs: [
          'Ask the supplier to place the shipment reference on the outer parcel and include a packing note inside when possible. If one supplier sends several boxes, each box should show its sequence, such as box 1 of 3.',
          'Retail branding, supplier order numbers, and domestic courier labels can remain useful, but they should not replace the shared receiving reference.',
        ],
      },
      {
        heading: 'What information should be sent after dispatch?',
        paragraphs: ['The supplier should send the domestic tracking number, dispatch date, parcel count, and any change from the expected contents. Sharing this before arrival gives the receiving team a reference for matching and recording the delivery.'],
        points: ['Domestic tracking number or delivery note', 'Dispatch date and expected arrival', 'Number of parcels', 'Confirmed quantity sent', 'Notice of substitutions, shortages, or split deliveries'],
      },
      {
        heading: 'Which documents may be needed later?',
        paragraphs: [
          'Keep the supplier invoice, product description, quantity, unit value, country of origin where applicable, and packing information available. The exact export and destination documents depend on the goods, route, and importer requirements.',
          'Do not ask a supplier to guess customs descriptions or values. Commercial information should match the actual transaction and be reviewed as part of shipment preparation.',
        ],
      },
      {
        heading: 'What should not be left until the parcel arrives?',
        paragraphs: [
          'Product checks, photography, measurement, relabeling, repacking, and removal of retail packaging are separate tasks. Confirm the required work, sample size, and reporting format before arrival so the handling scope is clear.',
          'Unannounced parcels, unidentified batteries or liquids, and last-minute handling requests can delay acceptance or require a revised scope. VI LOGIX confirms goods acceptance and receiving instructions before suppliers dispatch.',
        ],
      },
    ],
  },
  {
    slug: 'consolidation-and-repacking-guide',
    category: 'Consolidation',
    title: 'How multi-supplier consolidation works in Vietnam',
    excerpt: 'Consolidation brings separate supplier deliveries into one controlled shipment after each arrival, handling instruction, and outbound requirement is checked.',
    description: 'Learn how multi-supplier consolidation in Vietnam combines separate supplier parcels into one planned international shipment.',
    readingTime: '6 min read',
    takeaway: 'Consolidation is a recorded workflow: plan the arrivals, identify each parcel, complete the agreed checks, then build the outbound shipment.',
    sections: [
      {
        heading: 'What is multi-supplier consolidation?',
        paragraphs: [
          'Multi-supplier consolidation means receiving goods from several Vietnamese suppliers at one location and preparing the approved goods as one planned outbound shipment. It replaces several disconnected handovers with one receiving record, one handling scope, and one final packing plan.',
          'Consolidation does not begin by opening every parcel automatically. The warehouse first needs to know which suppliers are included, how many parcels are expected, and what work is authorised for each arrival.',
        ],
      },
      {
        heading: 'How are separate supplier arrivals controlled?',
        paragraphs: ['Each delivery is matched to the customer and shipment reference, then recorded against the expected supplier list. Differences such as missing parcels, unexpected quantities, or visible outer damage can be raised before the goods are combined.'],
        points: ['Supplier and parcel reference', 'Arrival date and parcel count', 'Expected product and quantity', 'Visible outer condition', 'Agreed inspection or documentation task'],
      },
      {
        heading: 'What happens before goods are repacked?',
        paragraphs: [
          'The agreed product-care work happens before final packing. This may include counting, visual checks, measurement, photography, labeling, or separating goods by destination. The scope should state whether checks cover every item or an agreed sample.',
          'Original retail boxes, protective inserts, and supplier labels may matter for resale, warranty, or product protection. Nothing should be removed simply to reduce volume unless the buyer has approved it.',
        ],
      },
      {
        heading: 'How is the outbound shipment prepared?',
        paragraphs: [
          'After the expected arrivals and handling tasks are complete, the goods are packed for the selected shipping method. The completed shipment is measured and weighed because final dimensions can affect route availability and chargeable weight.',
          'The packing list, commercial information, destination, importer details, and any product-specific requirements are reviewed before handover is coordinated.',
        ],
      },
      {
        heading: 'When is consolidation a useful choice?',
        paragraphs: [
          'Consolidation is useful when an international buyer purchases from several suppliers, receives split production batches, or wants one controlled preparation stage before export. It can reduce duplicated handling and unnecessary outer packaging, but it does not guarantee a lower total shipping cost.',
          'The useful comparison is based on the final packed shipment, route, timing, destination charges, and importer setup. VI LOGIX confirms the handling and shipping options for each shipment rather than assuming consolidation is always the cheapest choice.',
        ],
      },
    ],
  },
  {
    slug: 'choose-air-sea-or-express-from-vietnam',
    category: 'International shipping',
    title: 'Air vs sea vs express shipping from Vietnam: how to choose',
    excerpt: 'Choose a shipping method by comparing urgency, packed size, product requirements, destination handling, and the importer’s receiving setup.',
    description: 'Compare air freight, sea freight, and express shipping from Vietnam using practical route, cargo, timing, and cost considerations.',
    readingTime: '7 min read',
    takeaway: 'Choose the route after packing, when the real dimensions, weight, contents, destination, timing need, and importer setup are known.',
    sections: [
      {
        heading: 'What is the difference between express, air, and sea shipping?',
        paragraphs: [
          'Express uses an integrated parcel network and is generally considered for smaller or urgent shipments. Air freight moves cargo through airport handling and can suit planned commercial shipments. Sea freight moves cargo through port and forwarder networks and is commonly considered for larger or heavier volumes.',
          'No method is automatically best. Current schedules, capacity, destination service, cargo acceptance, and clearance arrangements affect the available choice for each shipment.',
        ],
      },
      {
        heading: 'When does express shipping make sense?',
        paragraphs: [
          'Express can suit samples, replacement parts, smaller ecommerce replenishment, or other shipments where speed and parcel-level tracking matter. The final charge can be affected by volumetric weight, remote-area handling, product restrictions, and destination fees.',
          'A compact parcel is not always a simple parcel. Batteries, liquids, fragile goods, high values, and regulated products still require acceptance checks before routing is confirmed.',
        ],
      },
      {
        heading: 'When should buyers consider air freight?',
        paragraphs: [
          'Air freight can suit medium-size commercial shipments when express is not the right cost structure but the goods cannot wait for a sea schedule. The plan needs to include origin handling, airport movement, destination handling, clearance, and delivery after arrival.',
          'Compare the complete route rather than only the airport-to-airport rate. The importer or destination agent must be ready for the receiving and clearance steps that apply.',
        ],
      },
      {
        heading: 'When should buyers consider sea freight?',
        paragraphs: [
          'Sea freight is commonly evaluated for wholesale, heavy, bulky, or higher-volume cargo. Less-than-container-load and full-container-load options depend on cargo volume, frequency, product characteristics, destination port, and the importer’s receiving setup.',
          'Sea schedules are more exposed to cut-off dates, consolidation windows, port handling, and onward delivery arrangements. The lowest headline freight rate may not produce the lowest landed handling cost.',
        ],
      },
      {
        heading: 'Which facts are needed for a useful comparison?',
        paragraphs: ['A useful route comparison starts after the goods and packing plan are understood. VI LOGIX confirms the available provider, routing, and current estimate for the shipment instead of publishing a fixed transit promise.'],
        points: ['Final or estimated packed weight and dimensions', 'Accurate product descriptions and quantities', 'Batteries, liquids, fragile parts, or regulated materials', 'Destination and importer details', 'Required arrival window', 'Preference for door, airport, port, or forwarder handover'],
      },
    ],
  },
  {
    slug: 'international-buyers-shipping-from-vietnam',
    category: 'Buyer guide',
    title: 'What international buyers need to know about shipping from Vietnam',
    excerpt: 'A reliable shipment starts before carrier handover: confirm goods acceptance, Vietnam-side handling, commercial information, destination responsibilities, and the final route.',
    description: 'A practical overview of fulfillment, documents, importer responsibilities, and international shipping preparation for buyers sourcing goods in Vietnam.',
    readingTime: '7 min read',
    takeaway: 'Treat fulfillment, export preparation, international transport, and destination import as connected stages with clearly assigned responsibilities.',
    sections: [
      {
        heading: 'What happens between a Vietnam supplier and international delivery?',
        paragraphs: [
          'After purchase, goods may need domestic delivery or pickup, receiving, storage, product checks, consolidation, repacking, measurement, documentation preparation, and international handover. A Vietnam fulfillment partner coordinates the agreed local stages so an overseas buyer does not need to manage every supplier parcel separately.',
          'The service scope should identify where VI LOGIX responsibility begins and ends. Supplier performance, product conformity beyond the agreed checks, import clearance, duties, taxes, and destination delivery obligations must remain clearly assigned.',
        ],
      },
      {
        heading: 'Which shipment details should be confirmed first?',
        paragraphs: ['Start with the supplier list, expected goods, parcel count, product characteristics, handling instructions, destination, importer, and target timing. Mention batteries, liquids, magnets, fragile components, unusual values, or regulated materials before goods move.'],
        points: ['Supplier names and dispatch plan', 'Product description, quantity, and value', 'Expected packaging and parcel count', 'Inspection, photography, or repacking brief', 'Destination and importer contact', 'Timing requirement and preferred handover type'],
      },
      {
        heading: 'What commercial information is needed?',
        paragraphs: [
          'International shipment preparation normally relies on accurate invoice and packing information. Product descriptions should explain what the goods are, not use internal SKU names alone. Quantities, values, weights, package dimensions, and origin information must reflect the actual shipment.',
          'Document requirements vary by product and destination. VI LOGIX can prepare the agreed shipment information and coordinate handover, but the buyer or importer remains responsible for destination permits, duties, taxes, and clearance unless a different responsibility is confirmed in writing.',
        ],
      },
      {
        heading: 'How should restricted or sensitive goods be handled?',
        paragraphs: [
          'Do not send sensitive goods to a fulfillment location before acceptance is confirmed. Batteries, liquids, powders, food, cosmetics, medical products, branded goods, high-value items, oversized cargo, and fragile products may need additional documents, packaging, or route approval.',
          'Photos and supplier descriptions help with an initial review, but final acceptance can depend on the actual product, packaging, quantity, and current route rules.',
        ],
      },
      {
        heading: 'How does an international buyer request a workable quote?',
        paragraphs: [
          'Provide enough information to price the Vietnam-side handling and compare supported shipping methods. If dimensions or weights are not final, identify them as estimates so the quote can state what must be rechecked after packing.',
          'VI LOGIX responds to quote requests within one business day with an initial scope review. Final handling, routing, cost, and timing depend on the shipment details and any follow-up information required.',
        ],
      },
    ],
  },
]

export const getInsightBySlug = (slug: string | undefined) => INSIGHTS.find((article) => article.slug === slug)
