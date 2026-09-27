import type { Brief, DestinationId } from '../types'

export interface Example {
  id: DestinationId
  brief: Brief
  said: string
}

export const EXAMPLES: Example[] = [
  {
    id: 'lisbon',
    brief: { destination: 'lisbon', days: 4, interests: ['architecture', 'food', 'cafes', 'galleries'], pace: 'relaxed', avoid: ['tourist-traps'] },
    said: 'Four days in Lisbon. I like architecture, cafés, galleries and good food. I do not want a packed itinerary.',
  },
  {
    id: 'tokyo',
    brief: { destination: 'tokyo', days: 5, interests: ['food', 'architecture', 'nightlife', 'shopping'], pace: 'balanced', avoid: ['crowds'] },
    said: 'Five days in Tokyo. Food comes first, then buildings, bars and some shopping. Keep the crowds down where you can.',
  },
  {
    id: 'new-york',
    brief: { destination: 'new-york', days: 3, interests: ['galleries', 'architecture', 'food', 'nightlife'], pace: 'packed', avoid: [] },
    said: 'Three days in New York. Museums, architecture, good dinners and jazz. Fit in as much as you can.',
  },
  {
    id: 'cape-town',
    brief: { destination: 'cape-town', days: 4, interests: ['nature', 'beach', 'views', 'food'], pace: 'relaxed', avoid: ['crowds'] },
    said: 'Four days in Cape Town. Beaches, views and food, at a slow pace, away from the crowds.',
  },
]
