import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { INTEREST_LABELS, MOODS, adjustDay, buildScene } from '../engine/sceneEngine'
import type { Mood, Scene, ScheduledItem } from '../types'
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

export default function SceneResult({ scene, onChange, action }: Props) {
  const [idx, setDayIdx] = useState(0)
  const [open, setOpen] = useState<ScheduledItem | null>(null)
  const [showAdjustments, setShowAdjustments] = useState(false)

  const day = scene.days[idx]

  const changeMood = (mood: Mood) => {
    onChange(buildScene(scene.brief, mood, scene.pace))
    setDayIdx(0)
    setOpen(null)
  }

  const adjust = (kind: 'slower' | 'rain' | 'tired') => onChange(adjustDay(scene, idx, kind))
  const close = () => setOpen(null)

  const priorities = scene.brief.interests
    .slice(0, 3)
    .map((interest) => INTEREST_LABELS[interest] ?? interest)
    .join(', ')

  if (!day) return null

  return (
    <main className="min-h-screen bg-sand text-navy">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <button
          type="button"
          onClick={action?.onClick}
          className="inline-flex items-center gap-2 text-sm font-bold"
        >
          <ArrowLeft size={17} />
          {action?.label ?? 'Back to planning'}
        </button>
        <span className="font-display text-2xl">Ona</span>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <div className="overflow-hidden rounded-[2rem] bg-navy text-sand">
          <div className="grid min-h-[360px] lg:grid-cols-[1.05fr_.95fr]">
            <div className="flex flex-col justify-end p-7 sm:p-10 lg:p-14">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun">
                Your trip
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-5xl leading-[.95] sm:text-6xl lg:text-7xl">
                {scene.destination.name}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-sand/70">
                {scene.days.length} days · {scene.interpretation.pace.toLowerCase()} pace
                {priorities ? ' · with ' + priorities.toLowerCase() + ' in mind' : ''}
              </p>
            </div>
            <DestinationArt destination={scene.destination} className="min-h-[300px] h-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20 sm:px-8">
        <div className="mb-8 flex flex-wrap gap-2">
          {scene.days.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setDayIdx(index)
                setOpen(null)
              }}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                idx === index ? 'border-navy bg-navy text-sand' : 'border-navy/20 bg-linen hover:border-navy'
              }`}
            >
              Day {two(index + 1)}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="mb-7">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-sun-deep">
                Day {two(idx + 1)}
              </p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">{day.title}</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-navy/60">
                {day.zone.blurb}
              </p>
            </div>

            <SceneTimeline items={day.items} onOpen={setOpen} />
          </div>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <RouteDiagram items={day.items} activeId={open?.activity.id ?? null} title={day.zone.title} onOpen={setOpen} />
          </aside>
        </div>

        {open && <ActivityPanel item={open} onClose={close} />}

        <section className="mt-14 border-t border-navy/15 pt-8">
          <button
            type="button"
            onClick={() => setShowAdjustments((current) => !current)}
            className="text-sm font-bold underline decoration-sun decoration-2 underline-offset-4"
            aria-expanded={showAdjustments}
          >
            {showAdjustments ? 'Hide trip options' : 'Fine-tune the trip'}
          </button>

          {showAdjustments && (
            <div className="mt-6 grid gap-8 lg:grid-cols-2">
              <div>
                <p className="font-display text-2xl">Change the feel</p>
                <p className="mt-2 text-sm text-navy/60">
                  Keep the same destination and interests, but make the days slower, fuller or more focused.
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

              <div>
                <p className="font-display text-2xl">Change this day</p>
                <p className="mt-2 text-sm text-navy/60">
                  Make the selected day easier, weather-friendly or quieter in the evening.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button type="button" onClick={() => adjust('slower')} className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-medium hover:border-navy">
                    Make it easier
                  </button>
                  <button type="button" onClick={() => adjust('rain')} className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-medium hover:border-navy">
                    If it rains
                  </button>
                  <button type="button" onClick={() => adjust('tired')} className="rounded-full border-2 border-navy/20 px-4 py-2 text-sm font-medium hover:border-navy">
                    Quieter evening
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}
