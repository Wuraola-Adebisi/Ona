import { DESTINATIONS, getDestination } from '../data/destinations'
import { findDestinationInText } from '../data/destinationCatalog'
import type {
  Activity,
  Adjust,
  Avoid,
  Brief,
  Ctx,
  Day,
  Destination,
  DestinationId,
  Interest,
  Interpretation,
  Mood,
  Pace,
  Pick,
  Role,
  Scene,
  ScheduledItem,
  Zone,
} from '../types'

// ------------------------------------------------------------------ labels

export const INTEREST_LABELS: Record<Interest, string> = {
  architecture: 'Architecture',
  food: 'Food',
  cafes: 'Cafés',
  galleries: 'Galleries',
  history: 'History',
  nature: 'Nature',
  nightlife: 'Nightlife',
  beach: 'Beaches',
  views: 'Views',
  shopping: 'Shopping',
}

export const INTEREST_ORDER: Interest[] = [
  'architecture',
  'food',
  'cafes',
  'galleries',
  'history',
  'views',
  'nature',
  'beach',
  'nightlife',
  'shopping',
]

export const AVOID_LABELS: Record<Avoid, string> = {
  'tourist-traps': 'Tourist traps',
  crowds: 'Crowds',
  'long-journeys': 'Long journeys',
  'late-nights': 'Late nights',
}

export const PACE_LABELS: Record<Pace, string> = {
  relaxed: 'Relaxed',
  balanced: 'Balanced',
  packed: 'Packed',
}

export const PACE_BLURBS: Record<Pace, string> = {
  relaxed: 'Three stops a day, with room to sit.',
  balanced: 'Four stops a day and a steady rhythm.',
  packed: 'Five stops a day and early starts.',
}

export const MOODS: { id: Mood; label: string }[] = [
  { id: 'relaxed', label: 'Relaxed' },
  { id: 'balanced', label: 'Balanced' },
  { id: 'adventurous', label: 'Adventurous' },
  { id: 'food-first', label: 'Food-first' },
  { id: 'culture-first', label: 'Culture-first' },
]

const MOOD_BOOST: Record<Mood, Interest[]> = {
  relaxed: [],
  balanced: [],
  adventurous: ['nature', 'nightlife', 'beach', 'views'],
  'food-first': ['food', 'cafes'],
  'culture-first': ['architecture', 'galleries', 'history'],
}

export const ROLE_LABEL: Record<Role, string> = {
  coffee: 'Coffee',
  morning: 'Morning',
  lunch: 'Lunch',
  afternoon: 'Afternoon',
  afternoon2: 'Late afternoon',
  sunset: 'Golden hour',
  dinner: 'Dinner',
  evening: 'Evening',
}

const MAJOR = new Set<Role>(['morning', 'afternoon', 'afternoon2', 'sunset', 'evening'])

const PACE_CONFIG: Record<
  Pace,
  { maxMajor: number; buffer: number; travel: string; bufferLabel: string; roles: Role[] }
> = {
  relaxed: {
    maxMajor: 3,
    buffer: 20,
    travel: 'Low',
    bufferLabel: 'High',
    roles: ['coffee', 'morning', 'lunch', 'afternoon', 'sunset', 'dinner'],
  },
  balanced: {
    maxMajor: 4,
    buffer: 10,
    travel: 'Medium',
    bufferLabel: 'Medium',
    roles: ['coffee', 'morning', 'lunch', 'afternoon', 'afternoon2', 'sunset', 'dinner'],
  },
  packed: {
    maxMajor: 5,
    buffer: 5,
    travel: 'High',
    bufferLabel: 'Low',
    roles: ['coffee', 'morning', 'lunch', 'afternoon', 'afternoon2', 'sunset', 'dinner', 'evening'],
  },
}

const START: Record<Role, string> = {
  coffee: '09:30',
  morning: '10:30',
  lunch: '12:45',
  afternoon: '14:30',
  afternoon2: '16:30',
  sunset: '18:00',
  dinner: '19:30',
  evening: '21:30',
}

const START_PACKED: Record<Role, string> = {
  coffee: '08:30',
  morning: '09:30',
  lunch: '12:30',
  afternoon: '13:45',
  afternoon2: '15:45',
  sunset: '17:45',
  dinner: '19:30',
  evening: '21:15',
}

