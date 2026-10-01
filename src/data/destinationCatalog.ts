import { DESTINATIONS } from './destinations'
import type { DestinationId } from '../types'

export interface DestinationCatalogItem {
  id: DestinationId
  name: string
  country: string
  tagline: string
  featured: boolean
  aliases: string[]
}

const ALIASES: Record<DestinationId, string[]> = {
  lisbon: ['Lisbon', 'Lisboa'],
  tokyo: ['Tokyo', 'Tōkyō'],
  'new-york': ['New York', 'New York City', 'NYC'],
  'cape-town': ['Cape Town', 'Cape Town City'],
}

export const DESTINATION_CATALOG: DestinationCatalogItem[] = DESTINATIONS.map((destination) => ({
  id: destination.id,
  name: destination.name,
  country: destination.country,
  tagline: destination.tagline,
  featured: true,
  aliases: ALIASES[destination.id] ?? [destination.name],
}))

export const FEATURED_DESTINATION_IDS: DestinationId[] = DESTINATION_CATALOG
  .filter((destination) => destination.featured)
  .map((destination) => destination.id)

export function findDestinationInText(text: string): DestinationId | undefined {
  const normalized = text.toLowerCase()
  return DESTINATION_CATALOG.find((destination) =>
    destination.aliases.some((alias) =>
      normalized.includes(alias.toLowerCase()),
    ),
  )?.id
}

export function searchDestinations(query: string): DestinationCatalogItem[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return DESTINATION_CATALOG

  return DESTINATION_CATALOG.filter((destination) =>
    [destination.name, destination.country, destination.tagline, ...destination.aliases]
      .join(' ')
      .toLowerCase()
      .includes(normalized),
  )
}
