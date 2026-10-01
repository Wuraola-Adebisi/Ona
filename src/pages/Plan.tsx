import { Minus, Plus, Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SceneResult from '../components/SceneResult'
import { getDestination } from '../data/destinations'
import { createDestinationOption, searchDestinations } from '../data/destinationCatalog'
import {
  AVOID_LABELS,
  INTEREST_LABELS,
  INTEREST_ORDER,
  PACE_LABELS,
  buildScene,
  readBrief,
} from '../engine/sceneEngine'
import type { Avoid, Brief, DestinationId, Interest, Pace, Scene } from '../types'

const PLACEHOLDER =
  'For example: 4 days in Lisbon. I love good food, architecture and cafés. I want to see the important places without rushing.'

const unique = <T,>(items: T[]) => [...new Set(items)]

const toggle = <T,>(list: T[], value: T) =>
  list.includes(value) ? list.filter((item) => item !== value) : [...list, value]

export default function Plan() {
  const location = useLocation()
  const prefill = (location.state as { brief?: Brief } | null)?.brief

  const [text, setText] = useState('')
  const [destId, setDestId] = useState<DestinationId | null>(prefill?.destination ?? null)
  const [destinationQuery, setDestinationQuery] = useState('')
  const [days, setDays] = useState(prefill?.days ?? 4)
  const [interests, setInterests] = useState<Interest[]>(prefill?.interests ?? [])
  const [pace, setPace] = useState<Pace>(prefill?.pace ?? 'balanced')
  const [avoid, setAvoid] = useState<Avoid[]>(prefill?.avoid ?? [])
  const [showMore, setShowMore] = useState(false)
  const [scene, setScene] = useState<Scene | null>(null)
  const [building, setBuilding] = useState(false)

  const timer = useRef<number | undefined>(undefined)
  const parsed = useMemo(() => readBrief(text), [text])

  const destination = destId ? getDestination(destId) : null
  const maxDays = destination?.zones.length ?? 7

  const destinationResults = useMemo(
    () => searchDestinations(destinationQuery).slice(0, 6),
    [destinationQuery],
  )

  const typedDestination = useMemo(
    () => createDestinationOption(destinationQuery),
    [destinationQuery],
  )

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (parsed.destination) {
      setDestId(parsed.destination)
      setDays((current) =>
        Math.min(current, getDestination(parsed.destination!).zones.length),
      )
    } else if (parsed.unknownPlace) {
      const option = createDestinationOption(parsed.unknownPlace)
      if (option) {
        setDestId(option.id)
        setDays((current) => Math.min(current, getDestination(option.id).zones.length))
      }
    }
    if (parsed.days) {
      const selected = parsed.destination ?? destId
      if (selected) {
        setDays(Math.min(parsed.days, getDestination(selected).zones.length))
      } else {
        setDays(Math.min(parsed.days, 7))
      }
    }
    if (parsed.pace) setPace(parsed.pace)
  }, [parsed.destination, parsed.days, parsed.pace, destId])

  const selectDestination = (id: DestinationId) => {
    const next = getDestination(id)
    setDestId(id)
    setDays((current) => Math.min(current, next.zones.length))
    setDestinationQuery('')
  }

  const merged = (): Brief => ({
    destination: destId!,
    days: Math.max(1, Math.min(days, maxDays)),
    interests: unique([...parsed.interests, ...interests]),
    pace,
    avoid: unique([...parsed.avoid, ...avoid]),
  })

  const canBuild = Boolean(destId)

  const build = () => {
    const brief = merged()
    setBuilding(true)
    timer.current = window.setTimeout(() => {
      setScene(buildScene(brief))
      setBuilding(false)
    }, 650)
  }

  if (scene) {
    return (
      <SceneResult
        scene={scene}
        onChange={setScene}
        action={{ label: 'Change my trip', onClick: () => setScene(null) }}
      />
    )
  }

  if (building) {
    return (
      <section className="grid min-h-[75vh] place-items-center bg-navy px-5 text-sand">
        <div className="w-full max-w-xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-sun">
            Putting your itinerary together
          </p>
          <h1 className="mt-5 font-display text-5xl leading-none sm:text-7xl">
            Finding a good rhythm for your days.
          </h1>
          <div className="mt-9 space-y-3 text-lg text-sand/70">
            {['Reading what you want from the trip', 'Choosing places that fit', 'Putting each day in a sensible order'].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="size-2 animate-pulse rounded-full bg-sun" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <div>
      <section className="mx-auto max-w-3xl px-5 pb-16 pt-14 sm:px-8 sm:pb-24 sm:pt-20">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-sun-deep">
          Plan your trip
        </p>
        <h1 className="mt-4 font-display text-5xl leading-[0.9] sm:text-7xl">
          Where are you going?
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy/70">
          Start with the basics. Tell Ona where you are going, how long you
          have and what you want the trip to feel like. You can keep it simple.
        </p>

        <div className="mt-12 space-y-12">
          <div>
            <label htmlFor="destination" className="text-sm font-bold">
              Destination
            </label>
            <div className="relative mt-3">
              <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-navy/45" />
              <input
                id="destination"
                value={destinationQuery || destination?.name || ''}
                onChange={(event) => {
                  setDestinationQuery(event.target.value)
                  setDestId(null)
                }}
                placeholder="Search for a city"
                className="w-full border-2 border-navy bg-linen px-11 py-4 text-lg outline-none placeholder:text-navy/40 focus:border-sun"
              />
            </div>

            {(destinationQuery || !destination) && (destinationResults.length > 0 || typedDestination) && (
              <div className="mt-2 border-2 border-navy bg-linen">
                {destinationResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectDestination(item.id)}
                    className="flex w-full items-center justify-between border-b border-navy/10 px-4 py-3 text-left last:border-b-0 hover:bg-sand-deep"
                  >
                    <span>
                      <span className="block font-medium">{item.name}</span>
                      <span className="text-sm text-navy/50">{item.country}</span>
                    </span>
                    <span className="text-sm text-navy/45">Choose</span>
                  </button>
                ))}
                {typedDestination && (
                  <button
                    type="button"
                    onClick={() => selectDestination(typedDestination.id)}
                    className="w-full border-t border-navy/15 bg-sand px-4 py-3 text-left hover:bg-sand-deep"
                  >
                    <span className="block font-medium">Plan a trip to {typedDestination.name}</span>
                    <span className="mt-1 block text-sm text-navy/55">Start with a simple plan and refine the places later.</span>
                  </button>
                )}
              </div>
            )}

            {parsed.unknownPlace && !destId && (
              <p className="mt-3 border-l-4 border-sun bg-sun/15 px-4 py-3 text-sm">
                We can start with {parsed.unknownPlace}. The plan will start with broad city ideas until Ona has richer local place data.
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-bold">How long are you going?</label>
            <div className="mt-3 inline-flex items-center border-2 border-navy">
              <button
                type="button"
                aria-label="One day fewer"
                disabled={days <= 1}
                onClick={() => setDays((current) => Math.max(1, current - 1))}
                className="grid size-12 place-items-center hover:bg-navy hover:text-sand disabled:opacity-30"
              >
                <Minus size={18} />
              </button>
              <span className="tnum min-w-28 text-center font-bold">
                {days} {days === 1 ? 'day' : 'days'}
              </span>
              <button
                type="button"
                aria-label="One day more"
                disabled={days >= maxDays}
                onClick={() => setDays((current) => Math.min(maxDays, current + 1))}
                className="grid size-12 place-items-center hover:bg-navy hover:text-sand disabled:opacity-30"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="trip-brief" className="text-sm font-bold">
              What do you want from the trip?
            </label>
            <p className="mt-1 text-sm text-navy/55">
              A sentence is enough. You can mention food, culture, beaches,
              nightlife, quiet mornings, things you want to avoid, or anything else.
            </p>
            <textarea
              id="trip-brief"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={5}
              placeholder={PLACEHOLDER}
              className="mt-3 w-full resize-y border-2 border-navy bg-linen p-5 text-lg leading-relaxed placeholder:text-navy/40 focus:border-sun focus:outline-none"
            />
            {parsed.interests.length > 0 && (
              <p className="mt-3 text-sm text-navy/60">
                Picking up: {parsed.interests.map((interest) => INTEREST_LABELS[interest]).join(', ')}
              </p>
            )}
          </div>

          <div className="border-t border-navy/15 pt-7">
            <button
              type="button"
              onClick={() => setShowMore((current) => !current)}
              className="text-sm font-bold underline decoration-sun decoration-2 underline-offset-4"
              aria-expanded={showMore}
            >
              {showMore ? 'Hide extra preferences' : 'Add extra preferences'}
            </button>

            {showMore && (
              <div className="mt-8 grid gap-10 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-bold">How should the days feel?</p>
                  <div className="mt-3 space-y-2">
                    {(['relaxed', 'balanced', 'packed'] as Pace[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={pace === option}
                        onClick={() => setPace(option)}
                        className={`block w-full border-2 p-3 text-left ${
                          pace === option ? 'border-navy bg-navy text-sand' : 'border-navy/20 bg-linen'
                        }`}
                      >
                        <span className="font-medium">{PACE_LABELS[option]}</span>
                        <span className={`mt-0.5 block text-sm ${
                          pace === option ? 'text-sand/70' : 'text-navy/55'
                        }`}>
                          {option === 'relaxed' ? 'Fewer stops, more time.' : option === 'balanced' ? 'A steady mix of seeing and resting.' : 'More stops and earlier starts.'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-bold">Anything you would rather avoid?</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Object.keys(AVOID_LABELS) as Avoid[]).map((item) => (
                      <button
                        key={item}
                        type="button"
                        aria-pressed={avoid.includes(item)}
                        onClick={() => setAvoid((current) => toggle(current, item))}
                        className={`rounded-full border px-3.5 py-2 text-sm ${
                          avoid.includes(item) ? 'border-navy bg-navy text-sand' : 'border-navy/20 bg-linen'
                        }`}
                      >
                        {AVOID_LABELS[item]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-navy/15 pt-8">
            <button
              type="button"
              disabled={!canBuild}
              onClick={build}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-7 py-4 font-bold text-sand transition-colors hover:bg-navy-soft disabled:cursor-not-allowed disabled:opacity-35 sm:w-auto"
            >
              Create my itinerary
            </button>
            {!canBuild && (
              <p className="mt-3 text-sm text-navy/55">Choose a destination to continue.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
