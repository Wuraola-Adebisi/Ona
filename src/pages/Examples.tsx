import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import SceneResult from '../components/SceneResult'
import TripCard from '../components/TripCard'
import { getDestination } from '../data/destinations'
import { EXAMPLES, type Example } from '../data/examples'
import { PACE_LABELS, buildScene } from '../engine/sceneEngine'
import type { DestinationId, Scene } from '../types'

function ExampleTrip({ example }: { example: Example }) {
  const navigate = useNavigate()
  const [scene, setScene] = useState<Scene>(() => buildScene(example.brief))
  return (
    <SceneResult
      scene={scene}
      onChange={setScene}
      action={{ label: 'Plan a trip like this', onClick: () => navigate('/plan', { state: { brief: example.brief } }) }}
    />
  )
}

export default function Examples() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('trip') as DestinationId | null
  const current = EXAMPLES.find((e) => e.id === requested) ?? EXAMPLES[0]

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
        <h1 className="font-display text-5xl leading-none sm:text-7xl">Examples</h1>
        <p className="mt-5 max-w-2xl text-lg text-navy/75">
          Four trips, each built from a short brief. Pick one, then try the mood switcher, open a stop, or rework a day.
        </p>
        <div role="group" aria-label="Example trips" className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {EXAMPLES.map((e) => (
            <button
              key={e.id}
              type="button"
              aria-pressed={current.id === e.id}
              onClick={() => setParams({ trip: e.id }, { replace: true })}
              className="text-left"
            >
              <TripCard
                compact
                selected={current.id === e.id}
                destination={getDestination(e.id)}
                meta={`${e.brief.days} days, ${PACE_LABELS[e.brief.pace].toLowerCase()}`}
              />
            </button>
          ))}
        </div>
        <p className="mt-8 max-w-2xl border-l-4 border-sun bg-linen px-5 py-4">
          <span className="font-bold">The brief: </span>
          {current.said}
        </p>
      </section>

      <ExampleTrip key={current.id} example={current} />
    </div>
  )
}
