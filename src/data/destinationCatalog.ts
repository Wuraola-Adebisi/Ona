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

export const DESTINATION_CATALOG: DestinationCatalogItem[] = DESTINATIONS.map((destination) => ({
  id: destination.id,
  name: destination.name,
  country: destination.country,
  tagline: destination.tagline,
  featured: true,
  aliases: [destination.name],
}))

export const FEATURED_DESTINATION_IDS: DestinationId[] = DESTINATIONS.map(
  (destination) => destination.id,
)

const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\$&')

export function findDestinationInText(text: string): DestinationId | undefined {
  return DESTINATION_CATALOG.find((destination) =>
    destination.aliases.some((alias) => {
      const pattern = new RegExp('\\\\b' + escapeRegExp(alias) + '\\\\b', 'i')
      return pattern.test(text)
    }),
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
