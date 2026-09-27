export type Interest =
  | 'architecture'
  | 'food'
  | 'cafes'
  | 'galleries'
  | 'history'
  | 'nature'
  | 'nightlife'
  | 'beach'
  | 'views'
  | 'shopping'

export type Role =
  | 'coffee'
  | 'morning'
  | 'lunch'
  | 'afternoon'
  | 'afternoon2'
  | 'sunset'
  | 'dinner'
  | 'evening'

export type Pace = 'relaxed' | 'balanced' | 'packed'
export type Mood = 'relaxed' | 'balanced' | 'adventurous' | 'food-first' | 'culture-first'
export type Avoid = 'tourist-traps' | 'crowds' | 'long-journeys' | 'late-nights'
export type Adjust = 'slower' | 'rain' | 'tired'
export type DestinationId = 'lisbon' | 'tokyo' | 'new-york' | 'cape-town'

export interface Activity {
  id: string
  zone: string
  role: Role
  name: string
  area: string
  minutes: number
  tags: Interest[]
  note: string
  indoor: boolean
  tourist: 0 | 1 | 2 | 3
  energy: 1 | 2 | 3
}

export interface Zone {
  id: string
  title: string
  blurb: string
  /** Only scheduled when the traveller cares about one of these, or when needed to fill the days. */
  optional?: Interest[]
  /** The classic first day for a first visit. */
  iconic?: boolean
}

export interface Palette {
  sky: string
  sun: string
  far: string
  mid: string
  near: string
  accent: string
}

export interface Destination {
  id: DestinationId
  name: string
  country: string
  tagline: string
  palette: Palette
  zones: Zone[]
  activities: Activity[]
}

export interface Brief {
  destination: DestinationId
  days: number
  interests: Interest[]
  pace: Pace
  avoid: Avoid[]
}

export interface Ctx {
  interests: Interest[]
  boost: Interest[]
  pace: Pace
  moodLabel: string
  avoidTouristy: boolean
  avoidLong: boolean
  noLate: boolean
}

export interface Pick {
  activity: Activity
  role: Role
  cross: boolean
  tag?: string
}

export interface ScheduledItem {
  activity: Activity
  role: Role
  start: string
  end: string
  travelMin: number
  travelFrom: string | null
  why: string
  tag?: string
}

export interface Day {
  index: number
  zone: Zone
  basePicks: Pick[]
  picks: Pick[]
  items: ScheduledItem[]
  buffer: number
  shift: number
  dinnerAt?: string
  notice?: string
}

export interface Interpretation {
  pace: string
  maxMajor: number
  travel: string
  buffer: string
  priorities: { label: string; level: string }[]
  secondary: string[]
  avoid: string[]
}

export interface Scene {
  brief: Brief
  destination: Destination
  mood: Mood
  pace: Pace
  ctx: Ctx
  days: Day[]
  interpretation: Interpretation
}
