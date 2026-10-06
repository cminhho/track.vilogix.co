import type { CSSProperties } from 'react'
import type { PublicMediaAsset } from '../data/publicMedia'

export function LogisticsImage({
  asset,
  className = '',
  priority = false,
  sizes = '100vw',
}: {
  asset: PublicMediaAsset
  className?: string
  priority?: boolean
  sizes?: string
}) {
  return (
    <picture className={`logistics-picture ${className}`.trim()}>
      <img
        src={asset.src}
        srcSet={asset.srcSet}
        sizes={sizes}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        style={{ '--media-position': asset.position ?? 'center' } as CSSProperties}
      />
    </picture>
  )
}
