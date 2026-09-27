import { useCallback, useState } from 'react'
import {
  MOODS,
  INTEREST_LABELS,
  adjustDay,
  buildScene,
  resetDay,
} from '../engine/sceneEngine'
import type { Adjust, Mood, Scene, ScheduledItem } from '../types'
import ActivityPanel from './ActivityPanel'
import DestinationArt from './DestinationArt'
import InterpretationPanel from './InterpretationPanel'
import RouteDiagram from './RouteDiagram'
import SceneTimeline from './SceneTimeline'

interface Props {
  scene: Scene
  onChange: (scene: Scene) => void
  action?: { label: string; onClick: () => void }
}

const two = (n: number) => String(n).padStart(2, '0')

export default function SceneResult({
  scene,
  onChange,
  action,
}: Props) {
  const [dayIdx, setDayIdx] = useState(0)
  const [open, setOpen] = useState<ScheduledItem | null>(null)

  const close = useCallback(() => {
    setOpen(null)
  }, [])

  const idx = Math.min(dayIdx, scene.days.length - 1)
  const day = scene.days[idx]
  const d = scene.destination

  const meta = [
    scene.ctx.moodLabel,
    ...scene.brief.interests
      .slice(0, 2)
      .map((i) => INTEREST_LABELS[i]),
  ].join(' · ')

  const changeMood = (mood: Mood) => {
    setOpen(null)
    onChange(buildScene(scene.brief, mood, scene.pace))
  }

  const adjust = (kind: Adjust) => {
    setOpen(null)
    onChange(adjustDay(scene, idx, kind))
  }

  return (
    <div>
      <header className="overflow-hidden bg-navy text-sand">
        <div className="mx-auto grid max-w-6xl items-end gap-8 px-5 pb-10 pt-12 sm:px-8 md:grid-cols-[1fr_15rem] md:pt-16">
          <div className="min-w-0">
            <h1 className="font-display text-[clamp(3.4rem,13vw,9.5rem)] uppercase leading-[0.88] tracking-tight">
              {d.name}
            </h1>

            <p className="mt-6 text-2xl font-bold tnum">
              {two(scene.days.length)}{' '}
              {scene.days.length === 1 ? 'DAY' : 'DAYS'}
            </p>

            <p className="mt-1 text-base font-medium text-sun">
              {meta}
            </p>

            {action && (
              <button
                type="button"
                onClick={action.onClick}
                className="mt-7 rounded-full border-2 border-sand px-5 py-2.5 font-medium transition-colors hover:bg-sand hover:text-navy"
              >
                {action.label}
              </button>
            )}
          </div>

          <DestinationArt
            destination={d}
            className="hidden aspect-[4/5] w-full rounded-t-[8rem] md:block"
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-12 px-5 py-10 sm:px-8 sm:py-14">
        <section aria-labelledby="mood-title">
          <h2 id="mood-title" className="font-display text-2xl">
            Change the mood
          </h2>

          <p className="mt-1 text-navy/70">
            Scene rebuilds the whole trip around the mood you pick.
          </p>

          <div
            role="group"
            aria-label="Trip mood"
            className="mt-4 flex flex-wrap gap-2.5"
          >
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={scene.mood === m.id}
                onClick={() => changeMood(m.id)}
                className={`rounded-full border-2 px-5 py-2 font-medium transition-colors ${
                  scene.mood === m.id
                    ? 'border-navy bg-navy text-sand'
                    : 'border-navy/30 bg-linen hover:border-navy'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </section>

        <InterpretationPanel data={scene.interpretation} />

        <section aria-label="Itinerary">
          <div
            role="tablist"
            aria-label="Days"
            className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:px-0"
          >
            {scene.days.map((dd, i) => (
              <button
                key={dd.index}
                role="tab"
                type="button"
                aria-selected={i === idx}
                onClick={() => {
                  setDayIdx(i)
                  setOpen(null)
                }}
                className={`shrink-0 border-2 px-5 py-3 text-left transition-colors ${
                  i === idx
                    ? 'border-navy bg-navy text-sand'
                    : 'border-navy/30 hover:border-navy'
                }`}
              >
                <span className="block text-sm font-bold tnum">
                  Day {two(i + 1)}
                </span>

                <span className="block font-display text-lg leading-tight">
                  {dd.zone.title}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
            <div role="tabpanel">
              <SceneTimeline
                day={day}
                activeId={open?.activity.id ?? null}
                onOpen={setOpen}
                onAdjust={adjust}
                onReset={() => onChange(resetDay(scene, idx))}
              />
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <RouteDiagram
                items={day.items}
                activeId={open?.activity.id ?? null}
                title={day.zone.title}
                onOpen={setOpen}
              />
            </div>
          </div>
        </section>
      </div>

      <ActivityPanel
        item={open}
        onClose={close}
      />
    </div>
  )
}