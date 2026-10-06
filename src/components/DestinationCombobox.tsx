import { useEffect, useMemo, useRef, useState, type FocusEvent, type KeyboardEvent } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import type { Destination } from '../data/pricing'

interface DestinationComboboxProps {
  destinations: Destination[]
  aliases: Record<string, string[]>
  value: string
  onChange: (destinationId: string) => void
  label?: string
}

const RESULT_LIMIT = 12

export const normalizeSearchText = (value: string) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Đ/g, 'D')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim()

const searchRank = (destination: Destination, aliases: string[], query: string) => {
  if (!query) return 0
  const name = normalizeSearchText(destination.name)
  const normalizedAliases = aliases.map(normalizeSearchText)
  if (name === query || normalizedAliases.includes(query)) return 0
  if (name.startsWith(query)) return 1
  if (normalizedAliases.some((alias) => alias.startsWith(query))) return 2
  if (name.includes(query)) return 3
  if (normalizedAliases.some((alias) => alias.includes(query))) return 4
  return Number.POSITIVE_INFINITY
}

export function DestinationCombobox({
  destinations,
  aliases,
  value,
  onChange,
  label = 'Destination country',
}: DestinationComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = destinations.find((destination) => destination.id === value)
  const normalizedQuery = normalizeSearchText(query)

  const filtered = useMemo(() => destinations
    .map((destination) => ({
      destination,
      rank: searchRank(destination, aliases[destination.id] ?? [], normalizedQuery),
    }))
    .filter(({ rank }) => Number.isFinite(rank))
    .sort((a, b) => a.rank - b.rank || a.destination.name.localeCompare(b.destination.name, 'en'))
    .map(({ destination }) => destination), [aliases, destinations, normalizedQuery])

  const visibleResults = filtered.slice(0, RESULT_LIMIT)
  const activeDestination = visibleResults[Math.min(activeIndex, Math.max(visibleResults.length - 1, 0))]

  const close = () => {
    setOpen(false)
    setQuery('')
    setActiveIndex(0)
  }

  useEffect(() => {
    if (!open) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  const selectDestination = (destination: Destination) => {
    onChange(destination.id)
    close()
  }

  const openSearch = () => {
    if (!open) {
      setOpen(true)
      setQuery('')
      setActiveIndex(0)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      event.currentTarget.blur()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      openSearch()
      if (open && visibleResults.length) setActiveIndex((index) => (index + 1) % visibleResults.length)
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      openSearch()
      if (open && visibleResults.length) setActiveIndex((index) => (index - 1 + visibleResults.length) % visibleResults.length)
      return
    }
    if (event.key === 'Enter' && open && activeDestination) {
      event.preventDefault()
      selectDestination(activeDestination)
    }
  }

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) close()
  }

  const selectedLabel = selected?.name ?? ''

  return (
    <div ref={rootRef} className="relative" onBlurCapture={handleBlur}>
      <label className="field-label" htmlFor="destination">
        {label}
      </label>
      <div className="input-frame input-frame-spaced">
        <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-[var(--color-ash-gray)]" strokeWidth={1.5} aria-hidden="true" />
        <input
          id="destination"
          role="combobox"
          type="text"
          autoComplete="off"
          value={open ? query : selectedLabel}
          placeholder={open ? 'Search by country name' : 'Select a country'}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="destination-listbox"
          aria-activedescendant={open && activeDestination ? `destination-option-${activeDestination.id}` : undefined}
          className="form-control form-control-leading-icon form-control-trailing-icon cursor-text"
          onFocus={openSearch}
          onClick={openSearch}
          onChange={(event) => {
            setOpen(true)
            setQuery(event.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={handleKeyDown}
        />
        <ChevronDown className={`pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[var(--color-carbon-black)] transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} aria-hidden="true" />
      </div>

      {open && (
        <div className="combobox-popover absolute inset-x-0 top-full z-30 mt-1 overflow-hidden border border-[var(--color-border-strong)] bg-[var(--color-surface)] shadow-lg">
          <div className="border-b border-[var(--color-concrete-gray)] px-3 py-3 text-xs font-semibold text-[var(--color-muted-text)]" aria-live="polite">
            {filtered.length === 0
              ? 'No matching country found'
              : filtered.length > RESULT_LIMIT
                ? `Showing ${RESULT_LIMIT} of ${filtered.length} results`
                : `${filtered.length} results`}
          </div>
          <div id="destination-listbox" role="listbox" aria-label="Country search results" className="max-h-80 overflow-y-auto">
            {visibleResults.length > 0 && (
              <>
              {visibleResults.map((destination, index) => {
                const active = destination.id === activeDestination?.id
                const isSelected = destination.id === value
                return (
                  <button
                    key={destination.id}
                    id={`destination-option-${destination.id}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`flex min-h-12 w-full items-center gap-3 border-b border-[var(--color-concrete-gray)] px-3 py-2 text-left text-sm transition-colors last:border-b-0 ${active ? 'bg-[var(--color-mist-gray)] text-[var(--color-carbon-black)]' : 'bg-[var(--color-surface)] text-[var(--color-carbon-black)] hover:bg-[var(--color-mist-gray)]'}`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectDestination(destination)}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{destination.name}</span>
                      <span className="mt-1 block text-xs text-[var(--color-muted-text)]">
                        {destination.status === 'verified' ? 'Rate data available' : 'Review required'}
                      </span>
                    </span>
                    <Check className={`size-4 shrink-0 ${isSelected ? 'text-[var(--color-carbon-black)]' : 'text-transparent'}`} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                )
              })}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