const SECONDARY: Record<Interest, string[]> = {
  architecture: ['History', 'Photography', 'Design'],
  food: ['Markets', 'Neighbourhood eateries'],
  cafes: ['Slow mornings', 'Pastry'],
  galleries: ['Design', 'Photography'],
  history: ['Walking routes'],
  nature: ['Fresh air', 'Views'],
  nightlife: ['Late dinners'],
  beach: ['Sun', 'Seafood'],
  views: ['Photography', 'Golden hour'],
  shopping: ['Markets', 'Local makers'],
}

// ------------------------------------------------------------------ small helpers

export const listJoin = (items: string[]): string => {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

const toMin = (t: string): number => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const toTime = (m: number): string => {
  const h = Math.floor(m / 60) % 24
  return `${String(h).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
}

const roundUp5 = (m: number): number => Math.ceil(m / 5) * 5

const hash = (s: string): number => {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

export const formatDuration = (mins: number): string => {
  if (mins < 60) return `${mins} min`
  if (mins % 60 === 0) return `${mins / 60} ${mins === 60 ? 'hour' : 'hours'}`
  return `about ${(mins / 60).toFixed(1).replace('.0', '')} hours`
}

export const energyLabel = (e: 1 | 2 | 3): string => (e === 1 ? 'Easy' : e === 2 ? 'Moderate' : 'Active')

const paceToMood = (p: Pace): Mood => (p === 'relaxed' ? 'relaxed' : p === 'balanced' ? 'balanced' : 'adventurous')

// ------------------------------------------------------------------ reading a brief

export interface Parsed {
  destination?: DestinationId
  unknownPlace?: string
  days?: number
  pace?: Pace
  interests: Interest[]
  avoid: Avoid[]
}

const NUM_WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7 }

const INTEREST_PATTERNS: [Interest, RegExp][] = [
  ['architecture', /architect|buildings?\b|design|tilework|azulejo/i],
  ['food', /\bfood|\beat(ing)?\b|restaurant|dinner|dining|foodie|cuisine|\bmeals?\b/i],
  ['cafes', /caf[eé]s?\b|coffee|pastr(y|ies)|bakery|bakeries/i],
  ['galleries', /galler|museum|\bart\b/i],
  ['history', /histor|heritage|ancient|old town/i],
  ['nature', /nature|\bhik(e|ing)|\bparks?\b|garden|outdoors?|wildlife/i],
  ['nightlife', /nightlife|night out|\bbars?\b|cocktail|\bclubs?\b|live music|jazz/i],
  ['beach', /beach|swim|seaside|\bcoast/i],
  ['views', /\bviews?\b|viewpoint|sunset|skyline|panoram/i],
  ['shopping', /\bshop|vintage|\bmarkets?\b|boutique/i],
]

const PLACE_RE =
  /(?:[Gg]oing to|[Tt]rip to|[Tt]ravell?ing to|[Vv]isiting|[Hh]eading to|[Oo]ff to|[Ff]lying to|[Ff]ly to)\s+([A-Z][\p{L}'-]+(?:\s[A-Z][\p{L}'-]+)*)/u

export function readBrief(text: string): Parsed {
  const out: Parsed = { interests: [], avoid: [] }
  const t = text.trim()
  if (!t) return out

  out.destination = findDestinationInText(t)
  if (!out.destination) {
    const m = PLACE_RE.exec(t)
    if (m) out.unknownPlace = m[1]
  }

  const dayMatch = /(\d+|one|two|three|four|five|six|seven)[\s-]*(?:days?|nights?)/i.exec(t)
  if (dayMatch) {
    const raw = dayMatch[1].toLowerCase()
    out.days = /^\d+$/.test(raw) ? parseInt(raw, 10) : NUM_WORDS[raw]
  } else if (/long weekend/i.test(t)) out.days = 3
  else if (/weekend/i.test(t)) out.days = 2
  else if (/\b(a|one) week\b/i.test(t)) out.days = 5

  if (/(don'?t|do not|dont|not|no|hate|without|never).{0,50}(rush|packed|busy|hectic|hurry)|relax|slow|easy|chill|laid.?back|unhurried|lazy/i.test(t))
    out.pace = 'relaxed'
  else if (/packed|as much as|see everything|see it all|action.?packed|non.?stop|jam.?packed|make the most/i.test(t))
    out.pace = 'packed'
  else if (/balance|a mix of|mix of/i.test(t)) out.pace = 'balanced'

  const found: { i: Interest; at: number }[] = []
  for (const [i, re] of INTEREST_PATTERNS) {
    const at = t.search(re)
    if (at >= 0) found.push({ i, at })
  }
  out.interests = found.sort((a, b) => a.at - b.at).map((f) => f.i)

  if (/tourist trap|touristy|tourist-heavy|too many tourists|avoid tourists|overrated/i.test(t)) out.avoid.push('tourist-traps')
  if (/crowd|queues?\b/i.test(t)) out.avoid.push('crowds')
  if (/(don'?t|do not|hate|not|no).{0,40}(travel|commut|transfer)|long (journeys|transfers|commutes)|too much travel/i.test(t))
    out.avoid.push('long-journeys')
  if (/early nights?|no late nights|early to bed|not a night owl/i.test(t)) out.avoid.push('late-nights')

  return out
}

/** Short, human-readable chips describing what Scene picked up from free text. */
export function describeParsed(p: Parsed): string[] {
  const chips: string[] = []
  if (p.destination) chips.push(getDestination(p.destination).name)
  if (p.days) chips.push(`${p.days} ${p.days === 1 ? 'day' : 'days'}`)
  if (p.pace) chips.push(`${PACE_LABELS[p.pace]} pace`)
  p.interests.forEach((i) => chips.push(INTEREST_LABELS[i]))
  p.avoid.forEach((a) => chips.push(`Avoid: ${AVOID_LABELS[a].toLowerCase()}`))
  return chips
}

// ------------------------------------------------------------------ scoring

const makeCtx = (brief: Brief, mood: Mood, pace: Pace): Ctx => ({
  interests: brief.interests,
  boost: MOOD_BOOST[mood],
  pace,
  moodLabel: MOODS.find((m) => m.id === mood)?.label ?? 'Balanced',
  avoidTouristy: brief.avoid.includes('tourist-traps') || brief.avoid.includes('crowds'),
  avoidLong: brief.avoid.includes('long-journeys'),
  noLate: brief.avoid.includes('late-nights'),
})

function scoreActivity(a: Activity, ctx: Ctx): number {
  let s = 0
  ctx.interests.forEach((it, idx) => {
    if (a.tags.includes(it)) s += idx < 2 ? 4 : 3
  })
  ctx.boost.forEach((b) => {
    if (a.tags.includes(b) && !ctx.interests.includes(b)) s += 2
    else if (a.tags.includes(b)) s += 1
  })
  s += ctx.avoidTouristy ? -a.tourist * 2.5 : a.tourist * 0.4
  if (ctx.pace === 'relaxed') s -= (a.energy - 1) * 1.2
  if (ctx.pace === 'packed') s += (a.energy - 1) * 0.5
  return s
}

const rolesFor = (pace: Pace, noLate: boolean): Role[] =>
  PACE_CONFIG[pace].roles.filter((r) => !(noLate && r === 'evening'))

function pickDay(zone: Zone, dest: Destination, ctx: Ctx, roles: Role[]): Pick[] {
  const picks: Pick[] = []
  const usedTags = new Set<Interest>()

  for (const role of roles) {
    const cands = dest.activities.filter((a) => a.zone === zone.id && a.role === role)
    if (!cands.length) continue

    const rank = (a: Activity) => {
      let score = scoreActivity(a, ctx)

      // Avoid building a day where every stop satisfies the same interest.
      // Repeated tags are still useful, but a new relevant tag gets a small
      // diversity bonus so the itinerary feels like a trip, not a keyword list.
      const newTags = a.tags.filter((tag) => !usedTags.has(tag))
      score += Math.min(newTags.length, 2) * 0.75

      // Keep the main meal tied to food when food is a stated priority.
      if (role === 'lunch' || role === 'dinner') {
        if (ctx.interests.includes('food') && a.tags.includes('food')) score += 1.5
      }

      // Prefer an explicit interest over a mood-only match when both are available.
      if (ctx.interests.some((interest) => a.tags.includes(interest))) score += 0.5

      return score
    }

    const best = [...cands].sort((a, b) => rank(b) - rank(a))[0]
    picks.push({ activity: best, role, cross: false })
    best.tags.forEach((tag) => usedTags.add(tag))
  }

  return picks
}

function zoneScore(zone: Zone, dest: Destination, ctx: Ctx, roles: Role[]): number {
  let total = 0
  for (const role of roles) {
    const cands = dest.activities.filter((a) => a.zone === zone.id && a.role === role)
    if (cands.length) total += Math.max(...cands.map((a) => scoreActivity(a, ctx)))
  }
  if (zone.iconic) total += 3
  if (zone.optional && zone.optional.some((o) => ctx.interests.includes(o))) total += 8
  return total
}

function chooseZones(dest: Destination, ctx: Ctx, roles: Role[], n: number): Zone[] {
  const scored = dest.zones.map((zone, i) => ({
    zone,
    i,
    score: zoneScore(zone, dest, ctx, roles),
    eligible: !zone.optional || zone.optional.some((o) => ctx.interests.includes(o) || ctx.boost.includes(o)),
  }))
  const byScore = (a: { score: number }, b: { score: number }) => b.score - a.score
  const primary = scored.filter((s) => s.eligible).sort(byScore)
  const filler = scored.filter((s) => !s.eligible).sort(byScore)
  return [...primary, ...filler]
    .slice(0, n)
    .sort((a, b) => a.i - b.i)
    .map((s) => s.zone)
}

// ------------------------------------------------------------------ explaining

const ROLE_WHY: Record<Role, (pace: Pace, a: Activity) => string> = {
  coffee: (p) =>
    p === 'packed' ? 'A quick coffee so the day starts moving.' : 'A slow start, so the day does not open with a commute.',
  morning: (_p, a) =>
    a.indoor
      ? 'A morning block indoors, before the crowds arrive.'
      : 'Best done early, while the light is soft and the streets are quiet.',
  lunch: (p) =>
    p === 'packed'
      ? 'Lunch is kept close to the morning stop, so no time is lost crossing town.'
      : 'A proper midday break, so the afternoon does not feel rushed.',
  afternoon: (_p, a) =>
    a.indoor ? 'A slower indoor block after the morning route.' : 'A short hop from lunch, so you are not crossing the city.',
  afternoon2: () => 'An extra stop for a fuller day. Easy to skip if the day runs long.',
  sunset: () => 'Timed for the last hour of light, when the view is at its best.',
  dinner: () => 'The main meal of the day, close to the last stop so there is no long ride home.',
  evening: () => 'A late optional stop. Skip it and nothing else changes.',
}

function whyFor(p: Pick, ctx: Ctx): string {
  const a = p.activity
  const parts: string[] = []
  const user = ctx.interests.filter((i) => a.tags.includes(i))
  const mood = ctx.boost.filter((i) => a.tags.includes(i) && !user.includes(i))
  if (user.length) {
    const names = listJoin(user.map((i) => INTEREST_LABELS[i].toLowerCase()))
    parts.push(`You said ${names} ${user.length > 1 ? 'matter' : 'matters'}.`)
  } else if (mood.length) {
    parts.push(`This suits the ${ctx.moodLabel.toLowerCase()} mood.`)
  }
  parts.push(ROLE_WHY[p.role](ctx.pace, a))
  if (ctx.avoidTouristy) {
    parts.push(a.tourist <= 1 ? 'It is a local choice rather than a tourist stop.' : 'It is popular, so treat it as the one busy stop of the day.')
  }
  if (p.tag === 'Rain swap') parts.push('Swapped in for the rain: indoors, and still close to the rest of the day.')
  return parts.join(' ')
}

// ------------------------------------------------------------------ scheduling

function schedule(day: Day, ctx: Ctx): ScheduledItem[] {
  const starts = ctx.pace === 'packed' ? START_PACKED : START
  const items: ScheduledItem[] = []
  let prev: Pick | null = null
  let prevEnd = 0
  for (const p of day.picks) {
    let pref = toMin(starts[p.role])
    if (p.role === 'coffee' || p.role === 'morning') pref += day.shift
    if (p.role === 'dinner' && day.dinnerAt) pref = toMin(day.dinnerAt)
    let travelMin = 0
    let start = pref
    if (prev) {
      travelMin = p.cross || prev.cross ? 25 : 6 + (hash(prev.activity.id + p.activity.id) % 9)
      start = Math.max(pref, prevEnd + travelMin + day.buffer)
    }
    start = roundUp5(start)
    const end = start + p.activity.minutes
    items.push({
      activity: p.activity,
      role: p.role,
      start: toTime(start),
      end: toTime(end),
      travelMin,
      travelFrom: prev ? prev.activity.name : null,
      why: whyFor(p, ctx),
      tag: p.tag,
    })
    prev = p
    prevEnd = end
  }
  return items
}

const withItems = (day: Day, ctx: Ctx): Day => ({ ...day, items: schedule(day, ctx) })

// Drop the optional late-afternoon stop when it would push dinner past 20:00.
function trimLate(day: Day, ctx: Ctx): Day {
  let d = withItems({ ...day, basePicks: day.picks }, ctx)
  const late = (x: Day) => {
    const dinner = x.items.find((i) => i.role === 'dinner')
    return dinner ? toMin(dinner.start) > 20 * 60 : false
  }
  while (late(d)) {
    const idx = d.picks.findIndex((p) => p.role === 'afternoon2')
    if (idx < 0) break
    const picks = d.picks.filter((_, i) => i !== idx)
    d = withItems({ ...d, picks, basePicks: picks }, ctx)
  }
  return d
}

// ------------------------------------------------------------------ interpretation

export function interpret(brief: Brief, ctx: Ctx): Interpretation {
  const cfg = PACE_CONFIG[ctx.pace]
  const priorities = brief.interests.map((i, idx) => ({
    label: INTEREST_LABELS[i],
    level: idx < 2 ? 'Very high' : 'High',
  }))
  ctx.boost
    .filter((b) => !brief.interests.includes(b))
    .forEach((b) => priorities.push({ label: INTEREST_LABELS[b], level: 'Raised by mood' }))

  const primary = new Set(priorities.map((p) => p.label))
  const secondary: string[] = []
  for (const i of [...brief.interests, ...ctx.boost]) {
    for (const s of SECONDARY[i]) if (!primary.has(s) && !secondary.includes(s)) secondary.push(s)
  }

  const avoid: string[] = []
  if (brief.avoid.includes('tourist-traps')) avoid.push('Tourist-heavy places')
  if (brief.avoid.includes('crowds')) avoid.push('Peak-hour crowds')
  if (brief.avoid.includes('long-journeys')) avoid.push('Long cross-city journeys')
  if (brief.avoid.includes('late-nights')) avoid.push('Late nights')

  return {
    pace: PACE_LABELS[ctx.pace],
    maxMajor: cfg.maxMajor,
    travel: ctx.avoidLong ? 'Very low' : cfg.travel,
    buffer: cfg.bufferLabel,
    priorities,
    secondary: secondary.slice(0, 5),
    avoid,
  }
}

// ------------------------------------------------------------------ building

export function buildScene(brief: Brief, mood?: Mood, prevPace?: Pace): Scene {
  const destination = getDestination(brief.destination)
  const m = mood ?? paceToMood(brief.pace)
  const pace: Pace =
    m === 'relaxed' ? 'relaxed' : m === 'balanced' ? 'balanced' : m === 'adventurous' ? 'packed' : (prevPace ?? brief.pace)
  const ctx = makeCtx(brief, m, pace)
  const roles = rolesFor(pace, ctx.noLate)
  const n = Math.max(1, Math.min(brief.days, destination.zones.length))
  const zones = chooseZones(destination, ctx, roles, n)
  const cfg = PACE_CONFIG[pace]

  const days: Day[] = zones.map((zone, index) =>
    trimLate({ index, zone, basePicks: [], picks: pickDay(zone, destination, ctx, roles), items: [], buffer: cfg.buffer, shift: 0 }, ctx),
  )

  return { brief, destination, mood: m, pace, ctx, days, interpretation: interpret(brief, ctx) }
}

// ------------------------------------------------------------------ adjusting a day

const usedIds = (scene: Scene): Set<string> => {
  const ids = new Set<string>()
  scene.days.forEach((d) => d.picks.forEach((p) => ids.add(p.activity.id)))
  return ids
}

const replaceDay = (scene: Scene, day: Day): Scene => ({
  ...scene,
  days: scene.days.map((d) => (d.index === day.index ? withItems(day, scene.ctx) : d)),
})

export function resetDay(scene: Scene, dayIndex: number): Scene {
  const day = scene.days[dayIndex]
  if (!day) return scene
  return replaceDay(scene, {
    ...day,
    picks: day.basePicks,
    buffer: PACE_CONFIG[scene.pace].buffer,
    shift: 0,
    dinnerAt: undefined,
    notice: undefined,
  })
}

export function adjustDay(scene: Scene, dayIndex: number, kind: Adjust): Scene {
  const day = scene.days[dayIndex]
  if (!day) return scene
  const { ctx, destination } = scene

  if (kind === 'slower') {
    const majors = day.picks.filter((p) => MAJOR.has(p.role))
    let picks = day.picks
    let notice: string
    if (majors.length > 2) {
      const removable = majors.filter((p) => p.role !== 'morning')
      const drop = [...removable].sort((a, b) => scoreActivity(a.activity, ctx) - scoreActivity(b.activity, ctx))[0]
      picks = day.picks.filter((p) => p !== drop)
      notice = `Removed ${drop.activity.name}, added breathing room between stops and moved the start 30 minutes later.`
    } else {
      notice = 'This day already has only two main stops, so Scene added more time between them and a later start.'
    }
    return replaceDay(scene, {
      ...day,
      picks,
      buffer: Math.min(day.buffer + 15, 60),
      shift: Math.min(day.shift + 30, 60),
      notice,
    })
  }

  if (kind === 'rain') {
    const used = usedIds(scene)
    const allowCross = !ctx.avoidLong || !!day.zone.optional
    const changes: string[] = []
    const picks: Pick[] = []
    for (const p of day.picks) {
      if (!MAJOR.has(p.role) || p.activity.indoor) {
        picks.push(p)
        continue
      }
      const sameZone = destination.activities.filter(
        (a) => a.zone === day.zone.id && a.indoor && !used.has(a.id) && (MAJOR.has(a.role) || a.role === 'sunset'),
      )
      const rank = (a: Activity) => scoreActivity(a, ctx) + (a.role === p.role ? 3 : 0)
      let choice = [...sameZone].sort((a, b) => rank(b) - rank(a))[0]
      let cross = false
      if (!choice && allowCross && p.role !== 'sunset') {
        const elsewhere = destination.activities.filter((a) => {
          const z = destination.zones.find((zz) => zz.id === a.zone)
          return a.zone !== day.zone.id && !z?.optional && a.indoor && !used.has(a.id) && MAJOR.has(a.role)
        })
        choice = [...elsewhere].sort((a, b) => rank(b) - rank(a))[0]
        cross = !!choice
      }
      if (choice) {
        used.add(choice.id)
        picks.push({ activity: choice, role: p.role, cross, tag: 'Rain swap' })
        changes.push(`${p.activity.name} for ${choice.name}`)
      } else {
        changes.push(`dropped ${p.activity.name}`)
      }
    }
    const notice = changes.length
      ? `Rain plan: swapped ${changes.filter((c) => !c.startsWith('dropped')).join(', ') || 'nothing'}${
          changes.some((c) => c.startsWith('dropped')) ? `; ${changes.filter((c) => c.startsWith('dropped')).join(', ')}` : ''
        }.`
      : 'Nothing in this day depends on the weather, so it stays as it is.'
    return replaceDay(scene, { ...day, picks, notice })
  }

  // tired: an easier evening
  const removed: string[] = []
  const picks = day.picks.filter((p) => {
    if (p.role === 'evening' || p.role === 'afternoon2' || p.role === 'sunset') {
      removed.push(p.activity.name)
      return false
    }
    return true
  })
  const notice = removed.length
    ? `Dropped ${listJoin(removed)}. Dinner moves to 19:00 and nothing follows it.`
    : 'This day is already as easy as it gets. Dinner moves to 19:00 and nothing follows it.'
  return replaceDay(scene, { ...day, picks, dinnerAt: '19:00', notice })
}

export { DESTINATIONS }

export const travelText = (item: ScheduledItem): string => {
  if (!item.travelFrom) return 'Start of the day'
  const how = item.travelMin > 15 ? 'by taxi or transit' : 'on foot'
  return `${item.travelMin} min ${how} from ${item.travelFrom}`
}

export const isMajorRole = (r: Role): boolean => MAJOR.has(r)
