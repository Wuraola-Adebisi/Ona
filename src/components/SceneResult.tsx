import { ArrowLeft, CloudRain, Moon, Wind } from 'lucide-react'
import { useState } from 'react'
import { INTEREST_LABELS, MOODS, adjustDay, buildScene, resetDay } from '../engine/sceneEngine'
import type { Adjust, Mood, Scene, ScheduledItem } from '../types'
import ActivityPanel from './ActivityPanel'
import DestinationArt from './DestinationArt'
import RouteDiagram from './RouteDiagram'
import SceneTimeline from './SceneTimeline'

interface Props {
  scene: Scene
  onChange: (scene: Scene) => void
  action?: { label: string; onClick: () => void }
}

const two = (number: number) => String(number).padStart(2, '0')

const ADJUSTMENTS: {
  kind: Adjust
  label: string
  body: string
  Icon: typeof Wind
}[] = [
  { kind: 'slower', label: 'Make this day easier', body: 'Fewer stops and more time between them.', Icon: Wind },
  { kind: 'rain', label: 'If it rains', body: 'Swap outdoor stops for nearby indoor ones.', Icon: CloudRain },
  { kind: 'tired', label: 'A quieter evening', body: 'Finish earlier and leave the night open.', Icon: Moon },
]

export default function SceneResult({ scene, onChange, action }: Props) {
  const [idx, setDayIdx] = useState(0)
  const [open, setOpen] = useState<ScheduledItem | null>(null)
  const [showMood, setShowMood] = useState(false)

  const day = scene.days[idx]

  const changeMood = (mood: Mood) => {
    onChange(buildScene(scene.brief, mood, scene.pace))
    setDayIdx(0)
    setOpen(null)
  }

  const adjust = (kind: Adjust) => onChange(adjustDay(scene, idx, kind))
  const close = () => setOpen(null)

  const priorities = scene.brief.interests
    .slice(0, 3)
    .map((interest) => INTEREST_LABELS[interest])
    .join(', ')

  return (
    <div>
      <header className="bg-navy text-sand">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 md:grid-cols-[1fr_20rem] md:items-end">
          <div>
            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="mb-9 inline-flex items-center gap-2 text-sm font-bold text-sand/65 hover:text-sand"
              >
                <ArrowLeft size={16} />
                {action.label}
              </button>
            )}

            <p className="text-sm font-bold uppercase tracking-[0.16em] text-sun">
              Your itinerary
            </p>
            <h1 className="mt-3 font-display text-[clamp(3.5rem,10vw,7rem)] leading-[0.82]">
              {scene.destination.name}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-sand/70">
              {scene.days.length} days · {scene.interpretation.pace.toLowerCase()} pace
              {priorities ? ' · built around ' + priorities.toLowerCase() : ''}
            </p>
          </div>

          <DestinationArt
            destination={scene.destination}
            className="hidden aspect-square w-full rounded-t-[7rem] md:block"
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section>
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Your days
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl">
              Here is the plan.
            </h2>
            <p className="mt-3 text-navy/65">
              Each day keeps nearby places together. Tap a stop if you want to know why it is there.
            </p>
          </div>

          <div role="tablist" aria-label="Trip days" className="mt-8 flex gap-2 overflow-x-auto border-b-2 border-navy pb-px">
            {scene.days.map((item, index) => (
              <button
                key={item.index}
                role="tab"
                type="button"
                aria-selected={index === idx}
                onClick={() => {
                  setDayIdx(index)
                  setOpen(null)
                }}
                className={
                  'min-w-36 shrink-0 border-b-4 px-4 pb-4 pt-2 text-left transition-colors ' +
                  (index === idx
                    ? 'border-sun text-navy'
                    : 'border-transparent text-navy/50 hover:text-navy')
                }
              >
                <span className="block text-xs font-bold uppercase tracking-[0.12em]">
                  Day {two(index + 1)}
                </span>
                <span className="mt-1 block font-display text-xl leading-tight">
                  {item.zone.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <div role="tabpanel">
              <SceneTimeline
                day={day}
                activeId={open?.activity.id ?? null}
                onOpen={setOpen}
                onAdjust={adjust}
                onReset={() => onChange(resetDay(scene, idx))}
              />
            </div>

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-navy/45">
                Route for the day
              </p>
              <RouteDiagram items={day.items} activeId={open?.activity.id ?? null} title={day.zone.title} />
            </aside>
          </div>
        </section>

        <section className="mt-16 border-t border-navy/15 pt-8">
          <button
            type="button"
            onClick={() => setShowMood((current) => !current)}
            className="text-sm font-bold underline decoration-sun decoration-2 underline-offset-4"
            aria-expanded={showMood}
          >
            {showMood ? 'Hide trip preferences' : 'Want to change the feel of the trip?'}
          </button>

          {showMood && (
            <div className="mt-5 max-w-3xl">
              <p className="text-sm text-navy/60">
                This keeps your destination and interests, but changes the rhythm of the days.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    type="button"
                    aria-pressed={scene.mood === mood.id}
                    onClick={() => changeMood(mood.id)}
                    className={
                      'rounded-full border-2 px-5 py-2.5 font-medium transition-colors ' +
                      (scene.mood === mood.id
                        ? 'border-navy bg-navy text-sand'
                        : 'border-navy/25 bg-linen hover:border-navy')
                    }
                  >
                    {mood.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="mt-14 border-t-2 border-navy pt-10">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
              Need to change something?
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl">
              Adjust just this day.
            </h2>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {ADJUSTMENTS.map(({ kind, label, body, Icon }) => (
              <button
                key={kind}
                type="button"
                onClick={() => adjust(kind)}
                className="group flex items-start gap-4 border-2 border-navy/20 bg-linen p-5 text-left transition-colors hover:border-navy hover:bg-navy hover:text-sand"
              >
                <Icon size={20} className="mt-0.5 shrink-0 text-sun-deep group-hover:text-sun" />
                <span>
                  <strong className="block font-display text-xl">{label}</strong>
                  <span className="mt-1 block text-sm text-navy/65 group-hover:text-sand/70">
                    {body}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <div className="mt-14 border-t border-navy/15 pt-7">
          <button
            type="button"
            onClick={action?.onClick}
            className="font-bold underline decoration-sun decoration-2 underline-offset-4"
          >
            Change the trip
          </button>
        </div>
      </main>

      <ActivityPanel item={open} onClose={close} />
    </div>
  )
}
