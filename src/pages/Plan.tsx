import { Minus, Plus } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import PreferencePills from '../components/PreferencePills'
import SceneResult from '../components/SceneResult'
import TripCard from '../components/TripCard'
import { DESTINATIONS, getDestination } from '../data/destinations'
import {
  AVOID_LABELS,
  INTEREST_LABELS,
  INTEREST_ORDER,
  PACE_BLURBS,
  PACE_LABELS,
  buildScene,
  describeParsed,
  readBrief,
} from '../engine/sceneEngine'
import type { Avoid, Brief, DestinationId, Interest, Pace, Scene } from '../types'

const STEPS = ['Destination', 'Your style', 'Your scene']
const PLACEHOLDER =
  'I\u2019m going to Lisbon for four days with my girlfriend. We like architecture, food and cafés. We want to see the important stuff but don\u2019t want to rush. One beach day would be nice.'

const unique = <T,>(a: T[]): T[] => [...new Set(a)]
const toggle = <T,>(list: T[], v: T): T[] => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

export default function Plan() {
  const location = useLocation()
  const prefill = (location.state as { brief?: Brief } | null)?.brief

  const [step, setStep] = useState(0)
  const [text, setText] = useState('')
  const [destId, setDestId] = useState<DestinationId>(prefill?.destination ?? 'lisbon')
  const [days, setDays] = useState(prefill?.days ?? 4)
  const [interests, setInterests] = useState<Interest[]>(prefill?.interests ?? [])
  const [pace, setPace] = useState<Pace>(prefill?.pace ?? 'relaxed')
  const [avoid, setAvoid] = useState<Avoid[]>(prefill?.avoid ?? [])
  const [scene, setScene] = useState<Scene | null>(null)
  const [building, setBuilding] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const parsed = useMemo(() => readBrief(text), [text])
  const chips = describeParsed(parsed)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step])
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const dest = getDestination(destId)
  const maxDays = dest.zones.length

  // Words in the box set the controls below; the controls can still be changed afterwards.
  useEffect(() => {
    if (parsed.destination) {
      setDestId(parsed.destination)
      setDays((d) => Math.min(d, getDestination(parsed.destination!).zones.length))
    }
  }, [parsed.destination])
  useEffect(() => {
    if (parsed.days) setDays(Math.min(parsed.days, getDestination(parsed.destination ?? destId).zones.length))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.days])
  useEffect(() => {
    if (parsed.pace) setPace(parsed.pace)
  }, [parsed.pace])

  const merged = (): Brief => ({
    destination: destId,
    days: Math.max(1, Math.min(days, maxDays)),
    interests: unique([...parsed.interests, ...interests]),
    pace,
    avoid: unique([...parsed.avoid, ...avoid]),
  })

  const applyText = (): Brief => {
    const b = merged()
    setDestId(b.destination)
    setDays(b.days)
    setInterests(b.interests)
    setPace(b.pace)
    setAvoid(b.avoid)
    return b
  }

  const build = (b: Brief) => {
    setBuilding(true)
    timer.current = window.setTimeout(() => {
      setScene(buildScene(b))
      setStep(2)
      setBuilding(false)
    }, 1100)
  }

  const pickDestination = (id: DestinationId) => {
    setDestId(id)
    setDays((d) => Math.min(d, getDestination(id).zones.length))
  }

  const canBuild = merged().interests.length > 0

  if (building) {
    return (
      <section className="grid min-h-[70vh] place-items-center bg-navy px-5 text-sand" aria-live="polite">
        <div>
          <p className="font-display text-4xl sm:text-5xl">Building your scene</p>
          <ul className="mt-6 space-y-2 text-lg text-sand/80">
            {['Reading your brief', 'Setting the pace', 'Sequencing the days'].map((t, i) => (
              <li key={t} className="flex items-center gap-3">
                <span className="size-2.5 animate-pulse rounded-full bg-sun" style={{ animationDelay: `${i * 250}ms` }} aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <div>
      <div className="border-b border-navy/15">
        <ol className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-4 sm:gap-6 sm:px-8" aria-label="Progress">
          {STEPS.map((label, i) => {
            const reachable = i <= step && (i < 2 || scene)
            return (
              <li key={label} className="shrink-0">
                <button
                  type="button"
                  disabled={!reachable}
                  aria-current={i === step ? 'step' : undefined}
                  onClick={() => reachable && setStep(i)}
                  className={`flex items-center gap-2.5 border-b-2 py-1 font-medium ${
                    i === step ? 'border-sun' : 'border-transparent'
                  } ${reachable ? '' : 'text-navy/40'}`}
                >
                  <span className="tnum font-bold">{String(i + 1).padStart(2, '0')}</span>
                  {label}
                </button>
              </li>
            )
          })}
        </ol>
      </div>

      {step === 0 && (
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <h1 className="font-display text-5xl leading-none sm:text-6xl">Tell Scene about your trip.</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy/75">
            Write it the way you would tell a friend: where, how long, what you like, and what you would rather skip.
          </p>

          <label htmlFor="brief" className="sr-only">Your trip</label>
          <textarea
            id="brief"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder={PLACEHOLDER}
            className="mt-8 w-full resize-y border-2 border-navy bg-linen p-5 text-lg leading-relaxed placeholder:text-navy/45 focus:outline-none focus-visible:border-sun"
          />

          <div className="mt-4 min-h-14" aria-live="polite">
            {parsed.unknownPlace && (
              <p className="mb-3 border-l-4 border-sun bg-sun/20 px-4 py-2.5">
                Scene only has sample data for Lisbon, Tokyo, New York and Cape Town, so {parsed.unknownPlace} is not available yet.
                Pick one of the four below.
              </p>
            )}
            {chips.length > 0 ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-bold">Scene picked up</span>
                {chips.map((c) => (
                  <span key={c} className="rounded-full bg-mist px-3 py-1 text-sm font-medium">{c}</span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy/60">Scene reads your words as you type and turns them into planning constraints.</p>
            )}
          </div>

          <div className="mt-10 border-t-2 border-navy pt-8">
            <h2 className="font-display text-3xl">Or set it yourself</h2>
            <div role="group" aria-label="Destination" className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
              {DESTINATIONS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  aria-pressed={destId === d.id}
                  onClick={() => pickDestination(d.id)}
                  className="text-left"
                >
                  <TripCard destination={d} meta={d.country} selected={destId === d.id} compact />
                </button>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <span className="font-bold" id="days-label">How long?</span>
              <div className="inline-flex items-center border-2 border-navy" role="group" aria-labelledby="days-label">
                <button
                  type="button"
                  aria-label="One day fewer"
                  onClick={() => setDays((d) => Math.max(1, d - 1))}
                  className="grid size-11 place-items-center hover:bg-navy hover:text-sand"
                >
                  <Minus size={18} />
                </button>
                <span className="tnum min-w-24 text-center font-bold" aria-live="polite">
                  {days} {days === 1 ? 'day' : 'days'}
                </span>
                <button
                  type="button"
                  aria-label="One day more"
                  onClick={() => setDays((d) => Math.min(maxDays, d + 1))}
                  className="grid size-11 place-items-center hover:bg-navy hover:text-sand"
                >
                  <Plus size={18} />
                </button>
              </div>
              <span className="text-sm text-navy/65">Up to {maxDays} days for {dest.name} in this demo.</span>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => {
                applyText()
                setStep(1)
              }}
              className="rounded-full bg-navy px-7 py-3.5 font-medium text-sand transition-colors hover:bg-navy-soft"
            >
              Continue
            </button>
            {canBuild && (
              <button
                type="button"
                onClick={() => build(applyText())}
                className="rounded-full border-2 border-navy px-7 py-3 font-medium transition-colors hover:bg-navy hover:text-sand"
              >
                Build my scene now
              </button>
            )}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <h1 className="font-display text-5xl leading-none sm:text-6xl">What is this trip for?</h1>
          <p className="mt-4 max-w-2xl text-lg text-navy/75">
            {dest.name}, {days} {days === 1 ? 'day' : 'days'}. Choose what you care about and how it should feel.
          </p>

          <div className="mt-10">
            <h2 className="font-display text-2xl">What do you care about?</h2>
            <p className="mt-1 text-navy/70">The first two you pick count the most.</p>
            <div className="mt-4">
              <PreferencePills
                label="Interests"
                showRank
                options={INTEREST_ORDER.map((i) => ({ value: i, label: INTEREST_LABELS[i] }))}
                selected={interests}
                onToggle={(v) => setInterests((l) => toggle(l, v))}
              />
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl">How do you want it to feel?</h2>
            <div role="group" aria-label="Pace" className="mt-4 grid gap-3 sm:grid-cols-3">
              {(['relaxed', 'balanced', 'packed'] as Pace[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  aria-pressed={pace === p}
                  onClick={() => setPace(p)}
                  className={`border-2 p-5 text-left transition-colors ${
                    pace === p ? 'border-navy bg-navy text-sand' : 'border-navy/30 bg-linen hover:border-navy'
                  }`}
                >
                  <span className="block font-display text-2xl">{PACE_LABELS[p]}</span>
                  <span className={`mt-1 block text-sm ${pace === p ? 'text-sand/80' : 'text-navy/70'}`}>{PACE_BLURBS[p]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-display text-2xl">What should Scene avoid?</h2>
            <div className="mt-4">
              <PreferencePills
                label="Things to avoid"
                options={(Object.keys(AVOID_LABELS) as Avoid[]).map((a) => ({ value: a, label: AVOID_LABELS[a] }))}
                selected={avoid}
                onToggle={(v) => setAvoid((l) => toggle(l, v))}
              />
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="rounded-full border-2 border-navy px-7 py-3 font-medium transition-colors hover:bg-navy hover:text-sand"
            >
              Back
            </button>
            <button
              type="button"
              disabled={interests.length === 0}
              onClick={() =>
                build({ destination: destId, days: Math.min(days, maxDays), interests, pace, avoid })
              }
              className="rounded-full bg-sun px-8 py-3.5 font-bold text-navy transition-colors hover:bg-[#eaa060] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Build my scene
            </button>
            {interests.length === 0 && <span className="text-sm text-navy/65">Pick at least one thing you care about.</span>}
          </div>
        </section>
      )}

      {step === 2 && scene && (
        <SceneResult scene={scene} onChange={setScene} action={{ label: 'Edit my brief', onClick: () => setStep(0) }} />
      )}
    </div>
  )
}
