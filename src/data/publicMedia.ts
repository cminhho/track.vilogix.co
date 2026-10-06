export type PublicMediaAsset = {
  src: string
  srcSet: string
  width: number
  height: number
  alt: string
  position?: string
}

export const PUBLIC_MEDIA = {
  warehouseHero: {
    src: '/images/logistics/warehouse-hero-1024.webp',
    srcSet: '/images/logistics/warehouse-hero-720.webp 720w, /images/logistics/warehouse-hero-1024.webp 1024w, /images/logistics/warehouse-hero-1600.webp 1600w',
    width: 1600,
    height: 1000,
    alt: 'Aisle between storage racks in a logistics warehouse',
    position: 'center center',
  },
  parcelSorting: {
    src: '/images/logistics/parcel-sorting-720.webp',
    srcSet: '/images/logistics/parcel-sorting-720.webp 720w, /images/logistics/parcel-sorting-1200.webp 1200w',
    width: 1200,
    height: 900,
    alt: 'Warehouse worker sorting parcels in a packing area',
    position: 'center center',
  },
  inventoryScan: {
    src: '/images/logistics/inventory-scan-720.webp',
    srcSet: '/images/logistics/inventory-scan-720.webp 720w, /images/logistics/inventory-scan-1200.webp 1200w',
    width: 1200,
    height: 900,
    alt: 'Warehouse worker scanning inventory on storage racks',
    position: 'center center',
  },
  operationsCheck: {
    src: '/images/logistics/operations-check-720.jpg',
    srcSet: '/images/logistics/operations-check-720.jpg 720w, /images/logistics/operations-check-1200.jpg 1200w',
    width: 1200,
    height: 1800,
    alt: 'Warehouse worker checking a parcel against handling information',
    position: 'center center',
  },
} satisfies Record<string, PublicMediaAsset>
