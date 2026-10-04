import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDestination } from '../data/destinations'
import { buildScene, describeParsed, interpret, readBrief } from '../engine/sceneEngine'
import type { Brief } from '../types'

const SAMPLES = [
  'I want a relaxed trip. I love architecture and food. Nothing too touristy.',
  'Four days in Tokyo. I want to eat well, see a few museums and stay out late, but I do not want long journeys.',
  'Three days in New York. Galleries and jazz, and I want to fit in as much as I can.',
]

const STAGES = [
  { title: 'You said', hint: 'A trip described in ordinary words.' },
  { title: 'Ona understands', hint: 'Words turned into planning constraints.' },
  { title: 'Ona builds', hint: 'Constraints turned into days.' },
]

export default function HowItWorks() {
  const [sample, setSample] = useState(0)
  const [stage, setStage] = useState(0)

  const { parsed, scene, chips } = useMemo(() => {
    const p = readBrief(SAMPLES[sample])
    const brief: Brief = {
      destination: p.destination ?? 'lisbon',
      days: p.days ?? 3,
      interests: p.interests.length ? p.interests : ['food'],
      pace: p.pace ?? 'balanced',
      avoid: p.avoid,
    }
    return { parsed: p, scene: buildScene(brief), chips: describeParsed(p) }
  }, [sample])

  const it = interpret(scene.brief, scene.ctx)
  const assumed: string[] = []
  if (!parsed.destination) assumed.push(`No city mentioned, so Ona used ${getDestination(scene.brief.destination).name}.`)
  if (!parsed.days) assumed.push(`No length mentioned, so Ona used ${scene.brief.days} days.`)

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-5xl leading-none sm:text-7xl">How it works</h1>
      <p className="mt-5 max-w-2xl text-lg text-navy/75">
        Ona does not paste a list of attractions. It turns what you said into constraints first, then plans against them. Pick a sentence
        and step through it.
      </p>

      <div className="mt-10">
        <p className="font-bold">Try a sentence</p>
        <div role="group" aria-label="Sample sentences" className="mt-3 grid gap-3 md:grid-cols-3">
          {SAMPLES.map((s, i) => (
            <button
              key={s}
              type="button"
              aria-pressed={sample === i}
              onClick={() => setSample(i)}
              className={`border-2 p-4 text-left transition-colors ${
                sample === i ? 'border-navy bg-navy text-sand' : 'border-navy/30 bg-linen hover:border-navy'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[17rem_1fr] lg:gap-14">
        <ol className="flex gap-3 overflow-x-auto lg:flex-col" aria-label="Stages">
          {STAGES.map((s, i) => (
            <li key={s.title} className="shrink-0 lg:shrink">
              <button
                type="button"
                aria-current={stage === i ? 'step' : undefined}
                onClick={() => setStage(i)}
                className={`w-full border-l-4 px-5 py-4 text-left transition-colors ${
                  stage === i ? 'border-sun bg-linen' : 'border-navy/20 hover:bg-linen/60'
                }`}
              >
                <span className="tnum text-sm font-bold text-sun-deep">Step {i + 1}</span>
                <span className="block font-display text-2xl leading-tight">{s.title}</span>
                <span className="mt-1 hidden text-sm text-navy/70 lg:block">{s.hint}</span>
              </button>
            </li>
          ))}
        </ol>

        <div className="min-h-[24rem] bg-linen p-6 sm:p-9" aria-live="polite">
          {stage === 0 && (
            <div>
              <p className="text-sm font-bold">You said</p>
              <p className="mt-4 font-display text-3xl leading-snug sm:text-4xl">“{SAMPLES[sample]}”</p>
              <p className="mt-6 max-w-lg text-navy/75">
                Nothing here is a form field. Pace, priorities and dislikes are all in the wording.
              </p>
              <button
                type="button"
                onClick={() => setStage(1)}
                className="mt-8 rounded-full bg-navy px-6 py-3 font-medium text-sand hover:bg-navy-soft"
              >
                See what Ona understands
              </button>
            </div>
          )}

          {stage === 1 && (
            <div>
              <p className="text-sm font-bold">Ona understands</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-4 sm:grid-cols-4">
                {[
                  ['Pace', it.pace],
                  ['Main stops per day', `Up to ${it.maxMajor}`],
                  ['Travel tolerance', it.travel],
                  ['Buffer time', it.buffer],
                ].map(([k, v]) => (
                  <div key={k} className="border-t-2 border-navy pt-2">
                    <dt className="text-sm text-navy/70">{k}</dt>
                    <dd className="font-display text-2xl">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-bold">Priorities</h3>
                  <ul className="mt-2 space-y-1">
                    {it.priorities.map((p) => (
                      <li key={p.label} className="flex justify-between border-b border-navy/15 pb-1">
                        <span>{p.label}</span>
                        <span className="text-navy/70">{p.level}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold">Avoiding</h3>
                  <p className="mt-2 text-navy/80">{it.avoid.length ? it.avoid.join(', ') : 'Nothing specific.'}</p>
                  <h3 className="mt-5 font-bold">Words Ona picked up</h3>
                  <p className="mt-2 text-navy/80">{chips.length ? chips.join(', ') : 'Nothing yet.'}</p>
                </div>
              </div>
              {assumed.length > 0 && <p className="mt-6 border-l-4 border-sun bg-sun/20 px-4 py-2.5 text-[0.95rem]">{assumed.join(' ')}</p>}
              <button
                type="button"
                onClick={() => setStage(2)}
                className="mt-8 rounded-full bg-navy px-6 py-3 font-medium text-sand hover:bg-navy-soft"
              >
                See what Ona builds
              </button>
            </div>
          )}

          {stage === 2 && (
            <div>
              <p className="text-sm font-bold">
                Ona builds {scene.days.length} {scene.days.length === 1 ? 'day' : 'days'} in {scene.destination.name}
              </p>
              <ol className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                {scene.days.map((d) => (
                  <li key={d.index} className="border-t-2 border-navy pt-3">
                    <p className="tnum text-sm font-bold text-sun-deep">Day {String(d.index + 1).padStart(2, '0')}</p>
                    <p className="font-display text-2xl leading-tight">{d.zone.title}</p>
                    <ul className="mt-2 space-y-0.5 text-[0.95rem] text-navy/85">
                      {d.items.map((i) => (
                        <li key={i.activity.id} className="flex gap-3">
                          <span className="tnum w-11 shrink-0 font-medium text-navy/60">{i.start}</span>
                          {i.activity.name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <Link to="/plan" className="mt-8 inline-block rounded-full bg-sun px-6 py-3 font-bold text-navy hover:bg-[#eaa060]">
                Try it with your own trip
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
