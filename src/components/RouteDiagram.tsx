import { ArrowUpRight } from 'lucide-react'
import type { ScheduledItem } from '../types'

interface Props {
  items: ScheduledItem[]
  activeId: string | null
  title: string
  onOpen: (item: ScheduledItem) => void
}

export default function RouteDiagram({
  items,
  activeId,
  title,
  onOpen,
}: Props) {
  const travel = items.reduce((sum, item) => sum + item.travelMin, 0)
  const last = items[items.length - 1]

  return (
    <div className="relative overflow-hidden rounded-tl-[3rem] rounded-br-lg bg-mist/70 p-6 sm:p-7">
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        preserveAspectRatio="none"
        viewBox="0 0 300 600"
      >
        <path
          d="M-20 90 C 90 150, 20 260, 150 330 S 240 500, 330 540"
          fill="none"
          stroke="#8aa4c0"
          strokeOpacity=".45"
          strokeWidth="26"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="relative">
        <p className="font-display text-2xl leading-tight">
          Route for the day
        </p>

        <p className="mt-1 text-sm text-navy/70">{title}</p>

        <ol className="mt-6">
          {items.map((item, index) => {
            const active = activeId === item.activity.id

            return (
              <li key={item.activity.id} className="relative">
                {index > 0 && (
                  <div className="ml-[0.45rem] flex items-center gap-3 py-1">
                    <span
                      aria-hidden
                      className="h-8 border-l-2 border-dashed border-navy/50"
                    />
                    <span className="text-xs text-navy/65">
                      {item.travelMin} min
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onOpen(item)}
                  aria-current={active ? 'true' : undefined}
                  className={`group flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors ${
                    active ? 'bg-sand/80' : 'hover:bg-sand/60'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`size-[1.1rem] shrink-0 rounded-full border-2 border-navy transition-colors ${
                      active ? 'bg-sun' : 'bg-sand'
                    }`}
                  />

                  <span
                    className={`min-w-0 flex-1 text-[0.95rem] ${
                      active ? 'font-bold' : 'font-medium'
                    }`}
                  >
                    {item.activity.name}
                  </span>

                  <ArrowUpRight
                    size={15}
                    aria-hidden
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-60"
                  />
                </button>
              </li>
            )
          })}
        </ol>

        <dl className="mt-7 grid grid-cols-2 gap-4 border-t border-navy/20 pt-4 text-sm">
          <div>
            <dt className="text-navy/65">Stops</dt>
            <dd className="font-bold">{items.length}</dd>
          </div>

          <div>
            <dt className="text-navy/65">Time in transit</dt>
            <dd className="font-bold">{travel} min</dd>
          </div>

          <div className="col-span-2 border-t border-navy/10 pt-3">
            <dt className="text-navy/65">Day ends around</dt>
            <dd className="font-bold tnum">
              {last ? last.end : '-'}
            </dd>
          </div>
        </dl>

        <p className="mt-5 text-xs text-navy/55">
          Select a stop to see why Ona chose it.
        </p>
      </div>
    </div>
  )
}