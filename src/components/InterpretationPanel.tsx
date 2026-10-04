import type { Interpretation } from '../types'

export default function InterpretationPanel({ data }: { data: Interpretation }) {
  const facts: [string, string][] = [
    ['Pace', data.pace],
    ['Main stops per day', `Up to ${data.maxMajor}`],
    ['Travel tolerance', data.travel],
    ['Buffer time', data.buffer],
  ]
  return (
    <section aria-labelledby="read-title" className="rounded-tl-[3rem] rounded-br-[3rem] bg-mist/70 p-6 sm:p-9">
      <h2 id="read-title" className="font-display text-3xl">How Ona read your brief</h2>
      <p className="mt-2 max-w-2xl text-navy/75">
        Your words became planning constraints. The itinerary below is built from these, and every stop can tell you which one put it there.
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-x-8 gap-y-5 lg:grid-cols-4">
        {facts.map(([k, v]) => (
          <div key={k} className="border-t-2 border-navy pt-3">
            <dt className="text-sm text-navy/70">{k}</dt>
            <dd className="mt-0.5 font-display text-2xl">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="font-bold">Priorities</h3>
          <ul className="mt-2 space-y-1.5">
            {data.priorities.map((p) => (
              <li key={p.label} className="flex justify-between gap-4 border-b border-navy/15 pb-1.5">
                <span>{p.label}</span>
                <span className="text-navy/70">{p.level}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-bold">Also taken into account</h3>
          <p className="mt-2 text-navy/80">{data.secondary.length ? data.secondary.join(', ') : 'Nothing extra.'}</p>
        </div>
        <div>
          <h3 className="font-bold">Avoiding</h3>
          <p className="mt-2 text-navy/80">{data.avoid.length ? data.avoid.join(', ') : 'Nothing specific.'}</p>
        </div>
      </div>
    </section>
  )
}
